import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PostCard } from "@/components/HomeSections";
import { PageHero, Section } from "@/components/ui";
import { getAllPosts } from "@/lib/postsStore";
import { tagPath } from "@/lib/paths";
import { pageMeta } from "@/lib/seo";

const slugOf = (t: string) => tagPath(t).split("/").filter(Boolean).pop()!;
const bySlug = async (slug: string) => { const tags = [...new Set((await getAllPosts()).flatMap((p) => p.tags))]; return tags.find((t) => slugOf(t) === slug); };
export const revalidate = 60;
type Props = { params: Promise<{ tag: string }> };

export const generateStaticParams = async () => [...new Set((await getAllPosts()).flatMap((p) => p.tags))].map((t) => ({ tag: slugOf(t) }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await bySlug((await params).tag);
  return t ? pageMeta(`${t} articles`, `Marichi Labs articles about ${t}.`, tagPath(t)) : {};
}

export default async function TagPage({ params }: Props) {
  const t = await bySlug((await params).tag);
  if (!t) notFound();
  const list = (await getAllPosts()).filter((p) => p.tags.includes(t));
  return (
    <>
      <PageHero crumbs={[{ name: "Blog", href: "/blog/" }, { name: t, href: tagPath(t) }]} eyebrow="Topic" title={t} lead={`${list.length} article${list.length === 1 ? "" : "s"} tagged ${t}.`} />
      <Section><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{list.map((p) => <PostCard key={p.slug} p={p} />)}</div></Section>
    </>
  );
}
