import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/adminSession";
import { sendCustom, sendPost } from "@/lib/newsletterManual";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Manual newsletter actions from the admin page. "send" must be confirmed explicitly.
export async function POST(req: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ ok: false, message: "Not signed in." }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  const action = b.action === "test" || b.action === "schedule" ? b.action : "send";
  if (action === "send" && b.confirm !== true) return NextResponse.json({ ok: false, message: "Sending needs confirmation." }, { status: 400 });
  const audience = b.audience === "tech" || b.audience === "sales" ? b.audience : "all";
  const common = { audience, action, testTo: String(b.testTo ?? "").trim(), scheduleAt: b.scheduleAt ? String(b.scheduleAt) : undefined } as const;
  const result = b.mode === "custom"
    ? await sendCustom({ ...common, subject: String(b.subject ?? ""), previewText: String(b.previewText ?? ""), html: String(b.html ?? "") })
    : await sendPost({ ...common, slug: String(b.slug ?? ""), again: b.again === true });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
