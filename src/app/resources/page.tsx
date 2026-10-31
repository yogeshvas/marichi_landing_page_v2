import Link from "next/link";
import { PageHero, Section } from "@/components/ui";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Resources: blogs, newsletter and case studies", "Sales and tech blogs, The Marichi Weekly newsletter and customer results from Marichi Labs.", "/resources/");

const items = [
  { href: "/blog/sales/", t: "Sales Blog", d: "Field sales, CRM, WhatsApp selling and payments." },
  { href: "/blog/tech/", t: "Tech Blog", d: "Engineering notes on AI, payments and messaging." },
  { href: "/newsletter/", t: "The Marichi Weekly", d: "Tech on Fridays, Sales on Saturdays." },
  { href: "/resources/case-studies/", t: "Case studies", d: "Results our leaders have delivered." },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Resources", href: "/resources/" }]} eyebrow="Resources" title="Learn how" accent="other teams do it." lead="Playbooks, engineering notes and real results." />
      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((i) => (
            <Link key={i.href} href={i.href} className="rounded-2xl border border-line bg-white p-8 transition hover:border-ink/40">
              <h2 className="font-display text-2xl text-ink">{i.t}</h2>
              <p className="mt-2 text-muted">{i.d}</p>
              <span className="mt-5 inline-block text-[15px] font-semibold text-ink">Open →</span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
