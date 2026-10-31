import { getAllPosts } from "@/lib/postsStore";
import { absoluteUrl, site } from "@/lib/site";
import { postPath } from "@/lib/paths";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const revalidate = 300;

export async function GET() {
  const items = [...(await getAllPosts())].sort((a, b) => b.date.localeCompare(a.date)).map((p) => `<item><title>${esc(p.title)}</title><link>${absoluteUrl(postPath(p))}</link><guid>${absoluteUrl(postPath(p))}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${esc(p.excerpt)}</description><category>${p.kind}</category></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(site.name)} Blog</title><link>${absoluteUrl("/blog/")}</link><description>${esc(site.description)}</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
