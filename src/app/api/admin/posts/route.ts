import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/adminSession";
import { durableStorageMissing, STORAGE_HELP } from "@/lib/kv";
import { products } from "@/lib/content";
import { cleanHtml, getAuthored, removeAuthored, saveAuthored, seedSlugs, listAuthored, wordCount, type Authored } from "@/lib/postsStore";

const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function refresh() {
  for (const p of ["/", "/blog", "/blog/sales", "/blog/tech", "/blog/feed.xml", "/sitemap.xml", "/newsletter"]) revalidatePath(p);
  revalidatePath("/blog/[slug]", "page"); revalidatePath("/blog/tag/[tag]", "page"); revalidatePath("/blog/author/[author]", "page");
}

// Create or update a post. Send { id? , ...fields }. The server re-checks everything the editor checks.
export async function POST(req: Request) {
  if (!(await isAdminSession())) return bad("Not signed in.", 401);
  if (durableStorageMissing()) return bad(STORAGE_HELP, 503);
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") return bad("Invalid request.");

  const kind = b.kind === "sales" || b.kind === "tech" ? b.kind : null;
  const title = String(b.title ?? "").trim();
  const excerpt = String(b.excerpt ?? "").trim();
  const slug = String(b.slug ?? "").trim().toLowerCase();
  const date = String(b.date ?? "");
  const html = cleanHtml(String(b.html ?? ""));
  const status = b.status === "published" ? "published" : "draft";
  const author = String(b.author ?? "").trim().slice(0, 60) || "Marichi Labs";
  const tags = [...new Set((Array.isArray(b.tags) ? b.tags : []).map((t: unknown) => String(t).trim().slice(0, 30)).filter(Boolean))].slice(0, 6) as string[];
  const ctaProduct = String(b.ctaProduct ?? "");
  const ctaText = String(b.ctaText ?? "").trim().slice(0, 140);

  if (!kind) return bad("Choose a blog: Sales or Tech.");
  if (title.length < 3 || title.length > 140) return bad("The title needs 3 to 140 characters.");
  if (!SLUG.test(slug) || slug.length > 90) return bad("The web address can only use lowercase letters, numbers and hyphens.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(+new Date(date))) return bad("Pick a valid publish date.");
  const id = String(b.id ?? "") || randomUUID();
  const others = await listAuthored();
  if (seedSlugs().has(slug) || others.some((o) => o.slug === slug && o.id !== id)) return bad("Another post already uses that web address. Change it.");
  if (status === "published") {
    if (excerpt.length < 20 || excerpt.length > 220) return bad("To publish, the summary needs 20 to 220 characters.");
    if (wordCount(html) < 80) return bad("To publish, write at least 80 words.");
  }
  if (ctaProduct && !products.some((p) => p.id === ctaProduct)) return bad("Unknown product for the call to action.");

  const rec: Authored = { id, kind, slug, title, excerpt, html, date, author, tags, status, updatedAt: "", cta: ctaProduct && ctaText ? { product: ctaProduct, text: ctaText } : undefined };
  await saveAuthored(rec);
  refresh();
  return NextResponse.json({ ok: true, id, slug, status });
}

export async function DELETE(req: Request) {
  if (!(await isAdminSession())) return bad("Not signed in.", 401);
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!(await getAuthored(id))) return bad("Post not found.", 404);
  await removeAuthored(id);
  refresh();
  return NextResponse.json({ ok: true });
}
