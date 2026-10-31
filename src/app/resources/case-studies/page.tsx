import { CtaBand, PageHero, Section } from "@/components/ui";
import { CaseStudyCard } from "@/components/HomeSections";
import { caseStudies } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Case studies: results from retail, telecom and distribution",
  "Proof, not promises: $2M monthly revenue at Mama Stops, 33,000 retailers at Urban Vyapari, and 25 years of channel building.",
  "/resources/case-studies/",
);

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Case studies", href: "/resources/case-studies/" }]} eyebrow="Case studies" title="Real results from" accent="real businesses." lead="What our leaders have delivered before, and how it shapes the Marichi suite." />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">{caseStudies.map((c) => <CaseStudyCard key={c.slug} c={c} />)}</div>
      </Section>
      <CtaBand />
    </>
  );
}
