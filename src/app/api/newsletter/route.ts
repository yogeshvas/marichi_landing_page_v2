import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { mcConfigured, subscribe as mcSubscribe } from "@/lib/mailchimp";
import { getSubscribers } from "@/lib/newsletterDb";
import { rateLimited, saveRecord } from "@/lib/store";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function sendConfirmation(email: string, link: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM; // e.g. "The Marichi Weekly <news@yourdomain.com>"
  if (!key || !from) {
    console.log(`[newsletter] No email provider configured. Confirmation link for ${email}: ${link}`);
    return;
  }
  await fetch(`${(process.env.RESEND_API_URL ?? "https://api.resend.com").replace(/\/$/, "")}/emails`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: email, subject: "Confirm your subscription to The Marichi Weekly", html: `<p>Thanks for subscribing to The Marichi Weekly.</p><p><a href="${link}">Confirm my subscription</a></p><p>If you did not sign up, you can ignore this email.</p>` }),
  }).catch(() => {});
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (await rateLimited(`nl:${ip}`)) return NextResponse.json({ ok: false, error: "Too many attempts. Try again shortly." }, { status: 429 });
  const body = await req.json().catch(() => ({}));
  if (body.website) return NextResponse.json({ ok: true, pending: true }); // honeypot
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 254) return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  const topics = Array.isArray(body.topics) ? body.topics.filter((t: unknown) => t === "sales" || t === "tech").slice(0, 2) : ["sales", "tech"];
  if (mcConfigured()) {
    // Mailchimp owns the list: it sends its own double opt-in email and handles unsubscribes.
    try { await mcSubscribe(email, topics); return NextResponse.json({ ok: true, pending: true }); }
    catch { return NextResponse.json({ ok: false, error: "We could not sign you up just now. Please try again in a moment." }, { status: 502 }); }
  }
  const existing = (await getSubscribers()).find((x) => x.email === email);
  if (existing?.confirmed && !existing.unsubscribed) return NextResponse.json({ ok: true, pending: true }); // already subscribed: say nothing different, send nothing
  const token = randomUUID();
  const ok = await saveRecord("subscribers", { email, topics, token, confirmed: false, source: String(body.source ?? "site").slice(0, 60) }, "NEWSLETTER_WEBHOOK_URL");
  if (!ok) return NextResponse.json({ ok: false, error: "Could not save your subscription. Please try again." }, { status: 500 });
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  await sendConfirmation(email, `${origin}/api/newsletter/confirm/?token=${token}`);
  return NextResponse.json({ ok: true, pending: true });
}
