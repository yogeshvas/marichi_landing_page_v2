import ProductShowcase from "@/components/ProductShowcase";
import { WaButton } from "@/components/WhatsApp";
import { Button, CtaBand, PageHero } from "@/components/ui";
import { storyOrder } from "@/lib/stories";
import { pageMeta } from "@/lib/seo";
import { companyKeywords, productKeywords } from "@/lib/keywords";

export const metadata = pageMeta(
  "AI-native business products: POS, payments, CRM, logistics and more",
  "Nine connected products for retail POS, payments, transport ERP, field sales, CRM, WhatsApp and voice messaging, audits and e-signatures.",
  "/products/",
  [...companyKeywords, ...Object.values(productKeywords).flatMap((k) => k.core)],
);

export default function ProductsPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Products", href: "/products/" }]} eyebrow="Products" title="Software for every" accent="part of your business." lead="Nine products to run stores and fleets, take payments, talk to customers, manage field sales and verify work. Start with one.">
        <WaButton message="Hi Marichi Labs, I'd like to know which product fits my business.">Ask us on WhatsApp</WaButton>
        <Button href="/get-started/" variant="ghost">Find my best fit</Button>
      </PageHero>
      {storyOrder.map((id, i) => <ProductShowcase key={id} id={id} index={i} flip={i % 2 === 1} tone={i % 2 === 0 ? "paper" : "cream"} />)}
      <CtaBand />
    </>
  );
}
