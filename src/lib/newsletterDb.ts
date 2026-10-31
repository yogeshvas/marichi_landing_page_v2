import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { BlogKind } from "@/lib/blog";
import { mcConfigured, sentWeekly } from "@/lib/mailchimp";

// Newsletter storage. Subscribers are an append-only event log (so history is never lost) that is
// folded into one current record per email. The sent log records which posts have gone out.
// Files live in .data/ (works locally and on a server with a persistent disk). On serverless hosting
// the disk is not kept: swap the four functions marked DB below for a database, nothing else changes.

const dir = path.join(process.cwd(), ".data");

async function readLines<T>(file: string): Promise<T[]> {
  try {
    const raw = await readFile(path.join(dir, file), "utf8");
    return raw.split("\n").filter(Boolean).map((l) => JSON.parse(l) as T);
  } catch { return []; }
}
async function append(file: string, rec: object) {
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, file), JSON.stringify({ ...rec, at: new Date().toISOString() }) + "\n");
}

export type Subscriber = { email: string; topics: BlogKind[]; token: string; confirmed: boolean; unsubscribed: boolean; source?: string; since: string };

type Event = { email: string; topics?: string[]; token?: string; confirmed?: boolean; unsubscribed?: boolean; source?: string; createdAt?: string; at?: string };

const clean = (t?: string[]): BlogKind[] => (t ?? []).filter((x): x is BlogKind => x === "sales" || x === "tech");

// DB: read every subscriber's current state
export async function getSubscribers(): Promise<Subscriber[]> {
  const by = new Map<string, Subscriber>();
  for (const e of await readLines<Event>("subscribers.jsonl")) {
    const email = e.email.toLowerCase();
    const cur = by.get(email);
    const when = e.createdAt ?? e.at ?? "";
    if (e.unsubscribed) { if (cur) cur.unsubscribed = true; }
    else if (e.confirmed) { if (cur) cur.confirmed = true; }
    else if (e.token) by.set(email, { email, topics: clean(e.topics), token: e.token, confirmed: false, unsubscribed: false, source: e.source, since: when }); // a (re)subscribe
  }
  return [...by.values()];
}

export const findByToken = async (token: string) => (token ? (await getSubscribers()).find((s) => s.token === token) : undefined);
export const activeFor = async (kind: BlogKind) => (await getSubscribers()).filter((s) => s.confirmed && !s.unsubscribed && s.topics.includes(kind));

// DB: record an unsubscribe
export const recordUnsubscribe = (email: string) => append("subscribers.jsonl", { email, unsubscribed: true });

export type Sent = { kind: BlogKind; postSlug: string; sentAt: string; recipients: number; failed: number };

// DB: the sent log
export const getSent = async (): Promise<Sent[]> => mcConfigured() ? sentWeekly() : (await readLines<Sent & { at: string }>("newsletter-sent.jsonl")).map((s) => ({ kind: s.kind, postSlug: s.postSlug, sentAt: s.sentAt ?? s.at, recipients: s.recipients, failed: s.failed }));
export const logSent = (s: Omit<Sent, "sentAt"> & { sentAt?: string }) => append("newsletter-sent.jsonl", { ...s, sentAt: s.sentAt ?? new Date().toISOString() });
