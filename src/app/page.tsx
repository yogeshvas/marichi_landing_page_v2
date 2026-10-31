import ProductShowcase from "@/components/ProductShowcase";
import RoyalHero from "@/components/RoyalHero";
import { AboutTeaser, BlogTeaser, ExplorerSection, FunnelSection, IndustriesSection, NewsletterSection, PartnersSection, PillarsSection, ProofSection } from "@/components/HomeSections";
import { CtaBand } from "@/components/ui";
import { storyOrder } from "@/lib/stories";

export const revalidate = 120;

export default function Home() {
  return (
    <>
      <RoyalHero />
      <ExplorerSection />
      {storyOrder.map((id, i) => <ProductShowcase key={id} id={id} index={i} flip={i % 2 === 1} tone={i % 2 === 0 ? "cream" : "paper"} />)}
      <FunnelSection />
      <PillarsSection />
      <IndustriesSection />
      <ProofSection />
      <PartnersSection />
      <AboutTeaser />
      <BlogTeaser />
      <NewsletterSection />
      <CtaBand />
    </>
  );
}
