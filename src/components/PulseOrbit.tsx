"use client";

import { useEffect, useState } from "react";

const GREEN = "#0EA371";
const RED = "#ee3b2b";

// One sale fans out to every part of the business. Flip to "Separate tools" to see the same sale
// the way most small businesses live it: each place typed in by hand, or forgotten.
const NODES = [
  { id: "stock", label: "Inventory", x: 13, y: 22, pulse: "Rice 5kg: 30 → 29", tools: "Update the stock sheet tomorrow" },
  { id: "books", label: "Accounting", x: 50, y: 9, pulse: "Sale booked, cash and tax split", tools: "Typed into the books by hand" },
  { id: "tax", label: "Tax invoice", x: 87, y: 22, pulse: "Fiscal invoice issued", tools: "Invoice raised separately, maybe late" },
  { id: "wa", label: "Customer receipt", x: 87, y: 78, pulse: "WhatsApp receipt sent", tools: "Receipt forgotten or handwritten" },
  { id: "rep", label: "Owner's report", x: 50, y: 91, pulse: "Today's sales updated live", tools: "Report built at month end" },
  { id: "pay", label: "Staff commission", x: 13, y: 78, pulse: "Cashier commission added", tools: "Worked out in a spreadsheet" },
] as const;

export default function PulseOrbit() {
  const [pulse, setPulse] = useState(true);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const first = window.setTimeout(() => setRun(1), 500);
    const loop = window.setInterval(() => setRun((r) => r + 1), 6500);
    return () => { clearTimeout(first); clearInterval(loop); };
  }, []);

  const color = pulse ? GREEN : RED;
  return (
    <div className="rounded-3xl bg-ink p-5 text-white sm:p-8">
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/50">One sale. Six places to update.</p>
          <h3 className="font-display mt-2 text-3xl sm:text-4xl">{pulse ? "With Pulse, you tap once." : "With separate tools, you type six times."}</h3>
        </div>
        <div role="group" aria-label="Compare" className="flex shrink-0 rounded-full bg-white/10 p-1 text-[13.5px] font-semibold">
          {[{ v: false, l: "Separate tools" }, { v: true, l: "MarichiPulse" }].map((o) => (
            <button key={o.l} type="button" aria-pressed={pulse === o.v} onClick={() => { setPulse(o.v); setRun((r) => r + 1); }} className={`rounded-full px-4 py-2 transition ${pulse === o.v ? (o.v ? "bg-[#0EA371] text-white" : "bg-[#ee3b2b] text-white") : "text-white/70 hover:text-white"}`}>{o.l}</button>
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-6 aspect-[4/3] w-full max-w-4xl sm:aspect-[16/9]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {NODES.map((n, i) => (
            <g key={n.id}>
              <line x1="50" y1="50" x2={n.x} y2={n.y} stroke="white" strokeOpacity={pulse ? 0.18 : 0.12} strokeWidth="1" strokeDasharray={pulse ? undefined : "2 3"} vectorEffect="non-scaling-stroke" />
              <line key={`${run}-${pulse}`} x1="50" y1="50" x2={n.x} y2={n.y} stroke={color} strokeWidth="3" strokeLinecap="round" pathLength={1} strokeDasharray="0.14 1.2" vectorEffect="non-scaling-stroke" className={pulse ? "po-run" : "po-run po-die"} style={{ animationDelay: `${pulse ? i * 90 : i * 220}ms` }} />
            </g>
          ))}
        </svg>

        <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-28 sm:w-28">
          <span key={`${run}-${pulse}`} className="po-ring absolute inset-0 rounded-full border-2" style={{ borderColor: color }} />
          <span className="relative flex h-full w-full flex-col items-center justify-center rounded-full text-center" style={{ background: color }}>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-80">1 sale</span>
            <span className="font-display text-2xl leading-none sm:text-3xl">{pulse ? "0" : "6"}</span>
            <span className="text-[10px] font-semibold opacity-80">manual steps</span>
          </span>
        </div>

        {NODES.map((n, i) => (
          <div key={n.id} className="absolute w-[9.5rem] -translate-x-1/2 -translate-y-1/2 sm:w-[11.5rem]" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
            <div key={`${run}-${pulse}`} className="po-node rounded-xl border bg-white/[0.06] px-3 py-2.5 backdrop-blur" style={{ borderColor: `${color}88`, animationDelay: `${pulse ? 350 + i * 90 : 600 + i * 220}ms` }}>
              <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em]" style={{ color }}>
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] text-white" style={{ background: color }}>{pulse ? "✓" : "!"}</span>{n.label}
              </p>
              <p className="mt-1 text-[11.5px] leading-snug text-white/85 sm:text-[12.5px]">{pulse ? n.pulse : n.tools}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-[12px] text-white/45">Illustration of one sale. Press a button above to replay it, or wait: it runs by itself.</p>
    </div>
  );
}
