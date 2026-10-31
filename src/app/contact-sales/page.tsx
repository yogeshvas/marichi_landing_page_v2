import SalesForm from "@/components/SalesForm";
import { WaButton } from "@/components/WhatsApp";
import { PageHero, Section } from "@/components/ui";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Contact sales: book a Marichi Labs demo", "Request a demo and a custom quote for any Marichi Labs product. Tell us your team size and volume and we'll reply the same day.", "/contact-sales/");

export default function ContactSalesPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Contact sales", href: "/contact-sales/" }]} eyebrow="Contact sales" title="Tell us what you run." accent="We'll show you the fit." lead="Request a demo or a custom quote. We usually reply the same day.">
        <WaButton message="Hi Marichi Labs, I'd like to talk to sales." source="contact-sales-hero">Prefer WhatsApp?</WaButton>
      </PageHero>
      <Section><div className="mx-auto max-w-3xl"><SalesForm /></div></Section>
    </>
  );
}
