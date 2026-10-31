import Link from "next/link";
import { CtaBand, PageHero, Section } from "@/components/ui";
import { industries, productsBySlugs } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Industry solutions: retail, logistics, telecom distribution and financial services",
  "See how Marichi Labs products fit retail and FMCG, transport and logistics, telecom and distribution, and financial services.",
  "/solutions/industries/",
);

export default function IndustriesPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Industries", href: "/solutions/industries/" }]} eyebrow="Industries" title="Built for how your" accent="industry works." lead="Our team has run these businesses. The suite reflects it." />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {industries.map((i) => (
            <Link key={i.slug} href={`/solutions/industries/${i.slug}/`} className="rounded-3xl bg-cream p-8 transition hover:border-ink/40 hover:bg-white">
              <h2 className="font-display text-2xl text-ink sm:text-3xl">{i.title}</h2>
              <p className="mt-4 text-muted">{i.short}</p>
              <p className="mt-5 flex flex-wrap gap-2">{productsBySlugs(i.products).map((p) => <span key={p.slug} className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink">Marichi{p.name}</span>)}</p>
            </Link>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
