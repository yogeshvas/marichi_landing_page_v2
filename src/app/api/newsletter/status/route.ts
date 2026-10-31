import { NextResponse } from "next/server";
import { deny, isAdmin } from "@/lib/adminAuth";
import { getSent, getSubscribers } from "@/lib/newsletterDb";
import { getAllPosts } from "@/lib/postsStore";
import { queueFor, schedule, TZ } from "@/lib/newsletterSchedule";

export const dynamic = "force-dynamic";

// A health check: who is subscribed, what is next in each queue, what has gone out.
export async function GET(req: Request) {
  if (!isAdmin(req)) return deny();
  const [subs, sent, all] = await Promise.all([getSubscribers(), getSent(), getAllPosts()]);
  const active = subs.filter((s) => s.confirmed && !s.unsubscribed);
  return NextResponse.json({
    provider: { configured: !!(process.env.RESEND_API_KEY && process.env.NEWSLETTER_FROM), from: process.env.NEWSLETTER_FROM ?? null },
    schedule: schedule(), timezone: TZ,
    subscribers: { total: subs.length, confirmed: active.length, pendingConfirmation: subs.filter((s) => !s.confirmed && !s.unsubscribed).length, unsubscribed: subs.filter((s) => s.unsubscribed).length, tech: active.filter((s) => s.topics.includes("tech")).length, sales: active.filter((s) => s.topics.includes("sales")).length },
    queue: { tech: queueFor("tech", sent, all).map((p) => p.slug), sales: queueFor("sales", sent, all).map((p) => p.slug) },
    sent,
  });
}
