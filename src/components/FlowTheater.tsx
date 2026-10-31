"use client";

import { useState } from "react";
import FlowPhone from "@/components/FlowPhone";
import { WaButton } from "@/components/WhatsApp";
import Link from "next/link";
import { flowGroups, flowPath, flows, type FlowGroup } from "@/lib/flows";

const Svg = ({ d, s = 20 }: { d: string; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

export default function FlowTheater() {
  const [group, setGroup] = useState<FlowGroup | "All">("All");
  const [id, setId] = useState(flows[0].id);
  const list = flows.filter((f) => group === "All" || f.group === group);
  const f = flows.find((x) => x.id === id) ?? flows[0];
  const idx = list.findIndex((x) => x.id === f.id);
  const step = (n: number) => list.length && setId(list[(Math.max(idx, 0) + n + list.length) % list.length].id);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
      {/* Industry picker */}
      <div className="lg:order-1">
        <div role="tablist" aria-label="Industry group" className="flex flex-wrap gap-2">
          {(["All", ...flowGroups] as const).map((g) => (
            <button key={g} type="button" role="tab" aria-selected={group === g} onClick={() => { setGroup(g); const first = flows.find((x) => g === "All" || x.group === g); if (first && !(g === "All" || f.group === g)) setId(first.id); }} className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition ${group === g ? "border-ink bg-ink text-white" : "border-line bg-white text-muted hover:text-ink"}`}>{g}</button>
          ))}
        </div>
        <ul className="mt-5 grid max-h-[26rem] gap-2 overflow-y-auto pr-1 sm:grid-cols-2" data-lenis-prevent>
          {list.map((x) => {
            const on = x.id === f.id;
            return (
              <li key={x.id}>
                <button type="button" aria-pressed={on} onClick={() => setId(x.id)} className="flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition duration-300" style={{ borderColor: on ? x.color : "var(--color-line, #e7e3dc)", background: on ? x.color : "#fff", color: on ? "#fff" : undefined, transform: on ? "translateX(4px)" : undefined }}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: on ? "rgba(255,255,255,.2)" : `color-mix(in srgb, ${x.color} 14%, white)`, color: on ? "#fff" : x.color }}><Svg d={x.icon} /></span>
                  <span className="min-w-0 text-[14px] font-semibold leading-tight">{x.industry}<span className={`block truncate text-[12px] font-normal ${on ? "text-white/80" : "text-muted"}`}>{x.title}</span></span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mx-auto lg:order-2"><FlowPhone f={f} /></div>

      {/* Details */}
      <div key={f.id} className="mm-prev lg:order-3">
        <p className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em]" style={{ color: f.color }}><Svg d={f.icon} s={16} />{f.industry}</p>
        <h3 className="font-display mt-3 text-4xl leading-tight text-ink sm:text-5xl">{f.title}</h3>
        <p className="mt-4 text-lg leading-relaxed text-muted">{f.text}</p>
        <ol className="mt-6 flex flex-wrap items-center gap-2">
          {f.steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className="rounded-full px-3 py-1.5 text-[13px] font-semibold" style={{ background: `color-mix(in srgb, ${f.color} 12%, white)`, color: f.color }}><span className="mr-1.5 opacity-60">{i + 1}</span>{s}</span>
              {i < 2 && <span aria-hidden="true" className="text-muted">→</span>}
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={f.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold text-white transition hover:brightness-110" style={{ background: f.color }}>Try the {f.industry.toLowerCase()} flow <span aria-hidden="true">↗</span></a>
          <Link href={flowPath(f)} className="text-[14.5px] font-semibold text-ink underline decoration-ink/30 underline-offset-[6px] hover:text-red">How it works →</Link>
          <WaButton message={`Hi Marichi Labs, I'd like the ${f.title} WhatsApp flow (${f.industry}) for my business.`} source={`flow-${f.id}`} variant="light">I want this flow</WaButton>
        </div>
        <div className="mt-8 flex items-center gap-3 text-[13px] text-muted">
          <button type="button" aria-label="Previous flow" onClick={() => step(-1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink hover:border-ink/40">←</button>
          <button type="button" aria-label="Next flow" onClick={() => step(1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink hover:border-ink/40">→</button>
          <span>{Math.max(idx, 0) + 1} of {list.length}</span>
        </div>
      </div>
    </div>
  );
}
