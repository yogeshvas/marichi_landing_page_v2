import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PostCard } from "@/components/HomeSections";
import { JsonLd, PageHero, Section } from "@/components/ui";
import { getAllPosts } from "@/lib/postsStore";
import { authorPath, authorSlug } from "@/lib/paths";
import { pageMeta } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";

const getAuthors = async () => [...new Set((await getAllPosts()).map((p) => p.author))];
export const revalidate = 60;
type Props = { params: Promise<{ author: string }> };

export const generateStaticParams = async () => (await getAuthors()).map((a) => ({ author: authorSlug(a) }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).author;
  const a = (await getAuthors()).find((x) => authorSlug(x) === slug);
  return a ? pageMeta(`Articles by ${a}`, `Articles written by ${a} at Marichi Labs.`, authorPath(a)) : {};
}

export default async function AuthorPage({ params }: Props) {
  const slug = (await params).author;
  const a = (await getAuthors()).find((x) => authorSlug(x) === slug);
  if (!a) notFound();
  const list = (await getAllPosts()).filter((p) => p.author === a);
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ProfilePage", mainEntity: { "@type": "Organization", name: a, url: absoluteUrl(authorPath(a)), parentOrganization: { "@type": "Organization", name: site.name } } }} />
      <PageHero crumbs={[{ name: "Blog", href: "/blog/" }, { name: a, href: authorPath(a) }]} eyebrow="Author" title={a} lead={`Writing from the ${a.includes("Engineering") ? "engineering team" : "Marichi Labs team"}: ${list.length} article${list.length === 1 ? "" : "s"}.`} />
      <Section><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{list.map((p) => <PostCard key={p.slug} p={p} />)}</div></Section>
    </>
  );
}
