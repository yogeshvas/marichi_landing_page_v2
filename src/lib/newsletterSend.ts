import type { BlogKind } from "@/lib/blog";
import { activeFor, getSent, logSent } from "@/lib/newsletterDb";
import { renderIssue, renderIssueMc } from "@/lib/newsletterEmail";
import { dayKeyIn, nextFor, schedule, weekdayIn } from "@/lib/newsletterSchedule";
import { audienceSize, mcConfigured, sendCampaign, weeklyTitle, McError } from "@/lib/mailchimp";
import { getAllPosts } from "@/lib/postsStore";

export type RunResult = { ok: boolean; action: "sent" | "dry-run" | "skipped" | "error"; reason?: string; kind?: BlogKind; post?: string; recipients?: number; failed?: number; weekday?: string; provider?: "mailchimp" | "resend" };

const RESEND_FROM = () => process.env.NEWSLETTER_FROM;
const RESEND_KEY = () => process.env.RESEND_API_KEY;
const RESEND_API = () => (process.env.RESEND_API_URL ?? "https://api.resend.com").replace(/\/$/, ""); // override only to point tests at a mock

// Fallback engine for when Mailchimp is not connected (local development): sends one email per person via Resend.
async function resendBatch(rows: { to: string; subject: string; html: string; text: string; unsubscribe: string }[]) {
  let ok = 0, failed = 0;
  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100);
    const res = await fetch(`${RESEND_API()}/emails/batch`, {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY()}`, "Content-Type": "application/json" },
      body: JSON.stringify(chunk.map((r) => ({ from: RESEND_FROM(), to: [r.to], subject: r.subject, html: r.html, text: r.text, headers: { "List-Unsubscribe": `<${r.unsubscribe}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } }))),
    }).catch(() => null);
    if (res?.ok) ok += chunk.length; else failed += chunk.length;
  }
  return { ok, failed };
}

const errText = (e: unknown) => (e instanceof McError || e instanceof Error ? e.message : "Something went wrong.");

// Decides what to send right now. Called by the scheduler (Fridays and Saturdays) and by hand.
//  - kind:   force a blog instead of using today's weekday
//  - dry:    report what would be sent, send nothing
//  - testTo: send ONE copy to this address only
export async function runNewsletter(opts: { now?: Date; kind?: BlogKind; dry?: boolean; testTo?: string } = {}): Promise<RunResult> {
  const now = opts.now ?? new Date();
  const weekday = weekdayIn(now);
  const kind = opts.kind ?? schedule()[weekday];
  const useMc = mcConfigured();
  const provider = useMc ? "mailchimp" : "resend";
  if (!kind) return { ok: true, action: "skipped", reason: `Nothing is scheduled for ${weekday}.`, weekday, provider };

  const [sent, posts] = await Promise.all([getSent().catch(() => []), getAllPosts()]);
  const notReady = useMc ? null : !RESEND_KEY() || !RESEND_FROM() ? "Mailchimp is not connected (MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID, MAILCHIMP_REPLY_TO), so nothing was sent." : null;

  // A test copy never counts as a send and works even when the queue is empty (it uses the latest post).
  if (opts.testTo) {
    const post = nextFor(kind, sent, posts) ?? [...posts].filter((p) => p.kind === kind).sort((a, b) => b.date.localeCompare(a.date))[0];
    if (!post) return { ok: false, action: "error", reason: `There are no ${kind} posts at all.`, kind, provider };
    if (notReady) return { ok: false, action: "error", reason: notReady, kind, post: post.slug, provider };
    try {
      if (useMc) await sendCampaign({ title: `Test ${post.slug}`, subject: `[Test] ${post.title}`, previewText: post.excerpt, html: renderIssueMc(post).html, audience: kind, testTo: opts.testTo });
      else if ((await resendBatch([{ to: opts.testTo, ...renderIssue(post, "test") }])).ok !== 1) throw new Error("The email provider rejected the test message.");
    } catch (e) { return { ok: false, action: "error", reason: errText(e), kind, post: post.slug, provider }; }
    return { ok: true, action: "sent", reason: "Test copy only. It does not count as a send.", kind, post: post.slug, recipients: 1, weekday, provider };
  }

  const today = dayKeyIn(now);
  if (!opts.kind && sent.some((s) => s.kind === kind && dayKeyIn(new Date(s.sentAt)) === today)) return { ok: true, action: "skipped", reason: `The ${kind} issue already went out today.`, kind, weekday, provider };
  const post = nextFor(kind, sent, posts);
  if (!post) return { ok: true, action: "skipped", reason: `No unsent ${kind} posts in the queue. Publish a new post and it will go out next time.`, kind, weekday, provider };

  const count = useMc ? await audienceSize(kind).catch(() => 0) : (await activeFor(kind)).length;
  if (opts.dry) return { ok: true, action: "dry-run", reason: "Nothing sent.", kind, post: post.slug, recipients: count, weekday, provider };
  if (notReady) return { ok: false, action: "error", reason: notReady, kind, post: post.slug, recipients: count, weekday, provider };

  if (useMc) {
    if (!count) return { ok: true, action: "skipped", reason: `No confirmed ${kind} subscribers yet.`, kind, post: post.slug, recipients: 0, weekday, provider };
    try { await sendCampaign({ title: weeklyTitle(kind, post.slug), subject: post.title, previewText: post.excerpt, html: renderIssueMc(post).html, audience: kind }); }
    catch (e) { return { ok: false, action: "error", reason: errText(e), kind, post: post.slug, weekday, provider }; }
    return { ok: true, action: "sent", kind, post: post.slug, recipients: count, failed: 0, weekday, provider };
  }

  const people = await activeFor(kind);
  if (!people.length) return { ok: true, action: "skipped", reason: `No confirmed ${kind} subscribers yet.`, kind, post: post.slug, recipients: 0, weekday, provider };
  const { ok, failed } = await resendBatch(people.map((s) => ({ to: s.email, ...renderIssue(post, s.token) })));
  if (ok > 0) await logSent({ kind, postSlug: post.slug, recipients: ok, failed, sentAt: now.toISOString() }); // log only if something was delivered, so a total failure retries next run
  return { ok: ok > 0, action: ok > 0 ? "sent" : "error", reason: ok > 0 ? undefined : "The email provider rejected every message.", kind, post: post.slug, recipients: ok, failed, weekday, provider };
}
