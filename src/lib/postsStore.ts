import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sanitizeHtml from "sanitize-html";
import { hgetall, hset, kvEnabled } from "@/lib/kv";
import { posts as seedPosts, type BlogKind, type Post } from "@/lib/blog";

// Posts written in the admin editor. Stored in Upstash Redis when connected (required on Vercel), otherwise in
// .data/posts.jsonl for local development. The built-in posts in lib/blog.ts work alongside these.

const file = path.join(process.cwd(), ".data", "posts.jsonl");
const KV_KEY = "mc:posts"; // one Redis hash: post id -> JSON

export type Authored = {
  id: string; kind: BlogKind; slug: string; title: string; excerpt: string; html: string;
  date: string; author: string; tags: string[]; cta?: { product: string; text: string };
  status: "draft" | "published"; updatedAt: string; deleted?: boolean;
};

async function readAll(): Promise<Authored[]> {
  if (kvEnabled()) {
    try { return Object.values(await hgetall(KV_KEY)).map((v) => JSON.parse(v) as Authored).filter((r) => !r.deleted); } catch { return []; }
  }
  let raw = "";
  try { raw = await readFile(file, "utf8"); } catch { return []; }
  const by = new Map<string, Authored>();
  for (const l of raw.split("\n").filter(Boolean)) { const r = JSON.parse(l) as Authored; by.set(r.id, r); }
  return [...by.values()].filter((r) => !r.deleted);
}
async function append(rec: Authored) {
  if (kvEnabled()) { await hset(KV_KEY, rec.id, JSON.stringify(rec)); return; }
  await mkdir(path.dirname(file), { recursive: true });
  await appendFile(file, JSON.stringify(rec) + "\n");
}

export const listAuthored = async () => (await readAll()).sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt));
export const getAuthored = async (id: string) => (await readAll()).find((r) => r.id === id);
export const saveAuthored = (r: Authored) => append({ ...r, updatedAt: new Date().toISOString() });
export const removeAuthored = async (id: string) => { const r = await getAuthored(id); if (r) await append({ ...r, deleted: true, updatedAt: new Date().toISOString() }); };

// Only these tags and attributes survive. Everything else (scripts, styles, event handlers) is removed.
export const cleanHtml = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: ["p", "h2", "h3", "ul", "ol", "li", "strong", "em", "u", "s", "a", "blockquote", "code", "pre", "hr", "br", "img"],
    allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt"] },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["https"] },
    exclusiveFilter: (f) => (f.tag === "p" && !f.text.trim() && !f.mediaChildren.length) || (f.tag === "img" && !/^(https:\/\/|\/blog-uploads\/)/i.test(f.attribs.src ?? "")) || (f.tag === "a" && !f.attribs.href),
    transformTags: { a: (tag, attribs) => ({ tagName: "a", attribs: { href: attribs.href ?? "", target: "_blank", rel: "noopener noreferrer nofollow" } }) },
  }).trim();

const text = (h: string) => sanitizeHtml(h, { allowedTags: [], allowedAttributes: {} }).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
export const wordCount = (html: string) => (text(html).match(/\S+/g) ?? []).length;

// Splits editor HTML into { heading, paragraphs } sections. The newsletter email and archive use these.
export function htmlToSections(html: string): Post["body"] {
  const parts = html.split(/<h2[^>]*>/i);
  const out: Post["body"] = [];
  const paras = (chunk: string) => (chunk.match(/<(p|li|blockquote)[^>]*>[\s\S]*?<\/\1>/gi) ?? []).map(text).filter(Boolean);
  const intro = paras(parts[0]);
  if (intro.length) out.push({ h: "", p: intro });
  for (const part of parts.slice(1)) { const [h, ...rest] = part.split(/<\/h2>/i); out.push({ h: text(h), p: paras(rest.join("")) }); }
  return out;
}

export function toPost(a: Authored): Post {
  const html = cleanHtml(a.html);
  return { kind: a.kind, slug: a.slug, title: a.title, excerpt: a.excerpt, date: a.date, readMins: Math.max(1, Math.ceil(wordCount(html) / 200)), author: a.author, tags: a.tags, body: htmlToSections(html), cta: a.cta, html };
}

export const todayUtc = () => new Date().toISOString().slice(0, 10);
export const isPublic = (a: Authored) => a.status === "published" && a.date <= todayUtc(); // a future date = scheduled

// Everything visitors and the newsletter should see: built-in posts plus published authored posts.
export async function getAllPosts(): Promise<Post[]> {
  const authored = (await readAll()).filter(isPublic).map(toPost);
  return [...seedPosts, ...authored].sort((a, b) => b.date.localeCompare(a.date));
}
export const getPostsByKind = async (k: BlogKind) => (await getAllPosts()).filter((p) => p.kind === k);
export const getPostBySlug = async (slug: string) => (await getAllPosts()).find((p) => p.slug === slug);
export const seedSlugs = () => new Set(seedPosts.map((p) => p.slug));
