import { createHash } from "node:crypto";
import type { BlogKind } from "@/lib/blog";

// Mailchimp Marketing API (v3.0). Mailchimp is the source of truth for subscribers, double opt-in,
// unsubscribes and the record of what was sent, so none of it depends on our server's disk.
// Topics are tags on each contact: weekly-tech and weekly-sales.

const KEY = () => process.env.MAILCHIMP_API_KEY ?? "";
const AUDIENCE = () => process.env.MAILCHIMP_AUDIENCE_ID ?? "";
const REPLY_TO = () => process.env.MAILCHIMP_REPLY_TO ?? "";
const FROM_NAME = () => process.env.MAILCHIMP_FROM_NAME ?? "The Marichi Weekly";
const base = () => (process.env.MAILCHIMP_API_URL ?? `https://${KEY().split("-").pop()}.api.mailchimp.com/3.0`).replace(/\/$/, "");

export const mcConfigured = () => !!(KEY().includes("-") && AUDIENCE() && REPLY_TO());
export const tagFor = (k: BlogKind) => `weekly-${k}`;
export const hashEmail = (e: string) => createHash("md5").update(e.trim().toLowerCase()).digest("hex");

export class McError extends Error { constructor(message: string, public status = 500) { super(message); } }

async function mc<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${base()}${path}`, {
    method,
    headers: { Authorization: `Basic ${Buffer.from(`marichi:${KEY()}`).toString("base64")}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  }).catch(() => { throw new McError("Could not reach Mailchimp.", 502); });
  if (res.status === 204) return undefined as T;
  const j = (await res.json().catch(() => ({}))) as { detail?: string; title?: string; errors?: { field?: string; message?: string }[] };
  if (!res.ok) throw new McError([j.detail ?? j.title ?? `Mailchimp error ${res.status}`, ...(j.errors ?? []).map((e) => `${e.field ?? ""} ${e.message ?? ""}`.trim())].filter(Boolean).join(" "), res.status);
  return j as T;
}

// ---- subscribers ----
export async function subscribe(email: string, topics: BlogKind[]) {
  const hash = hashEmail(email);
  const member = await mc<{ status: string }>("PUT", `/lists/${AUDIENCE()}/members/${hash}`, { email_address: email.toLowerCase(), status_if_new: "pending" }); // "pending" makes Mailchimp send its double opt-in email
  if (member.status === "unsubscribed") await mc("PUT", `/lists/${AUDIENCE()}/members/${hash}`, { email_address: email.toLowerCase(), status: "pending" }); // asks them to confirm again
  await mc("POST", `/lists/${AUDIENCE()}/members/${hash}/tags`, { tags: (["tech", "sales"] as BlogKind[]).map((k) => ({ name: tagFor(k), status: topics.includes(k) ? "active" : "inactive" })) });
}

type Segment = { id: number; name: string; member_count: number };
async function segments(): Promise<Segment[]> {
  const r = await mc<{ segments: Segment[] }>("GET", `/lists/${AUDIENCE()}/segments?type=static&count=200&fields=segments.id,segments.name,segments.member_count`);
  return r.segments ?? [];
}

export type AudienceInfo = { name: string; subscribed: number; tech: number; sales: number };
export async function audienceInfo(): Promise<AudienceInfo> {
  const [list, segs] = await Promise.all([mc<{ name: string; stats: { member_count: number } }>("GET", `/lists/${AUDIENCE()}?fields=name,stats.member_count`), segments()]);
  const n = (k: BlogKind) => segs.find((s) => s.name === tagFor(k))?.member_count ?? 0;
  return { name: list.name, subscribed: list.stats.member_count, tech: n("tech"), sales: n("sales") };
}

