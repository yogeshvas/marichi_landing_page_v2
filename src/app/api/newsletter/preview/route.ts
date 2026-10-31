import { getAllPosts } from "@/lib/postsStore";
import { deny, isAdmin } from "@/lib/adminAuth";
import { getSent } from "@/lib/newsletterDb";
import { renderIssue } from "@/lib/newsletterEmail";
import { nextFor } from "@/lib/newsletterSchedule";

export const dynamic = "force-dynamic";

// See the email in the browser: ?kind=tech (next in queue) or ?post=<slug>
export async function GET(req: Request) {
  if (!isAdmin(req)) return deny();
  const q = new URL(req.url).searchParams;
  const kind = q.get("kind") === "sales" ? "sales" : "tech";
  const all = await getAllPosts();
  const post = q.get("post") ? all.find((p) => p.slug === q.get("post")) : nextFor(kind, await getSent(), all);
  if (!post) return new Response("No post to preview.", { status: 404 });
  return new Response(renderIssue(post, "preview").html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
