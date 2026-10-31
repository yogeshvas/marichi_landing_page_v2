import type { BlogKind, Post } from "@/lib/blog";
import type { Sent } from "@/lib/newsletterDb";

// Which blog goes out on which weekday. Default: Friday = Tech Blog, Saturday = Sales Blog.
// Override with NEWSLETTER_SCHEDULE="Friday:tech,Saturday:sales" (any weekdays, any order).
export const TZ = process.env.NEWSLETTER_TZ ?? "Africa/Lusaka";

export function schedule(): Record<string, BlogKind> {
  const raw = process.env.NEWSLETTER_SCHEDULE ?? "Friday:tech,Saturday:sales";
  const out: Record<string, BlogKind> = {};
  for (const part of raw.split(",")) {
    const [d, k] = part.split(":").map((x) => x.trim());
    if (d && (k === "sales" || k === "tech")) out[d.charAt(0).toUpperCase() + d.slice(1).toLowerCase()] = k;
  }
  return out;
}

export const weekdayIn = (date: Date, tz = TZ) => new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: tz }).format(date);
export const dayKeyIn = (date: Date, tz = TZ) => new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(date); // YYYY-MM-DD

// The next post to send for a blog: the oldest one that has not gone out yet. This is the "sequence":
// publish a new post and it simply joins the back of the queue. NEWSLETTER_START_DATE (YYYY-MM-DD)
// skips older posts so an existing backlog is not mailed out.
export function queueFor(kind: BlogKind, sent: Sent[], posts: Post[]): Post[] {
  const start = process.env.NEWSLETTER_START_DATE ?? "";
  const done = new Set(sent.map((s) => s.postSlug));
  return posts.filter((p) => p.kind === kind && !done.has(p.slug) && (!start || p.date >= start)).sort((a, b) => a.date.localeCompare(b.date));
}
export const nextFor = (kind: BlogKind, sent: Sent[], posts: Post[]) => queueFor(kind, sent, posts)[0];

// When the Nth waiting post of a blog will go out: the next scheduled weekday, then one week apart.
export function sendDates(kind: BlogKind, count: number, from = new Date()): Date[] {
  const day = Object.entries(schedule()).find(([, k]) => k === kind)?.[0];
  if (!day) return [];
  const d = new Date(from.getTime() + 24 * 3600 * 1000);
  for (let i = 0; i < 8 && weekdayIn(d) !== day; i++) d.setTime(d.getTime() + 24 * 3600 * 1000);
  return Array.from({ length: count }, (_, n) => new Date(d.getTime() + n * 7 * 24 * 3600 * 1000));
}
export const fmtSendDate = (d: Date) => new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: TZ }).format(d);
