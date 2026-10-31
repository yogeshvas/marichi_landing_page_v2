import Link from "next/link";
import { CookieSettingsLink } from "@/components/CookieConsent";
import { Breadcrumbs, Container } from "@/components/ui";
import { GA_ID } from "@/lib/consent";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta(
  "Privacy and cookies",
  "What Marichi Labs collects, why, who we share it with, which cookies this website uses, and how to change your choices.",
  "/privacy/",
);

const UPDATED = "31 October 2026";

const cookies = [
  { name: "mc_country", kind: "Essential", why: "Remembers your country so prices show in the right currency (kwacha, rupees, dirhams or dollars).", life: "30 days" },
  { name: "mc_consent", kind: "Essential", why: "Remembers the cookie choices you made here.", life: "1 year" },
  { name: "mc_admin", kind: "Essential", why: "Keeps staff signed in to the admin area. Never set for visitors.", life: "Session" },
  { name: "mc_currency", kind: "Preferences", why: "Remembers a currency you picked yourself.", life: "1 year" },
  { name: "Offer pop-up memory (browser storage)", kind: "Preferences", why: "Remembers that you closed our 14-day offer so we do not show it again straight away. Without your consent it lasts only until you close the tab.", life: "7 days" },
  ...(GA_ID ? [{ name: "_ga, _ga_*", kind: "Analytics", why: "Google Analytics: counts visits and shows which pages are useful. Set only if you accept analytics.", life: "Up to 2 years" }] : []),
];

const h2 = "font-display mt-12 text-2xl text-ink sm:text-3xl";
const p = "mt-3 text-[17px] leading-relaxed text-ink/80";

export default function PrivacyPage() {
  return (
    <article className="px-0 pb-20 pt-24 sm:pt-32">
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ name: "Privacy and cookies", href: "/privacy/" }]} />
        <h1 className="font-display mt-10 text-4xl leading-tight text-ink sm:text-6xl">Privacy and cookies</h1>
        <p className="mt-4 text-[15px] text-muted">Last updated {UPDATED}</p>
        <p className={p}>This page explains what {site.name} ({site.legalName}) collects when you use this website, why we collect it, and the choices you have. We keep it short and plain on purpose.</p>

        <h2 className={h2}>Who we are</h2>
        <p className={p}>{site.legalName} runs this website. You can reach us at <a href={`mailto:${site.email}`} className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-red">{site.email}</a> or on WhatsApp for any privacy question.</p>

        <h2 className={h2}>What we collect</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-[17px] leading-relaxed text-ink/80">
          <li><b>Newsletter sign-up:</b> your email address and the topics you choose. We use Mailchimp to send the newsletter and to handle confirmation and unsubscribes.</li>
          <li><b>Forms and waitlists:</b> the details you type in, such as name, email, phone and what you need, so we can reply.</li>
          <li><b>WhatsApp chats:</b> when you tap a WhatsApp button, you leave this site and message us through WhatsApp. WhatsApp and Meta handle that conversation under their own policies.</li>
          <li><b>Your country:</b> our hosting network works out your country from your internet address to show the right currency. We keep only the two-letter country in a cookie on your device.</li>
          <li><b>Technical data:</b> like most websites, our hosting provider processes your IP address and browser details to deliver pages and protect the site from abuse.</li>
        </ul>

        <h2 className={h2}>Why we use it</h2>
        <p className={p}>To reply to you, to send the newsletter you asked for, to show prices in the right currency, to keep the site secure, and to improve the site.{GA_ID ? " We use analytics only if you agree." : ""} We do not sell your personal data.</p>

        <h2 className={h2}>Cookies and similar storage</h2>
        <p className={p}>Essential items are needed for the site to work and cannot be turned off. The rest only run if you allow them.</p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[34rem] text-left text-[14.5px]">
            <thead className="bg-cream text-[12px] uppercase tracking-[0.12em] text-muted"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">What it does</th><th className="px-4 py-3">Lasts</th></tr></thead>
            <tbody className="divide-y divide-line">
              {cookies.map((c) => <tr key={c.name} className="align-top"><td className="px-4 py-3 font-semibold text-ink">{c.name}</td><td className="px-4 py-3">{c.kind}</td><td className="px-4 py-3 text-ink/80">{c.why}</td><td className="px-4 py-3 whitespace-nowrap">{c.life}</td></tr>)}
            </tbody>
          </table>
        </div>
        <p className={p}>You can change your mind at any time: <CookieSettingsLink className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-red" />. You can also clear cookies in your browser settings.</p>
        {!GA_ID && <p className={p}>This site does not currently use analytics or advertising cookies.</p>}

        <h2 className={h2}>Who we share it with</h2>
        <p className={p}>We use a small number of service providers to run the site. They handle data only to provide their service:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-[17px] leading-relaxed text-ink/80">
          <li>Vercel (website hosting) and Upstash (storage for blog posts and form records).</li>
          <li>Mailchimp (newsletter) and WhatsApp / Meta (messaging when you contact us).</li>
          <li>Lovable (the live WhatsApp flow demos). The demo loads from their site only after you tap to try it.</li>
          {GA_ID && <li>Google (analytics), only if you accept analytics cookies.</li>}
        </ul>
        <p className={p}>Some of these providers are based outside Zambia and India, so your data may be processed in other countries.</p>

        <h2 className={h2}>How long we keep it</h2>
        <p className={p}>Newsletter details stay until you unsubscribe. Form and waitlist details are kept only as long as needed to reply and follow up. You can ask us to delete yours sooner.</p>

        <h2 className={h2}>Your choices and rights</h2>
        <p className={p}>You can ask to see, correct or delete your personal data, unsubscribe from the newsletter using the link in any email, or withdraw cookie consent here at any time. Depending on where you live, you may also have the right to complain to your data protection authority. Email <a href={`mailto:${site.email}`} className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-red">{site.email}</a> and we will respond.</p>

        <h2 className={h2}>Changes</h2>
        <p className={p}>If we change how we use data we will update this page and its date. Questions? <Link href="/contact/" className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-red">Contact us</Link>.</p>
      </Container>
    </article>
  );
}
