import { CtaBand, Eyebrow, Heading, Dot, PageHero, Section } from "@/components/ui";
import { HowWeWorkSection, TeamGrid } from "@/components/HomeSections";
import { stats } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta(
  "About Marichi Labs: the team building the digital infrastructure businesses run on",
  "Marichi Labs is led by builders who take products from zero to scale, backed by investors from IIT Kharagpur and MIT Sloan, with offices in Lusaka, Gurugram and Dallas.",
  "/about",
);

export default function AboutPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "About", href: "/about" }]} eyebrow="About Marichi Labs" title="We build the software behind" accent="everyday business." lead="Stores, payments, conversations, shipments, deals and signatures, connected into one suite and made smarter with AI." />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Who we are</Eyebrow>
            <Heading title="One team, nine products," accent="three continents." className="mt-4" />
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            <p>Marichi Labs is the product company of {site.legalName}. We build nine AI-native products, from POS and payments to logistics, field sales, CRM, communications, audits and e-signatures.</p>
            <p>Each one is useful on its own. Together they keep stock, payments, conversations and contracts in step, so the numbers match and nothing falls between two systems.</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {["Backed by investors from IIT Kharagpur and MIT Sloan", "Led by people who have taken products from zero to tens of thousands of users"].map((t) => (
            <div key={t} className="flex items-center gap-4 rounded-3xl bg-cream p-6 border border-line"><Dot /><span className="font-bold text-ink">{t}</span></div>
          ))}
        </div>
      </Section>

      <Section tone="cream">
        <Eyebrow>Track record</Eyebrow>
        <Heading title="Results we have" accent="delivered before." className="mt-4" />
        <dl className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-line sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (<div key={s.value} className="bg-paper p-8"><dt className="font-display text-5xl text-ink">{s.value}</dt><dd className="mt-4 text-muted">{s.label}</dd></div>))}
        </dl>
      </Section>

      <Section id="leadership">
        <Eyebrow>Leadership</Eyebrow>
        <Heading title="Meet the" accent="leadership." className="mt-4" />
        <div className="mt-8"><TeamGrid /></div>
      </Section>

      <HowWeWorkSection />

      <Section tone="cream" id="offices">
        <Eyebrow>Our offices</Eyebrow>
        <Heading title="Find us in" accent="Lusaka, Gurugram and Dallas." className="mt-4" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {site.offices.map((o) => (
            <address key={o.city} className="rounded-3xl bg-paper p-7 not-italic">
              <h3 className="flex items-center gap-3 font-display text-2xl text-ink"><Dot />{o.city}</h3>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-ink">{o.region}</p>
              <p className="mt-2 text-muted">{o.address}</p>
            </address>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
