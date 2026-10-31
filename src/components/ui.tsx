import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { absoluteUrl } from "@/lib/site";
import Reveal from "@/components/Reveal";
import { WaButton } from "@/components/WhatsApp";
import { themes, themeVars } from "@/lib/themes";
import { type Product } from "@/lib/content";

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Dot({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-red ${className}`} />;
}

export function Eyebrow({ children, center = false, light = false }: { children: ReactNode; center?: boolean; light?: boolean }) {
  return <p className={`text-[14px] font-medium ${light ? "text-white/80" : "text-muted"} ${center ? "text-center" : ""}`}>{children}</p>;
}

export function Heading({ title, accent, as: Tag = "h2", className = "", on = "paper" }: { title: string; accent?: string; as?: "h1" | "h2"; className?: string; on?: "paper" | "ink" | "red" }) {
  return (
    <Tag className={`font-display text-4xl sm:text-5xl lg:text-6xl ${on === "paper" ? "text-ink" : "text-white"} ${className}`}>
      {title} {accent}
    </Tag>
  );
}

export function Button({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "ghost" | "dark" | "light" }) {
  const styles = {
    primary: "rounded-lg bg-ink px-6 py-3.5 text-white hover:bg-red",
    dark: "rounded-lg bg-ink px-6 py-3.5 text-white hover:bg-red",
    light: "rounded-lg bg-white px-6 py-3.5 text-ink hover:bg-cream",
    ghost: "px-1 py-1 text-ink underline decoration-ink/30 underline-offset-[6px] hover:decoration-red hover:text-red",
  }[variant];
  const label = variant === "ghost" ? <>{children} <span aria-hidden="true">→</span></> : children;
  const cls = `inline-flex items-center justify-center gap-2 text-[15px] font-semibold transition ${styles}`;
  return href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") ? (
    <a href={href} className={cls}>{label}</a>
  ) : (
    <Link href={href} className={cls}>{label}</Link>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.href) })),
        }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          {all.map((it, i) => (
            <li key={it.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === all.length - 1 ? <span className="text-ink" aria-current="page">{it.name}</span> : <Link href={it.href} className="hover:text-ink">{it.name}</Link>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

export function PageHero({ crumbs, eyebrow, title, accent, lead, children }: { crumbs: { name: string; href: string }[]; eyebrow: string; title: string; accent?: string; lead: string; children?: ReactNode }) {
  return (
    <section data-aura="warm" className="border-b border-line px-5 pb-12 pt-24 sm:px-8 sm:pb-16 sm:pt-32">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs items={crumbs} />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <Heading as="h1" title={title} accent={accent} className="mt-5 !text-5xl sm:!text-6xl lg:!text-7xl" />
          </div>
          <div>
            <p className="text-lg leading-relaxed text-muted sm:text-xl">{lead}</p>
            {children && <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">{children}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

export const bandClass = (tone: "paper" | "cream" | "ink") =>
  tone === "cream" ? "bg-[#ece4d4] border-y border-[#ddd2bc]" : tone === "ink" ? "bg-[#15130f] text-white border-y border-black" : "bg-white border-y border-line";

export function Section({ children, id, tone = "paper", aura }: { children: ReactNode; id?: string; tone?: "paper" | "cream" | "ink"; aura?: string }) {
  return (
    <section id={id} data-aura={aura} className={`py-16 sm:py-24 ${bandClass(tone)}`}>
      <Container><Reveal>{children}</Reveal></Container>
    </section>
  );
}

export function ProductCard({ p }: { p: Product; i?: number }) {
  const t = themes[p.id];
  return (
    <Link href={`/products/${p.slug}/`} style={themeVars(p.id)} className="t-card group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div className="t-photo relative aspect-[16/10] overflow-hidden">
        {t && <Image src={t.photos.hero} alt="" fill sizes="(min-width: 1024px) 390px, (min-width: 640px) 45vw, 92vw" className="object-cover" />}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--p1d) 70%, transparent), transparent 62%)" }} />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[12px] font-bold t-text">{p.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-3xl text-ink">Marichi<span className="t-text">{p.name}</span></h3>
        <p className="mt-3 flex-1 text-[16px] leading-relaxed text-muted">{p.tagline}</p>
        <span className="t-text mt-6 text-[15px] font-bold">Explore <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1.5">→</span></span>
      </div>
    </Link>
  );
}

export function CtaBand({ title = "Ready to see it working in your business?", text = "Message us on WhatsApp. A real person replies, usually the same day.", message = "Hi Marichi Labs, I'd like to talk about my business.", themed = false }: { title?: string; text?: string; message?: string; themed?: boolean }) {
  return (
    <section className="px-5 pb-12 sm:px-8 sm:pb-16">
      <div className={`relative mx-auto max-w-7xl overflow-hidden rounded-3xl px-8 py-12 text-white sm:px-14 sm:py-14 ${themed ? "" : "bg-ink"}`} style={themed ? { background: "linear-gradient(135deg, var(--p1d), var(--p1))" } : undefined}>
        <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl">{title}</h2>
          <div>
            <p className="text-lg text-white/65">{text}</p>
            <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <WaButton message={message} source="cta-band" />
              <Link href="/get-started" className="text-[15px] font-semibold text-white underline decoration-white/30 underline-offset-[6px] transition hover:decoration-red">Find my best fit →</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
