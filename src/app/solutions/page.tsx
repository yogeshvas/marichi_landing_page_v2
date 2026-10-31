import Link from "next/link";
import { CtaBand, Heading, PageHero, Section } from "@/components/ui";
import { industries, productsBySlugs, solutions } from "@/lib/content";
import { industryPath, solutionPath } from "@/lib/paths";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Business solutions: conversations, live insight, AI co-pilot and automation",
  "Four solution areas, powered by one connected suite: conversations that convert, live business intelligence, an AI co-pilot and workflow automation.",
  "/solutions/",
);

export default function SolutionsPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Solutions", href: "/solutions/" }]} eyebrow="Solutions" title="Start from the job" accent="or the industry." lead="Pick the outcome you need, or see how Marichi fits your kind of business." />
      <Section id="use-cases">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">Use cases</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {solutions.map((s) => (
            <Link key={s.slug} href={solutionPath(s)} className="rounded-3xl bg-cream p-8 transition hover:border-ink/40 hover:bg-white">
              <span className="font-display text-3xl text-ink">{s.num}</span>
              <Heading as="h2" title={s.title} className="mt-4 !text-2xl sm:!text-3xl" />
              <p className="mt-4 text-muted">{s.short}</p>
              <p className="mt-5 flex flex-wrap gap-2">{productsBySlugs(s.products).map((p) => <span key={p.slug} className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink">Marichi{p.name}</span>)}</p>
            </Link>
          ))}
        </div>
      </Section>
      <Section tone="cream" id="industries">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">Industries</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((i) => (
            <Link key={i.slug} href={industryPath(i)} className="rounded-2xl border border-line bg-white p-6 transition hover:border-ink/40">
              <h3 className="font-display text-xl text-ink">{i.title}</h3>
              <p className="mt-2 text-[15px] text-muted">{i.short}</p>
            </Link>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
