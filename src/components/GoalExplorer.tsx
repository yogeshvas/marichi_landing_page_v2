"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PulseLogo from "@/components/PulseLogo";
import { WaIcon } from "@/components/WhatsApp";
import { fullName, getProduct, type Product } from "@/lib/content";
import { needs } from "@/lib/goals";
import { productDetails } from "@/lib/productDetails";
import { themes } from "@/lib/themes";
import { waLink } from "@/lib/site";

// "What do you need?" as six picture tiles. Pick one and a single recommendation opens below.
export default function GoalExplorer() {
  const [id, setId] = useState<(typeof needs)[number]["id"]>(needs[0].id);
  const panel = useRef<HTMLDivElement>(null);
  const clicked = useRef(false);
  // Bring the answer into view after a pick, since it sits below the tiles.
  useEffect(() => {
    if (!clicked.current || matchMedia("(min-width: 1024px)").matches) return; // on desktop the answer sits beside the tiles
    panel.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [id]);
  const need = needs.find((n) => n.id === id)!;
  const [main, ...rest] = need.products.map((s) => getProduct(s)).filter((p): p is Product => !!p);
  const d = productDetails[main.id];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
      <div role="tablist" aria-label="What do you need?" className="grid grid-cols-2 gap-3 sm:gap-4">
        {needs.map((n, i) => {
          const on = n.id === id;
          const lead = getProduct(n.products[0])!;
          return (
            <button
              key={n.id}
              role="tab"
              aria-selected={on}
              aria-controls="need-result"
              onClick={() => { clicked.current = true; setId(n.id); }}
              className={`group relative aspect-[4/3] overflow-hidden lg:aspect-[16/11] rounded-2xl text-left transition duration-300 ${on ? "ring-[3px] ring-red ring-offset-4 ring-offset-white" : "opacity-90 hover:opacity-100"}`}
            >
              <Image src={themes[lead.id].photos.hero} alt="" fill sizes="(min-width: 1024px) 380px, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
              <span className={`absolute inset-0 transition ${on ? "bg-gradient-to-t from-black/80 via-black/30 to-black/10" : "bg-gradient-to-t from-black/75 via-black/40 to-black/25 group-hover:from-black/70"}`} />
              <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[12px] font-bold text-ink">{String(i + 1).padStart(2, "0")}</span>
              <span className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition ${on ? "bg-red text-white" : "bg-white/20 text-white group-hover:bg-white/40"}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={on ? "M5 12l5 5 9-10" : "M7 17L17 7M8 7h9v9"} /></svg></span>
              <span className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <span className="font-display block text-2xl text-white sm:text-3xl lg:text-[1.65rem]">{n.title}</span>
                <span className="mt-1 hidden text-[14px] text-white/80 sm:block">{n.short}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div ref={panel} id="need-result" role="tabpanel" key={need.id} className="fade-up scroll-mb-6 grid gap-6 rounded-2xl border border-line bg-white p-6 sm:p-8 lg:sticky lg:top-24">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">We&apos;d start with</p>
          {main.id === "pulse"
            ? <h3 className="mt-1"><span className="sr-only">MarichiPulse</span><PulseLogo className="h-14 sm:h-16" /></h3>
            : <h3 className="font-display mt-2 text-4xl text-ink">Marichi<span className="text-red">{main.name}</span></h3>}
          <p className="mt-2 max-w-sm text-[16px] leading-snug text-muted">{need.blurb}</p>
        </div>

        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">What you get</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {d.modules.slice(0, 5).map((m) => <li key={m.title} className="rounded-full border border-line bg-cream px-3.5 py-1.5 text-[14px] font-semibold text-ink">{m.title}</li>)}
          </ul>
          <p className="mt-4 text-[14px] text-muted">Works with <span className="font-semibold text-ink">{rest.map((p) => fullName(p)).join(" and ")}</span></p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={waLink(`Hi Marichi Labs, I'm looking for: ${need.label.toLowerCase()}. I'd like to see ${fullName(main)}.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-[15px] font-semibold text-[#073b1c] transition hover:bg-[#1fbd5a]"><WaIcon /> Ask on WhatsApp</a>
          <Link href={`/products/${main.slug}/`} className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3.5 text-[15px] font-semibold text-ink transition hover:border-ink">See {main.name} →</Link>
        </div>
      </div>
    </div>
  );
}
