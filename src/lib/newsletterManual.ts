import { renderCustom, renderIssueMc, mcLinks } from "@/lib/newsletterEmail";
import { getSent } from "@/lib/newsletterDb";
import { audienceSize, mcConfigured, McError, sendCampaign, weeklyTitle, type Audience } from "@/lib/mailchimp";
import { cleanHtml, getPostBySlug, wordCount } from "@/lib/postsStore";

// Manual sending from the admin, separate from the weekly schedule. Needs Mailchimp.
export type ManualResult = { ok: boolean; message: string; recipients?: number };
type Action = "test" | "send" | "schedule";
const fail = (message: string): ManualResult => ({ ok: false, message });

function check(o: { action: Action; testTo?: string; scheduleAt?: string }) {
  if (!mcConfigured()) return "Mailchimp is not connected yet. Add MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID and MAILCHIMP_REPLY_TO in the environment settings.";
  if (o.action === "test" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(o.testTo ?? "")) return "Enter a valid email address for the test.";
  if (o.action === "schedule") {
    const t = new Date(o.scheduleAt ?? "");
    if (isNaN(+t) || +t < Date.now() + 15 * 60_000) return "Pick a time at least 15 minutes from now.";
  }
  return null;
}
// Mailchimp only schedules on the quarter hour, so round up to the next :00, :15, :30 or :45.
const when = (o: { scheduleAt?: string }) => { if (!o.scheduleAt) return undefined; const q = 15 * 60_000; return new Date(Math.ceil(+new Date(o.scheduleAt) / q) * q); };
const done = (action: Action, n: number, testTo?: string): ManualResult =>
  action === "test" ? { ok: true, message: `Test sent to ${testTo}. Check the inbox (and spam).` } : action === "schedule" ? { ok: true, message: `Scheduled for ${n} subscriber${n === 1 ? "" : "s"}.`, recipients: n } : { ok: true, message: `Sending to ${n} subscriber${n === 1 ? "" : "s"} now.`, recipients: n };

// Send one of the blog posts. Sending a post by hand also takes it out of the weekly queue.
export async function sendPost(o: { slug: string; audience: Audience; action: Action; testTo?: string; scheduleAt?: string; again?: boolean }): Promise<ManualResult> {
  const bad = check(o); if (bad) return fail(bad);
  const post = await getPostBySlug(o.slug);
  if (!post) return fail("That post was not found, or it isn't published yet.");
  try {
    if (o.action !== "test" && !o.again && (await getSent()).some((s) => s.postSlug === post.slug)) return fail("This post has already been emailed. Tick \"send again\" if you really want to send it a second time.");
    const n = o.action === "test" ? 1 : await audienceSize(o.audience);
    if (o.action !== "test" && n === 0) return fail("There are no subscribers in that audience yet.");
    await sendCampaign({ title: o.action === "test" ? `Test ${post.slug}` : weeklyTitle(post.kind, post.slug), subject: o.action === "test" ? `[Test] ${post.title}` : post.title, previewText: post.excerpt, html: renderIssueMc(post).html, audience: o.audience, testTo: o.action === "test" ? o.testTo : undefined, scheduleAt: o.action === "schedule" ? when(o) : undefined });
    return done(o.action, n, o.testTo);
  } catch (e) { return fail(e instanceof McError || e instanceof Error ? e.message : "Something went wrong."); }
}

// Send a newsletter written from scratch (not tied to a blog post).
export async function sendCustom(o: { subject: string; previewText?: string; html: string; audience: Audience; action: Action; testTo?: string; scheduleAt?: string }): Promise<ManualResult> {
  const bad = check(o); if (bad) return fail(bad);
  const subject = o.subject.trim();
  const html = cleanHtml(o.html);
  if (subject.length < 3 || subject.length > 150) return fail("The subject needs 3 to 150 characters.");
  if (wordCount(html) < 10) return fail("Write a little more before sending (at least 10 words).");
  try {
    const n = o.action === "test" ? 1 : await audienceSize(o.audience);
    if (o.action !== "test" && n === 0) return fail("There are no subscribers in that audience yet.");
    const mail = renderCustom({ subject, preheader: o.previewText, html, links: mcLinks });
    await sendCampaign({ title: o.action === "test" ? `Test: ${subject}` : `Special: ${subject}`, subject: o.action === "test" ? `[Test] ${subject}` : subject, previewText: o.previewText, html: mail.html, audience: o.audience, testTo: o.action === "test" ? o.testTo : undefined, scheduleAt: o.action === "schedule" ? when(o) : undefined });
    return done(o.action, n, o.testTo);
  } catch (e) { return fail(e instanceof McError || e instanceof Error ? e.message : "Something went wrong."); }
}
