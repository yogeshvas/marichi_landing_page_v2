import Link from "next/link";
import { PostCard } from "@/components/HomeSections";
import Newsletter from "@/components/Newsletter";
import { PageHero, Section } from "@/components/ui";
import { blogMeta } from "@/lib/blog";
import { getPostsByKind } from "@/lib/postsStore";
import { pageMeta } from "@/lib/seo";
import { topicKeywords } from "@/lib/keywords";

export const metadata = pageMeta("Blog: sales playbooks and engineering notes", "Two blogs from Marichi Labs: practical sales guides and engineering notes on AI, payments and messaging.", "/blog", topicKeywords);

export const revalidate = 60;

export default async function BlogHub() {
  const byKind = { sales: await getPostsByKind("sales"), tech: await getPostsByKind("tech") };
  return (
    <>
      <PageHero crumbs={[{ name: "Blog", href: "/blog" }]} eyebrow="Blog" title="Two blogs." accent="One goal: help you grow." lead="Sales playbooks for the people who sell, and engineering notes from the people who build." />
      {(["sales", "tech"] as const).map((k) => (
        <Section key={k} tone={k === "tech" ? "cream" : "paper"}>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl text-ink sm:text-4xl">{blogMeta[k].name}</h2>
            <Link href={blogMeta[k].path} className="font-medium text-ink hover:underline">View all ›</Link>
          </div>
          <p className="mt-2 text-lg text-muted">{blogMeta[k].lead}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">{byKind[k].map((p) => <PostCard key={p.slug} p={p} />)}</div>
        </Section>
      ))}
      <Section>
        <h2 className="font-display text-3xl text-ink sm:text-4xl">Topics we write about</h2>
        <ul className="mt-6 flex flex-wrap gap-2.5">{topicKeywords.map((t) => <li key={t} className="rounded-full border border-line bg-white px-4 py-2 text-[14.5px] font-medium text-ink">{t}</li>)}</ul>
      </Section>
      <Section tone="cream">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center"><h2 className="font-display text-3xl text-ink">Get new posts by email</h2><div className="mt-6 w-full"><Newsletter source="blog-hub" /></div></div>
      </Section>
    </>
  );
}
