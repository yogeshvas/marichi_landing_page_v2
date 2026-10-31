import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import Footer from "@/components/Footer";
import Aura from "@/components/Aura";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import Analytics from "@/components/Analytics";
import CookieConsent from "@/components/CookieConsent";
import LaunchPopup from "@/components/LaunchPopup";
import Nav from "@/components/Nav";
import { WaitlistProvider } from "@/components/Waitlist";
import SmoothScroll from "@/components/SmoothScroll";
import { FloatingWhatsApp } from "@/components/WhatsApp";
import { JsonLd } from "@/components/ui";
import { companyKeywords, productKeywords } from "@/lib/keywords";
import { absoluteUrl, site } from "@/lib/site";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Marichi Labs | AI-native business software suite: POS, payments, CRM and more",
    template: "%s | Marichi Labs",
  },
  description: site.description,
  applicationName: site.name,
  keywords: companyKeywords,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Marichi Labs | Everything your business runs on",
    description: site.description,
    url: "/",
    locale: "en",
  },
  twitter: { card: "summary_large_image", title: "Marichi Labs | Everything your business runs on", description: site.description },
};

const organization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: site.name,
      legalName: site.legalName,
      url: site.url,
      logo: absoluteUrl("/brand/marichi-logo.svg"),
      email: site.email,
      telephone: site.phone,
      description: site.description,
      keywords: companyKeywords.join(", "),
      knowsAbout: [...companyKeywords.slice(5, 12), ...Object.values(productKeywords).flatMap((k) => k.core.slice(1, 4))],
      address: site.offices.map((o) => ({ "@type": "PostalAddress", streetAddress: o.address, addressLocality: o.city, addressCountry: o.country })),
    },
    { "@type": "WebSite", "@id": absoluteUrl("/#website"), url: site.url, name: site.name, publisher: { "@id": absoluteUrl("/#organization") } },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans antialiased`}>
        <JsonLd data={organization} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <SmoothScroll />
        <Aura />
        <CurrencyProvider>
          <WaitlistProvider>
            <Nav />
            <main id="main">{children}</main>
            <Footer />
            <FloatingWhatsApp />
            <LaunchPopup />
            <CookieConsent />
            <Analytics />
          </WaitlistProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
