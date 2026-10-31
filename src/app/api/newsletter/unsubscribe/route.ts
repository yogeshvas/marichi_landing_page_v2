import { NextResponse } from "next/server";
import { findByToken, recordUnsubscribe } from "@/lib/newsletterDb";

export const dynamic = "force-dynamic";

async function unsub(token: string) {
  const s = await findByToken(token);
  if (s && !s.unsubscribed) await recordUnsubscribe(s.email);
  return !!s;
}

// The link in every email. Visiting it unsubscribes and shows a confirmation page.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const ok = await unsub(url.searchParams.get("token") ?? "");
  return NextResponse.redirect(new URL(ok ? "/newsletter/unsubscribed/" : "/newsletter/?unsubscribe=invalid", url.origin), 303);
}

// One-click unsubscribe, used by Gmail and Apple Mail's own "Unsubscribe" button (RFC 8058).
export async function POST(req: Request) {
  const ok = await unsub(new URL(req.url).searchParams.get("token") ?? "");
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}
