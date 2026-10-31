import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Button, CtaBand, Eyebrow, Heading, PageHero, ProductCard, Section } from "@/components/ui";
import { getSolution, productsBySlugs, solutions } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => solutions.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSolution((await params).slug);
  return s ? pageMeta(s.title, s.short, `/solutions/use-cases/${s.slug}/`) : {};
}

export default async function SolutionPage({ params }: Props) {
  const s = getSolution((await params).slug);
  if (!s) notFound();
  const others = solutions.filter((x) => x.slug !== s.slug);
  return (
    <>
      <PageHero crumbs={[{ name: "Solutions", href: "/solutions" }, { name: s.title, href: `/solutions/use-cases/${s.slug}/` }]} eyebrow={`Solution ${s.num}`} title={s.title} lead={s.short}>
        <Button href="/contact">Talk to us</Button>
      </PageHero>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Overview</Eyebrow>
            <Heading title="What you get" className="mt-4" />
            <p className="mt-6 text-lg leading-relaxed text-muted">{s.intro}</p>
          </div>
          <ul className="space-y-4">
            {s.outcomes.map((o) => <li key={o} className="rounded-3xl bg-cream p-5 font-bold text-ink border border-line">{o}</li>)}
          </ul>
        </div>
      </Section>
      <Section tone="cream">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">Products behind this solution</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{productsBySlugs(s.products).map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      </Section>
      <Section>
        <h2 className="font-display text-2xl text-ink">More solutions</h2>
        <ul className="mt-5 space-y-3">{others.map((o) => <li key={o.slug}><Link href={`/solutions/use-cases/${o.slug}/`} className="font-semibold text-ink hover:text-ink">{o.title} →</Link></li>)}</ul>
      </Section>
      <CtaBand />
    </>
  );
}
