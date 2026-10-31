import { Button, Dot, JsonLd, PageHero, Section } from "@/components/ui";
import { WaButton } from "@/components/WhatsApp";
import { pageMeta } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";

export const metadata = pageMeta(
  "Contact Marichi Labs: book a demo or talk to our team",
  "Email hello@marichisolutions.com or call +260 773 903 240. Offices in Lusaka, Gurugram and Dallas.",
  "/contact",
);

export default function ContactPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", url: absoluteUrl("/contact"), name: "Contact Marichi Labs" }} />
      <PageHero crumbs={[{ name: "Contact", href: "/contact" }]} eyebrow="Contact" title="Talk to a real person," accent="on WhatsApp." lead="The fastest way to reach us is WhatsApp. Tell us what you run and we will show you which Marichi products fit." />
      <Section>
        <div className="mb-10 flex flex-wrap gap-3"><WaButton message="Hi Marichi Labs, I'd like to talk about my business." source="contact" /><Button href="/get-started" variant="ghost">Find my best fit</Button></div>
        <div className="flex flex-col gap-3 text-2xl font-bold text-ink sm:flex-row sm:gap-10">
          <a href={`mailto:${site.email}`} className="hover:text-ink">{site.email}</a>
          <a href={`tel:${site.phoneHref}`} className="hover:text-ink">{site.phone}</a>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {site.offices.map((o) => (
            <address key={o.city} className="rounded-3xl bg-cream p-7 not-italic border border-line">
              <h2 className="flex items-center gap-3 font-display text-2xl text-ink"><Dot />{o.city}</h2>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-ink">{o.region}</p>
              <p className="mt-2 text-muted">{o.address}</p>
            </address>
          ))}
        </div>
      </Section>
    </>
  );
}