// ---- history (also the "already sent" record) ----
export type Campaign = { id: string; webId: number; title: string; subject: string; status: string; at: string; recipients: number };
export async function campaigns(): Promise<Campaign[]> {
  const r = await mc<{ campaigns: { id: string; web_id: number; status: string; send_time?: string; create_time: string; emails_sent?: number; settings: { title: string; subject_line: string } }[] }>("GET", `/campaigns?count=300&sort_field=create_time&sort_dir=DESC&fields=campaigns.id,campaigns.web_id,campaigns.status,campaigns.send_time,campaigns.create_time,campaigns.emails_sent,campaigns.settings.title,campaigns.settings.subject_line`);
  return (r.campaigns ?? []).map((c) => ({ id: c.id, webId: c.web_id, title: c.settings.title, subject: c.settings.subject_line, status: c.status, at: c.send_time || c.create_time, recipients: c.emails_sent ?? 0 }));
}
export const weeklyTitle = (kind: BlogKind, slug: string) => `Weekly [${kind}] ${slug}`;
export const parseWeekly = (title: string) => { const m = title.match(/^Weekly \[(tech|sales)\] (.+)$/); return m ? { kind: m[1] as BlogKind, slug: m[2] } : null; };
const COUNTS = new Set(["sent", "sending", "schedule"]);
export async function sentWeekly() {
  return (await campaigns()).filter((c) => COUNTS.has(c.status)).flatMap((c) => { const w = parseWeekly(c.title); return w ? [{ kind: w.kind, postSlug: w.slug, sentAt: c.at, recipients: c.recipients, failed: 0 }] : []; });
}
export const reportUrl = (webId: number) => `https://${KEY().split("-").pop()}.admin.mailchimp.com/reports/summary?id=${webId}`;

// ---- sending ----
export type Audience = BlogKind | "all";
export async function audienceSize(a: Audience) {
  const info = await audienceInfo();
  return a === "all" ? info.subscribed : info[a];
}

// Creates a campaign, fills it, then sends a test copy, schedules it, or sends it. A half-made draft is always deleted
// when something fails, so a retry starts clean.
export async function sendCampaign(o: { title: string; subject: string; previewText?: string; html: string; audience: Audience; testTo?: string; scheduleAt?: Date }) {
  let recipients: Record<string, unknown> = { list_id: AUDIENCE() };
  if (o.audience !== "all" && !o.testTo) {
    const seg = (await segments()).find((s) => s.name === tagFor(o.audience as BlogKind));
    if (!seg) throw new McError(`Nobody has chosen the ${o.audience} topic yet, so there is no one to send to.`, 400);
    recipients = { ...recipients, segment_opts: { match: "all", conditions: [{ condition_type: "StaticSegment", field: "static_segment", op: "static_is", value: seg.id }] } };
  }
  const c = await mc<{ id: string; web_id: number }>("POST", "/campaigns", { type: "regular", recipients, settings: { title: o.title.slice(0, 100), subject_line: o.subject.slice(0, 150), preview_text: (o.previewText ?? "").slice(0, 150), from_name: FROM_NAME(), reply_to: REPLY_TO() } });
  try {
    await mc("PUT", `/campaigns/${c.id}/content`, { html: o.html });
    if (o.testTo) {
      await mc("POST", `/campaigns/${c.id}/actions/test`, { test_emails: [o.testTo], send_type: "html" });
      await mc("DELETE", `/campaigns/${c.id}`).catch(() => {});
      return { id: c.id, webId: c.web_id, tested: true };
    }
    const list = await mc<{ is_ready: boolean; items: { type: string; heading: string; details: string }[] }>("GET", `/campaigns/${c.id}/send-checklist`);
    if (!list.is_ready) throw new McError(list.items.filter((i) => i.type === "error").map((i) => `${i.heading}: ${i.details}`).join(" ") || "Mailchimp says this campaign is not ready to send.", 400);
    if (o.scheduleAt) await mc("POST", `/campaigns/${c.id}/actions/schedule`, { schedule_time: o.scheduleAt.toISOString() });
    else await mc("POST", `/campaigns/${c.id}/actions/send`);
    return { id: c.id, webId: c.web_id, tested: false };
  } catch (e) {
    await mc("DELETE", `/campaigns/${c.id}`).catch(() => {});
    throw e;
  }
}
