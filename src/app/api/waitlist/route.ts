import { NextResponse } from "next/server";
import { rateLimited, saveRecord } from "@/lib/store";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clip = (v: unknown, n = 120) => String(v ?? "").trim().slice(0, n);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (await rateLimited(`wl:${ip}`)) return NextResponse.json({ ok: false, error: "Too many attempts. Try again shortly." }, { status: 429 });
  const b = await req.json().catch(() => ({}));
  if (b.website) return NextResponse.json({ ok: true });
  const email = clip(b.email, 254).toLowerCase();
  if (!EMAIL.test(email)) return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  const ok = await saveRecord("waitlist", { email, name: clip(b.name), company: clip(b.company), phone: clip(b.phone, 30), product: clip(b.product, 40), source: clip(b.source, 60) }, "WAITLIST_WEBHOOK_URL");
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false, error: "Could not save your details. Please try again." }, { status: 500 });
}
