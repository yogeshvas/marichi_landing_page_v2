import { blogMeta, type Post } from "@/lib/blog";
import { getAllPosts } from "@/lib/postsStore";
import { getSent, type Sent } from "@/lib/newsletterDb";

// The public archive is built from the sent log: one issue per email that really went out.
export type Issue = { slug: string; number: number; sentAt: string; kind: Sent["kind"]; post: Post; title: string };

export async function getIssues(): Promise<Issue[]> {
  // A Mailchimp outage must not break a build or the archive page: show no issues until it recovers.
  const sent = (await getSent().catch(() => [] as Sent[])).sort((a, b) => a.sentAt.localeCompare(b.sentAt));
  const posts = await getAllPosts();
  return sent
    .map((s, i) => ({ s, i, post: posts.find((p) => p.slug === s.postSlug) }))
    .filter((x): x is { s: Sent; i: number; post: Post } => !!x.post)
    .map(({ s, i, post }) => ({ slug: post.slug, number: i + 1, sentAt: s.sentAt, kind: s.kind, post, title: post.title }))
    .reverse(); // newest first
}
export const issuePath = (i: Issue) => `/newsletter/archive/${i.slug}/`;
export const kindName = (k: Sent["kind"]) => blogMeta[k].name;
