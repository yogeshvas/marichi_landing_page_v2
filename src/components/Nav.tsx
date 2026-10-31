"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { fullName, getProduct, industries, solutions } from "@/lib/content";
import { waLink } from "@/lib/site";
import { themes } from "@/lib/themes";

type Item = { href: string; title: string; text: string; short: string; icon?: string };
type Group = { title: string; items: Item[] };
type Menu = { label: string; href: string; groups: Group[]; cols: string; wide?: boolean; cta: { title: string; text: string } };

const ICONS: Record<string, string> = {
  pulse: "M3 12h4l3-8 4 16 3-8h4",
  moves: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.500 1.500 0 100-3 1.500 1.500 0 000 3zM17 19a1.500 1.500 0 100-3 1.500 1.500 0 000 3z",
  pays: "M3 6h18v12H3zM3 10h18M7 15h4",
  talks: "M4 5h16v11H9l-5 4z",
  grows: "M3 17l6-6 4 4 8-8M15 7h6v6",
  ops: "M3 5h18l-7 8v6l-4-2v-4z",
  card: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2z",
  assure: "M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6zM8.500 12l2.500 2.500 4.500-5",
  sign: "M4 20h16M5 16l9-9 3 3-9 9H5z",
};

const SHORT: Record<string, string> = {
  pulse: "POS, inventory, accounting, payroll",
  moves: "Fleet, loads, borders, invoices",
  pays: "One gateway, 15+ payment methods",
  talks: "WhatsApp, SMS, email, voice",
  grows: "Field sales and follow-ups",
  ops: "Sales CRM and pipeline",
  card: "Digital card that captures leads",
  assure: "Field audits with AI photo checks",
  sign: "Verified e-signatures",
};

const prod = (slug: string): Item => {
  const p = getProduct(slug)!;
  return { href: `/products/${p.slug}/`, title: fullName(p), text: p.tagline, short: SHORT[slug], icon: slug };
};

const menus: Menu[] = [
  {
    label: "Products",
    href: "/products/",
    cols: "sm:grid-cols-2 xl:grid-cols-4",
    wide: true,
    groups: [
      { title: "Run your business", items: [prod("pulse"), prod("moves")] },
      { title: "Pay and engage", items: [prod("pays"), prod("talks")] },
      { title: "Win and manage sales", items: [prod("grows"), prod("ops"), prod("card")] },
      { title: "Verify and sign", items: [prod("assure"), prod("sign")] },
    ],
    cta: { title: "Not sure which fits?", text: "Answer four quick questions and we'll recommend a starting point." },
  },
  {
    label: "Solutions",
    href: "/solutions/",
    cols: "sm:grid-cols-2",
    wide: true,
    groups: [
      { title: "Use cases", items: solutions.map((s) => ({ href: `/solutions/use-cases/${s.slug}/`, title: s.title, text: s.short, short: s.short.split(".")[0], icon: s.num })) },
      { title: "Industries", items: industries.map((i, n) => ({ href: `/solutions/industries/${i.slug}/`, title: i.title, text: i.short, short: i.short, icon: String(n + 1).padStart(2, "0") })) },
    ],
    cta: { title: "Tell us your goal", text: "We'll map the right products to what you want to achieve." },
  },
  {
    label: "Resources",
    href: "/resources/",
    cols: "sm:grid-cols-2",
    groups: [{ title: "Learn", items: [
      { href: "/blog/sales/", title: "Sales Blog", text: "Field sales, CRM, WhatsApp selling and payments.", short: "Field sales, CRM and payments", icon: "01" },
      { href: "/blog/tech/", title: "Tech Blog", text: "Engineering, AI and infrastructure notes.", short: "Engineering, AI and infrastructure", icon: "02" },
      { href: "/newsletter/", title: "The Marichi Weekly", text: "Tech on Fridays, Sales on Saturdays.", short: "Weekly newsletter", icon: "03" },
      { href: "/resources/case-studies/", title: "Case studies", text: "Results our leaders have delivered.", short: "Real results", icon: "04" },
    ] }],
    cta: { title: "Get new posts by email", text: "Tech on Fridays, Sales on Saturdays. Pick one or both." },
  },
];

