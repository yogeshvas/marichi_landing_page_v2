import { CookieSettingsLink } from "@/components/CookieConsent";
import Image from "next/image";
import Link from "next/link";
import { CurrencySwitch } from "@/components/CurrencyProvider";
import { WaIcon } from "@/components/WhatsApp";
import { site, waLink } from "@/lib/site";

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const Svg = ({ children }: { children: React.ReactNode }) => <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>{children}</svg>;
const Mail = () => <Svg><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></Svg>;
const Phone = () => <Svg><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /></Svg>;
const Instagram = () => <Svg><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></Svg>;
const LinkedIn = () => <Svg><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10.5V16M8 8v.01M12 16v-3a2.2 2.2 0 014.4 0v3M12 10.5V16" /></Svg>;

const links = [
  { label: "Products", href: "/products/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "Solutions", href: "/solutions/" },
  { label: "Resources", href: "/resources/" },
  { label: "Products in action", href: "/whatsapp-flows/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

const label = "text-[12px] font-semibold uppercase tracking-[0.12em] text-muted";
const icon = "flex h-12 w-12 items-center justify-center rounded-xl border border-ink/10 bg-white/60 text-ink transition hover:border-red hover:bg-red hover:text-white";

export default function Footer() {
  const connect = [
    { name: "Instagram", href: site.social.instagram, el: <Instagram />, ext: true },
    { name: "LinkedIn", href: site.social.linkedin, el: <LinkedIn />, ext: true },
    { name: "WhatsApp", href: waLink("Hi Marichi Labs, I'd like to talk about my business."), el: <WaIcon className="h-[19px] w-[19px]" />, ext: true },
    { name: `Email ${site.email}`, href: `mailto:${site.email}`, el: <Mail /> },
    { name: `Call ${site.phone}`, href: `tel:${site.phoneHref}`, el: <Phone /> },
  ];

  return (
    <footer data-aura="warm" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 pb-10 pt-12 sm:grid-cols-3">
          <nav aria-label="Explore">
            <h2 className={label}>Explore</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-1">
              {links.map((l) => <li key={l.href}><Link href={l.href} className="text-[17px] font-medium text-ink transition hover:text-red">{l.label}</Link></li>)}
            </ul>
          </nav>

          <div>
            <h2 className={label}>Connect</h2>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {connect.map((c) => (
                <li key={c.name}>
                  <a href={c.href} aria-label={c.name} title={c.name} {...(c.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={icon}>{c.el}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={label}>Offices</h2>
            <p className="mt-5 text-[17px] font-medium leading-relaxed text-ink">
              {site.offices.map((o) => <span key={o.city} className="block">{o.city}<span className="text-muted">, {o.region.split(",")[0]}</span></span>)}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8" style={{ containerType: "inline-size" }}>
        <div className="flex items-center gap-[0.14em] whitespace-nowrap leading-none" style={{ fontSize: "14.9cqw" }} aria-label="Marichi Labs">
          <Image src="/brand/marichi-mark.svg" alt="" width={190} height={160} className="h-[0.78em] w-auto" />
          <span className="font-display" style={{ letterSpacing: "-0.055em", fontWeight: 800 }}>Marichi<span className="text-red"> Labs</span></span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 pb-6 pt-5 text-[13px] text-ink/70 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} {site.legalName}<span aria-hidden="true"> · </span><Link href="/privacy/" className="underline decoration-ink/30 underline-offset-4 hover:text-red">Privacy and cookies</Link><span aria-hidden="true"> · </span><CookieSettingsLink className="underline decoration-ink/30 underline-offset-4 hover:text-red" /></p>
        <CurrencySwitch />
      </div>
    </footer>
  );
}
