import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, JsonLd, PageHero, ProductCard, Section } from "@/components/ui";
import { caseStudies, getCaseStudy, getIndustry, productsBySlugs } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => caseStudies.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCaseStudy((await params).slug);
  return c ? pageMeta(c.title, c.summary, `/resources/case-studies/${c.slug}/`) : {};
}

export default async function CaseStudyPage({ params }: Props) {
  const c = getCaseStudy((await params).slug);
  if (!c) notFound();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: c.title,
          description: c.summary,
          mainEntityOfPage: absoluteUrl(`/resources/case-studies/${c.slug}/`),
          author: { "@type": "Organization", name: site.name },
          publisher: { "@type": "Organization", name: site.name, url: site.url },
        }}
      />
      <PageHero crumbs={[{ name: "Case studies", href: "/resources/case-studies/" }, { name: c.client, href: `/resources/case-studies/${c.slug}/` }]} eyebrow="Case study" title={c.title} lead={c.summary} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <aside className="h-fit rounded-3xl bg-cream p-8 border border-line">
            <p className="font-display text-6xl text-ink">{c.metric}</p>
            <p className="mt-2 text-sm font-bold uppercase tracking-wider text-muted">{c.metricLabel}</p>
            <p className="mt-6 text-sm text-muted">Led by <strong className="text-ink">{c.lead}</strong></p>
            <p className="mt-4 flex flex-wrap gap-2 text-xs">{c.industries.map((s) => { const i = getIndustry(s); return i && <Link key={s} href={`/solutions/industries/${s}/`} className="rounded-full bg-paper px-3 py-1 font-semibold text-ink hover:text-ink">{i.title}</Link>; })}</p>
          </aside>
          <article className="space-y-10">
            {c.sections.map((s) => (
              <div key={s.heading}>
                <h2 className="font-display text-2xl text-ink">{s.heading}</h2>
                <p className="mt-3 text-lg leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </article>
        </div>
      </Section>
      <Section tone="cream">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">Related products</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{productsBySlugs(c.products).map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      </Section>
      <CtaBand />
    </>
  );
}