const plain = [
  { href: "/whatsapp-flows/", label: "Products in action", short: "In action" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/about/", label: "About" },
];

function Icon({ k, on }: { k?: string; on?: boolean }) {
  const d = k && ICONS[k];
  const c = (k && themes[k]?.p1) || "#ee3b2b";
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition duration-300"
      style={{ background: on ? c : `color-mix(in srgb, ${c} 12%, white)`, color: on ? "#fff" : c, transform: on ? "rotate(-6deg) scale(1.08)" : undefined }}
    >
      {d ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d={d} /></svg>
      ) : (
        <span className="text-[12px] font-bold">{k}</span>
      )}
    </span>
  );
}

function Preview({ it, label }: { it: Item; label: string }) {
  const t = it.icon ? themes[it.icon] : undefined;
  const c = t?.p1 ?? "#ee3b2b";
  const d = it.icon ? ICONS[it.icon] : undefined;
  return (
    <Link href={it.href} key={it.href} className="mm-prev group/prev relative flex h-full min-h-[17rem] flex-col justify-end overflow-hidden rounded-xl bg-ink p-4 text-white">
      {t && <span className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url(${t.photos.hero})`, animation: "mm-ken 9s ease-out both" }} />}
      <span className="absolute inset-0" style={{ background: t ? `linear-gradient(to top, ${c}f2 0%, ${c}99 38%, transparent 80%)` : "linear-gradient(160deg,#1b1b1f,#0c0c0e)" }} />
      {d ? (
        <svg className="absolute right-3 top-3 text-white" width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
          <path d={d} pathLength={1} style={{ strokeDasharray: 1, animation: "mm-draw 1.1s .1s ease-out both" }} />
        </svg>
      ) : (
        <span className="font-display absolute right-4 top-2 text-6xl font-bold text-white/25">{it.icon}</span>
      )}
      <span className="relative text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">{label}</span>
      <span className="relative mt-1 text-[19px] font-bold leading-tight">{it.title}</span>
      <span className="relative mt-1 text-[12.5px] leading-snug text-white/85">{it.text}</span>
      <span className="relative mt-3 inline-flex items-center gap-1 text-[13px] font-semibold">
        Explore <span className="transition group-hover/prev:translate-x-1">→</span>
      </span>
    </Link>
  );
}

function Panel({ m }: { m: Menu }) {
  const items = m.groups.flatMap((g) => g.items);
  const [i, setI] = useState(0);
  const [pill, setPill] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const box = useRef<HTMLUListElement>(null);
  const point = (n: number, el: HTMLElement) => {
    setI(n);
    const li = el.parentElement!;
    setPill({ x: li.offsetLeft, y: li.offsetTop, w: li.offsetWidth, h: li.offsetHeight });
  };
  const cur = items[i];
  const c = (cur.icon && themes[cur.icon]?.p1) || "#ee3b2b";
  return (
    <div className={`flex gap-2 rounded-2xl border border-line bg-white p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,.25)] ${m.wide ? "w-[45rem]" : "w-[34rem]"}`}>
      <div className="min-w-0 flex-1">
        <ul ref={box} className={`relative ${m.wide ? "grid grid-cols-2" : ""}`} onMouseLeave={() => setPill(null)}>
          {pill && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 rounded-xl transition-all duration-300 ease-[cubic-bezier(.3,1.3,.5,1)]"
              style={{ width: pill.w, height: pill.h, transform: `translate(${pill.x}px, ${pill.y}px)`, background: `color-mix(in srgb, ${c} 9%, white)`, boxShadow: `inset 3px 0 0 ${c}` }}
            />
          )}
          {items.map((it, n) => (
            <li key={it.href} className="mm-row relative" style={{ ["--i" as string]: n }}>
              <Link
                href={it.href}
                onMouseEnter={(e) => point(n, e.currentTarget)}
                onFocus={(e) => point(n, e.currentTarget)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5"
              >
                <Icon k={it.icon} on={pill !== null && i === n} />
                <span className="min-w-0">
                  <span className="block text-[14.5px] font-semibold text-ink">{it.title}</span>
                  <span className="block truncate text-[12.5px] font-normal text-muted">{it.short}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-1 flex items-center justify-between border-t border-line px-3 pb-1 pt-3 text-[13.5px] font-semibold">
          <Link href={m.href} className="text-ink hover:text-red">View all {m.label.toLowerCase()} →</Link>
          <Link href="/get-started/" className="text-red hover:underline">Find my best fit</Link>
        </div>
      </div>
      <div className="w-56 shrink-0"><Preview it={cur} label={m.label.replace(/s$/, "")} /></div>
    </div>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper">
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" onClick={close} aria-label="Marichi Labs home" className="flex items-center gap-3">
          <svg className="lg-mark" width="36" height="30" viewBox="180 25 640 540" aria-hidden="true">
            <polygon className="lg-a lg-spark" fill="#d1d3d4" points="445,33 550,33 598,118 550,205 445,205 396,118" />
            <polygon className="lg-a lg-1" fill="#ef403a" points="240,385 335,385 392,470 345,557 240,557 190,470" />
            <polygon className="lg-a lg-2" fill="#ef403a" points="345,205 445,205 600,470 550,557 445,557 293,295" />
            <polygon className="lg-a lg-3" fill="#ef403a" points="520,205 655,205 805,470 755,557 650,557 502,297" />
          </svg>
          <span className="lg-word text-[14px] font-bold uppercase tracking-[0.14em] text-ink">
            {"Marichi".split("").map((c, i) => <span key={i} style={{ ["--i" as string]: i }}>{c}</span>)}
            <span className="text-red">{" Labs".split("").map((c, i) => <span key={i} style={{ ["--i" as string]: i + 7 }}>{c === " " ? "\u00a0" : c}</span>)}</span>
          </span>
        </Link>

        <ul className="hidden items-center text-[14.5px] font-medium text-muted lg:flex">
          {menus.map((m) => (
            <li key={m.label} className="group relative flex h-14 items-center">
              <Link href={m.href} className="flex h-full items-center gap-1 px-3.5 transition group-hover:text-ink group-focus-within:text-ink">
                {m.label}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="transition group-hover:rotate-180">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </Link>

              <div className={`mm-wrap invisible absolute left-0 top-full ${m.wide ? "-translate-x-24" : ""}`}>
                <Panel m={m} />
              </div>
            </li>
          ))}
          {plain.map((l) => (
            <li key={l.href} className="flex h-14 items-center">
              <Link href={l.href} className="flex h-full items-center px-3.5 transition hover:text-ink">{"short" in l ? <><span className="xl:hidden">{l.short}</span><span className="hidden xl:inline">{l.label}</span></> : l.label}</Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href={waLink("Hi Marichi Labs, I'd like to talk about my business.")} target="_blank" rel="noopener noreferrer" className="hidden rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-[#073b1c] transition hover:bg-[#1fbd5a] sm:inline-block">WhatsApp us</a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" data-lenis-prevent className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-line bg-paper px-5 pb-8 pt-4 lg:hidden">
          {menus.map((m) => (
            <details key={m.label} className="border-b border-line py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between py-3 font-bold text-ink">
                {m.label}
                <span aria-hidden="true" className="text-ink">+</span>
              </summary>
              <ul className="pb-3 pl-2">
                <li><Link href={m.href} onClick={close} className="block py-2 text-sm font-semibold text-ink">All {m.label.toLowerCase()}</Link></li>
                {m.groups.flatMap((g) => g.items).map((it) => (
                  <li key={it.href}><Link href={it.href} onClick={close} className="block py-2 text-[15px] text-muted">{it.title}</Link></li>
                ))}
              </ul>
            </details>
          ))}
          {plain.map((l) => (
            <Link key={l.href} href={l.href} onClick={close} className="block border-b border-line py-4 font-bold text-ink">{l.label}</Link>
          ))}
          <Link href="/get-started/" onClick={close} className="mt-6 block rounded-full bg-red py-3.5 text-center font-semibold text-white">Find my best fit</Link>
          <a href={waLink("Hi Marichi Labs, I'd like to talk about my business.")} target="_blank" rel="noopener noreferrer" className="mt-3 block rounded-full bg-[#25D366] py-3.5 text-center font-semibold text-[#073b1c]">Chat on WhatsApp</a>
        </div>
      )}
    </header>
  );
}
