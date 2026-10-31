import { NextResponse } from "next/server";
import { findByToken } from "@/lib/newsletterDb";
import { saveRecord } from "@/lib/store";

export const dynamic = "force-dynamic";

// Double opt-in: the link in the confirmation email lands here.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const s = await findByToken(url.searchParams.get("token") ?? "");
  if (!s) return NextResponse.redirect(new URL("/newsletter/?confirm=invalid", url.origin), 303);
  if (!s.confirmed) await saveRecord("subscribers", { email: s.email, confirmed: true }, "NEWSLETTER_WEBHOOK_URL");
  return NextResponse.redirect(new URL("/newsletter/confirmed/", url.origin), 303);
}
