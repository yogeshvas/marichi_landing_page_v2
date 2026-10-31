import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/adminSession";
import { isServerless } from "@/lib/kv";

export const maxDuration = 30;
const MAX = 5 * 1024 * 1024;
const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

// Identify the file by its first bytes rather than trusting its name or declared type.
function sniff(b: Uint8Array): { ext: string; type: string } | null {
  const is = (...v: number[]) => v.every((x, i) => b[i] === x);
  if (is(0xff, 0xd8, 0xff)) return { ext: "jpg", type: "image/jpeg" };
  if (is(0x89, 0x50, 0x4e, 0x47)) return { ext: "png", type: "image/png" };
  if (is(0x47, 0x49, 0x46, 0x38)) return { ext: "gif", type: "image/gif" };
  if (is(0x52, 0x49, 0x46, 0x46) && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return { ext: "webp", type: "image/webp" };
  return null; // SVG and everything else is refused: SVG can carry scripts
}

export async function POST(req: Request) {
  if (!(await isAdminSession())) return bad("Not signed in.", 401);
  const file = (await req.formData().catch(() => null))?.get("file");
  if (!(file instanceof File)) return bad("No image was sent.");
  if (file.size > MAX) return bad("That image is over 5 MB. Please use a smaller one.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniff(bytes);
  if (!kind) return bad("Use a JPG, PNG, GIF or WebP image.");
  const name = `${randomUUID().slice(0, 8)}-${file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "image"}.${kind.ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`blog/${name}`, file, { access: "public", contentType: kind.type, addRandomSuffix: false });
    return NextResponse.json({ ok: true, url: blob.url });
  }
  if (isServerless()) return bad("Image storage is not connected. In Vercel, open Storage, create a Blob store, connect it to this project and redeploy.", 503);

  // Local development: save into /public so the image works without any account.
  const dir = path.join(process.cwd(), "public", "blog-uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return NextResponse.json({ ok: true, url: `/blog-uploads/${name}` });
}
