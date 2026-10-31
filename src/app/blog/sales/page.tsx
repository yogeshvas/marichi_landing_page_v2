import { PostCard } from "@/components/HomeSections";
import Newsletter from "@/components/Newsletter";
import { PageHero, Section } from "@/components/ui";
import { blogMeta } from "@/lib/blog";
import { getPostsByKind } from "@/lib/postsStore";
import { pageMeta } from "@/lib/seo";

const m = blogMeta.sales;
export const metadata = pageMeta(m.title, m.description, m.path);

export const revalidate = 60;

export default async function SalesBlogPage() {
  const list = await getPostsByKind("sales");
  return (
    <>
      <PageHero crumbs={[{ name: "Blog", href: "/blog" }, { name: m.name, href: m.path }]} eyebrow="Marichi Labs" title={m.name} lead={m.lead} />
      <Section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{list.map((p) => <PostCard key={p.slug} p={p} />)}</div>
      </Section>
      <Section tone="cream">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <h2 className="font-display text-3xl text-ink">Never miss a post</h2>
          <p className="mt-2 text-muted">Subscribe to the {m.name} by email.</p>
          <div className="mt-6 w-full"><Newsletter source="blog-sales" /></div>
        </div>
      </Section>
    </>
  );
}
