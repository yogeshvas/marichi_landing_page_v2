import { NextResponse } from "next/server";
import { adminConfigured, checkPassword, COOKIE, sessionToken } from "@/lib/adminSession";
import { rateLimited, rateReset } from "@/lib/store";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (await rateLimited(`admin:${ip}`, 8, 5 * 60_000)) return NextResponse.json({ ok: false, error: "Too many attempts. Wait a few minutes." }, { status: 429 });
  if (!adminConfigured()) return NextResponse.json({ ok: false, error: "Set ADMIN_PASSWORD (16+ characters) in the environment first." }, { status: 503 });
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!checkPassword(String(password ?? ""))) return NextResponse.json({ ok: false, error: "Wrong password." }, { status: 401 });
  await rateReset(`admin:${ip}`); // only failed attempts count against the limit
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, sessionToken(), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
