import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Button, CtaBand, Eyebrow, Heading, PageHero, ProductCard, Section } from "@/components/ui";
import { caseStudies, getIndustry, industries, productsBySlugs } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => industries.map((i) => ({ slug: i.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const i = getIndustry((await params).slug);
  return i ? pageMeta(`${i.title} software and AI solutions`, i.intro, `/solutions/industries/${i.slug}/`) : {};
}

export default async function IndustryPage({ params }: Props) {
  const i = getIndustry((await params).slug);
  if (!i) notFound();
  const cases = caseStudies.filter((c) => c.industries.includes(i.slug));
  return (
    <>
      <PageHero crumbs={[{ name: "Industries", href: "/solutions/industries/" }, { name: i.title, href: `/solutions/industries/${i.slug}/` }]} eyebrow="Industry" title={i.title} lead={i.short}>
        <Button href="/contact">Talk to us</Button>
      </PageHero>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Overview</Eyebrow>
            <Heading title={`${i.title} on Marichi`} className="mt-4" />
            <p className="mt-6 text-lg leading-relaxed text-muted">{i.intro}</p>
          </div>
          <div>
            <h3 className="font-display text-xl text-ink">Common challenges</h3>
            <ul className="mt-5 space-y-3">{i.challenges.map((c) => <li key={c} className="rounded-3xl bg-cream p-5 text-ink border border-line">{c}</li>)}</ul>
          </div>
        </div>
      </Section>
      <Section tone="cream">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">Recommended products</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{productsBySlugs(i.products).map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      </Section>
      {cases.length > 0 && (
        <Section>
          <h2 className="font-display text-2xl text-ink">Case studies</h2>
          <ul className="mt-5 space-y-3">{cases.map((c) => <li key={c.slug}><Link href={`/resources/case-studies/${c.slug}/`} className="font-semibold text-ink hover:text-ink">{c.title} →</Link></li>)}</ul>
        </Section>
      )}
      <CtaBand />
    </>
  );
}
