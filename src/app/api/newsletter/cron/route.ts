import { NextResponse } from "next/server";
import { deny, isAdmin } from "@/lib/adminAuth";
import { runNewsletter } from "@/lib/newsletterSend";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// The scheduler calls this. With no options it follows the weekday schedule.
//   ?dry=1          show what would be sent, send nothing
//   ?kind=tech      force a blog (tech | sales) regardless of the day
//   ?test=me@x.com  send one test copy to that address only
//   ?at=2026-10-30T09:00:00Z  pretend it is this moment (to test the weekday logic)
export async function GET(req: Request) {
  if (!isAdmin(req)) return deny();
  const q = new URL(req.url).searchParams;
  const kind = q.get("kind");
  const at = q.get("at") ? new Date(q.get("at")!) : undefined;
  const result = await runNewsletter({ now: at && !isNaN(+at) ? at : undefined, kind: kind === "tech" || kind === "sales" ? kind : undefined, dry: q.get("dry") === "1", testTo: q.get("test") ?? undefined });
  return NextResponse.json(result, { status: result.action === "error" ? 500 : 200 });
}
