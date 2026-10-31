import { NextResponse } from "next/server";
import { rateLimited, saveRecord } from "@/lib/store";

const clip = (v: unknown, n = 200) => String(v ?? "").trim().slice(0, n);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (await rateLimited(`lead:${ip}`)) return NextResponse.json({ ok: false }, { status: 429 });
  const b = await req.json().catch(() => ({}));
  if (b.website) return NextResponse.json({ ok: true });
  const lead = {
    name: clip(b.name, 100),
    email: clip(b.email, 254),
    phone: clip(b.phone, 30),
    message: clip(b.message, 1000),
    volume: clip(b.volume, 80),
    company: clip(b.company, 120),
    industry: clip(b.industry, 80),
    size: clip(b.size, 40),
    goals: Array.isArray(b.goals) ? b.goals.map((g: unknown) => clip(g, 40)).slice(0, 8) : [],
    products: Array.isArray(b.products) ? b.products.map((g: unknown) => clip(g, 40)).slice(0, 9) : [],
    source: clip(b.source, 80),
  };
  await saveRecord("leads", lead, "LEAD_WEBHOOK_URL");
  return NextResponse.json({ ok: true }); // never block the visitor from reaching WhatsApp
}
