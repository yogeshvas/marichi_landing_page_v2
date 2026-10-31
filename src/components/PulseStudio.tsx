"use client";

import { useRef, useState } from "react";
import { CurrencySwitch, useCurrency } from "@/components/CurrencyProvider";
import PulseOrbit from "@/components/PulseOrbit";
import { WaButton } from "@/components/WhatsApp";
import { CURRENCIES, type Currency } from "@/lib/pricing";

const GREEN = "#0EA371";

type Item = { id: string; name: string; price: Record<Currency, number>; stock: number };
const ITEMS: Item[] = [
  { id: "bread", name: "Bread loaf", price: { ZMW: 18, INR: 45, AED: 5, USD: 1.5 }, stock: 24 },
  { id: "oil", name: "Cooking oil 2L", price: { ZMW: 120, INR: 320, AED: 24, USD: 6.5 }, stock: 12 },
  { id: "rice", name: "Rice 5kg", price: { ZMW: 150, INR: 380, AED: 28, USD: 7.5 }, stock: 30 },
  { id: "sugar", name: "Sugar 2kg", price: { ZMW: 65, INR: 100, AED: 9, USD: 2.5 }, stock: 40 },
  { id: "soap", name: "Soap bar", price: { ZMW: 15, INR: 40, AED: 4, USD: 1.2 }, stock: 18 },
  { id: "water", name: "Water 5L", price: { ZMW: 35, INR: 90, AED: 7, USD: 2 }, stock: 25 },
];
const PAY = ["Mobile money", "Cash", "Card"] as const;
const TAX: Record<Currency, { fiscal: string; payroll: string; vat: number }> = {
  ZMW: { fiscal: "ZRA Smart Invoice", payroll: "NAPSA + PAYE", vat: 0.16 },
  INR: { fiscal: "GST e-invoice", payroll: "PF + TDS", vat: 0.05 },
  AED: { fiscal: "UAE VAT invoice", payroll: "Pension + tax", vat: 0.05 },
  USD: { fiscal: "Tax invoice", payroll: "Tax + pension", vat: 0.08 },
};
const STAFF = [["Grace M.", "Cashier", 4200], ["Peter K.", "Store manager", 6000], ["Linda C.", "Stock clerk", 4800], ["Joseph B.", "Supervisor", 5200]] as const;
const PAYF: Record<Currency, number> = { ZMW: 1, INR: 5, AED: 0.4, USD: 0.11 };

const useMoney = () => {
  const { currency, ready } = useCurrency();
  const dec = currency === "USD" || currency === "AED" ? 2 : 0;
  const f = new Intl.NumberFormat(CURRENCIES[currency].locale, { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: dec });
  return { currency, ready, fmt: (n: number) => (ready ? f.format(n) : "…") };
};
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const Tick = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>;
const Tile = ({ title, children, live }: { title: string; children: React.ReactNode; live?: boolean }) => (
  <div className="rounded-xl border border-line bg-white p-4">
    <p className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{title}{live && <span className="inline-flex items-center gap-1.5 text-[#0EA371]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0EA371]" />live</span>}</p>
    <div className="mt-2.5">{children}</div>
  </div>
);

function Sell() {
  const { currency, fmt } = useMoney();
  const [stock, setStock] = useState<Record<string, number>>(() => Object.fromEntries(ITEMS.map((i) => [i.id, i.stock])));
  const [cart, setCart] = useState<Record<string, number>>({ rice: 1, oil: 1 });
  const [pay, setPay] = useState<(typeof PAY)[number]>("Mobile money");
  const [phase, setPhase] = useState<"idle" | "sending" | "paid">("idle");
  const [sales, setSales] = useState<Record<string, number>>({ "Mobile money": 0, Cash: 0, Card: 0 });
  const [count, setCount] = useState(0);
  const lines = ITEMS.filter((i) => cart[i.id]);
  const sub = lines.reduce((s, i) => s + i.price[currency] * cart[i.id], 0);
  const vat = sub * TAX[currency].vat;
  const total = sub + vat;
  const todays = Object.values(sales).reduce((a, b) => a + b, 0);
  const inv = `INV-${String(1040 + count).padStart(4, "0")}`;

  const add = (id: string) => { if (phase !== "idle" || stock[id] - (cart[id] ?? 0) <= 0) return; setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 })); };
  const charge = async () => {
    if (!lines.length || phase !== "idle") return;
    setPhase("sending"); await wait(1100);
    setStock((s) => { const n = { ...s }; for (const [k, q] of Object.entries(cart)) n[k] -= q; return n; });
    setSales((s) => ({ ...s, [pay]: s[pay] + total })); setPhase("paid");
  };
  const next = () => { setCart({}); setPhase("idle"); setCount((c) => c + 1); };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
      <div className="rounded-2xl border border-line bg-white p-4 sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Tap items to add</p>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ITEMS.map((i) => (
            <li key={i.id}>
              <button type="button" onClick={() => add(i.id)} disabled={phase !== "idle" || stock[i.id] - (cart[i.id] ?? 0) <= 0} className="relative w-full rounded-xl border border-line bg-cream p-3 text-left transition hover:-translate-y-0.5 hover:border-[#0EA371] disabled:opacity-50">
                <span className="block text-[13.5px] font-semibold text-ink">{i.name}</span>
                <span className="block text-[12.5px] text-muted">{fmt(i.price[currency])}</span>
                {cart[i.id] ? <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0EA371] px-1 text-[11px] font-bold text-white">{cart[i.id]}</span> : null}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-xl bg-ink p-4 text-white">
          <ul className="min-h-[3.5rem] space-y-1.5 text-[13.5px]">
            {lines.length === 0 && <li className="text-white/50">Empty bill. Tap an item.</li>}
            {lines.map((i) => <li key={i.id} className="flex justify-between"><span>{cart[i.id]} × {i.name}</span><span className="tabular-nums">{fmt(i.price[currency] * cart[i.id])}</span></li>)}
          </ul>
          <div className="mt-3 flex justify-between border-t border-dashed border-white/20 pt-3 text-[12.5px] text-white/60"><span>Tax</span><span className="tabular-nums">{fmt(vat)}</span></div>
          <div className="mt-1 flex items-end justify-between"><span className="text-[13px] text-white/60">Total</span><span className="font-display text-4xl tabular-nums">{fmt(total)}</span></div>
          <div role="group" aria-label="Payment method" className="mt-4 flex flex-wrap gap-1.5">
            {PAY.map((p) => <button key={p} type="button" aria-pressed={pay === p} disabled={phase !== "idle"} onClick={() => setPay(p)} className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition ${pay === p ? "bg-white text-ink" : "bg-white/10 text-white/75 hover:bg-white/20"}`}>{p}</button>)}
          </div>
          {phase === "paid" ? (
            <button type="button" onClick={next} className="mt-4 w-full rounded-lg bg-white py-3 text-[15px] font-semibold text-ink">New sale</button>
          ) : (
            <button type="button" onClick={charge} disabled={!lines.length || phase === "sending"} className="mt-4 w-full rounded-lg py-3 text-[15px] font-semibold text-white transition hover:brightness-110 disabled:opacity-60" style={{ background: GREEN }}>{phase === "sending" ? "Processing…" : `Charge ${fmt(total)}`}</button>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <Tile title="Inventory" live>
          <ul className="space-y-2">
            {ITEMS.map((i) => (
              <li key={i.id} className="flex items-center gap-3 text-[12.5px]">
                <span className="w-24 shrink-0 truncate text-ink">{i.name}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream"><span className="block h-full rounded-full transition-all duration-700" style={{ width: `${(stock[i.id] / i.stock) * 100}%`, background: stock[i.id] / i.stock < 0.5 ? "#ee3b2b" : GREEN }} /></span>
                <span className="w-6 text-right tabular-nums text-muted">{stock[i.id]}</span>
              </li>
            ))}
          </ul>
        </Tile>
        <Tile title="Accounting" live>
          <p className="font-display text-3xl tabular-nums text-ink">{fmt(todays)}</p>
          <p className="text-[12px] text-muted">Sales today · {phase === "paid" ? count + 1 : count} {((phase === "paid" ? count + 1 : count) === 1) ? "sale" : "sales"}</p>
          <ul className="mt-2 space-y-1 text-[12.5px] text-ink/80">{PAY.map((p) => <li key={p} className="flex justify-between"><span>{p}</span><span className="tabular-nums">{fmt(sales[p])}</span></li>)}</ul>
        </Tile>
        <Tile title={TAX[currency].fiscal}>
          <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
            {phase === "idle" && <span className="text-muted">Waiting for a sale</span>}
            {phase === "sending" && <>Sending {inv} to the tax authority…</>}
            {phase === "paid" && <><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0EA371] text-white"><Tick /></span>{inv} fiscalised</>}
          </p>
        </Tile>
        <Tile title="Customer">
          {phase === "paid" ? <p className="mm-prev inline-block rounded-2xl rounded-bl-md bg-[#dcf8c6] px-3 py-2 text-[13px] text-[#073b1c]">Thanks for shopping! Your receipt {inv} for {fmt(total)} is attached.</p> : <p className="text-[13px] text-muted">A WhatsApp receipt is sent after payment.</p>}
        </Tile>
      </div>
    </div>
  );
}

function Stock() {
  const rows = [["Rice 5kg", 48, 6], ["Cooking oil 2L", 30, 4], ["Sugar 2kg", 26, 9]] as const;
  const [s, setS] = useState<{ a: number; b: number }[]>(rows.map(([, a, b]) => ({ a, b })));
  const [pos, setPos] = useState<string[]>([]);
  const po = useRef(1042);
  const move = (i: number) => setS((x) => x.map((r, n) => (n === i && r.a >= 20 ? { a: r.a - 20, b: r.b + 20 } : r)));
  const reorder = (i: number) => { const id = po.current++; setPos((p) => [`PO-${id} · ${rows[i][0]} × 100 · sent to supplier on WhatsApp`, ...p]); };
  const Cell = ({ n, low }: { n: number; low?: boolean }) => <span className={`inline-block min-w-12 rounded-lg px-2.5 py-1 text-center text-[14px] font-bold tabular-nums transition ${low ? "bg-red/10 text-red" : "bg-[#0EA371]/12 text-[#0a7f58]"}`}>{n}</span>;
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border border-line bg-white p-4 sm:p-5">
        <div className="grid grid-cols-[1.3fr_.7fr_.7fr_auto] items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted"><span>Item</span><span>Main shop</span><span>Branch B</span><span /></div>
        <ul className="mt-3 divide-y divide-line">
          {rows.map(([name], i) => (
            <li key={name} className="grid grid-cols-[1.3fr_.7fr_.7fr_auto] items-center gap-3 py-3 text-[14px]">
              <span className="font-semibold text-ink">{name}</span>
              <Cell n={s[i].a} low={s[i].a < 20} />
              <span className="flex items-center gap-1"><Cell n={s[i].b} low={s[i].b < 10} />{s[i].b < 10 && <span className="text-[11px] font-semibold text-red">Low</span>}</span>
              <span className="flex flex-wrap gap-1.5">
                <button type="button" onClick={() => move(i)} disabled={s[i].a < 20} className="rounded-full border border-line px-3 py-1.5 text-[12.5px] font-semibold text-ink transition hover:border-[#0EA371] hover:text-[#0a7f58] disabled:opacity-40">Send 20 →</button>
                {s[i].a < 30 && <button type="button" onClick={() => reorder(i)} className="rounded-full bg-ink px-3 py-1.5 text-[12.5px] font-semibold text-white">Reorder</button>}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12.5px] text-muted">Move stock between shops in one tap. Low items offer a reorder.</p>
      </div>
      <Tile title="Purchase orders" live>
        {pos.length === 0 ? <p className="text-[13px] text-muted">No orders yet. Press Reorder on an item.</p> : <ul className="space-y-2">{pos.map((p) => <li key={p} className="mm-prev flex gap-2.5 text-[13px] text-ink"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0EA371] text-white"><Tick /></span>{p}</li>)}</ul>}
      </Tile>
    </div>
  );
}

function Payroll() {
  const { currency, fmt } = useMoney();
  const [done, setDone] = useState(0);
  const [running, setRunning] = useState(false);
  const rate = 0.1;
  const rows = STAFF.map(([n, r, g]) => { const gross = Math.round(g * PAYF[currency]); return { n, r, gross, ded: Math.round(gross * rate), net: gross - Math.round(gross * rate) }; });
  const run = async () => { if (running) return; setRunning(true); setDone(0); for (let i = 1; i <= rows.length; i++) { await wait(650); setDone(i); } setRunning(false); };
  const tot = rows.reduce((s, r) => s + r.net, 0);
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border border-line bg-white p-4 sm:p-5">
        <div className="grid grid-cols-[1.2fr_.8fr_.8fr_.8fr_auto] gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-muted"><span>Staff</span><span className="text-right">Gross</span><span className="text-right">{TAX[currency].payroll}</span><span className="text-right">Net pay</span><span className="w-6" /></div>
        <ul className="mt-3 divide-y divide-line">
          {rows.map((r, i) => (
            <li key={r.n} className="grid grid-cols-[1.2fr_.8fr_.8fr_.8fr_auto] items-center gap-2 py-3 text-[13.5px]">
              <span><b className="block font-semibold text-ink">{r.n}</b><span className="text-[12px] text-muted">{r.r}</span></span>
              <span className="text-right tabular-nums">{fmt(r.gross)}</span>
              <span className="text-right tabular-nums text-muted">{done > i ? `−${fmt(r.ded)}` : "…"}</span>
              <span className="text-right font-semibold tabular-nums text-ink">{done > i ? fmt(r.net) : "…"}</span>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-white transition ${done > i ? "bg-[#0EA371]" : "bg-line"}`}>{done > i && <Tick />}</span>
            </li>
          ))}
        </ul>
        <button type="button" onClick={run} disabled={running} className="mt-4 rounded-lg px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110 disabled:opacity-60" style={{ background: GREEN }}>{running ? "Running payroll…" : done ? "Run again" : "Run payroll"}</button>
        <p className="mt-3 text-[12px] text-muted">Illustrative flat 10% deduction. Real payroll applies your country&apos;s statutory rates.</p>
      </div>
      <div className="space-y-3">
        <Tile title="Total net pay" live><p className="font-display text-4xl tabular-nums text-ink">{done === rows.length ? fmt(tot) : "…"}</p></Tile>
        <Tile title="Pay slips">{done === rows.length ? <p className="mm-prev flex items-center gap-2 text-[13.5px] font-semibold text-ink"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0EA371] text-white"><Tick /></span>4 pay slips sent on WhatsApp</p> : <p className="text-[13px] text-muted">Sent to each person after the run.</p>}</Tile>
        <Tile title="Books">{done === rows.length ? <p className="mm-prev text-[13.5px] text-ink">Payroll expense posted to accounting.</p> : <p className="text-[13px] text-muted">Posted automatically.</p>}</Tile>
      </div>
    </div>
  );
}

function Store() {
  const { currency, fmt } = useMoney();
  const [n, setN] = useState(0);
  const [live, setLive] = useState(false);
  const [order, setOrder] = useState(false);
  const [busy, setBusy] = useState(false);
  const build = async () => {
    if (busy) return; setBusy(true); setLive(false); setOrder(false); setN(0);
    for (let i = 1; i <= ITEMS.length; i++) { await wait(380); setN(i); }
    await wait(500); setLive(true); await wait(1400); setOrder(true); setBusy(false);
  };
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
      <div>
        <p className="max-w-md text-[17px] leading-relaxed text-ink/80">Your stock is already in Pulse. One press turns it into an online shop customers can order from, with payment and WhatsApp alerts built in.</p>
        <button type="button" onClick={build} disabled={busy} className="mt-6 rounded-lg px-7 py-3.5 text-[16px] font-semibold text-white transition hover:brightness-110 disabled:opacity-60" style={{ background: GREEN }}>{busy ? "Building your store…" : n ? "Build again" : "Create my online store"}</button>
        <ul className="mt-6 space-y-2 text-[14px] text-ink/80">
          {[["Products pulled from inventory", n === ITEMS.length], ["Prices and stock kept in sync", live], ["Payments switched on", live], ["Order alert sent to your WhatsApp", order]].map(([t, ok]) => (
            <li key={t as string} className="flex items-center gap-2.5"><span className={`flex h-5 w-5 items-center justify-center rounded-full text-white transition ${ok ? "bg-[#0EA371]" : "bg-line"}`}>{ok && <Tick />}</span>{t as string}</li>
          ))}
        </ul>
      </div>
      <div className="relative mx-auto w-[18rem] overflow-hidden rounded-[1.6rem] border-[6px] border-ink bg-white">
        <div className="flex items-center justify-between bg-ink px-4 py-2.5 text-[12px] text-white"><span className="font-bold">Mama Thandi Stores</span>{live && <span className="mm-prev rounded-full bg-[#25D366] px-2 py-0.5 text-[10px] font-bold uppercase text-[#073b1c]">Live</span>}</div>
        <div className="grid min-h-[20rem] grid-cols-2 gap-2 p-3">
          {ITEMS.slice(0, n).map((i) => (
            <div key={i.id} className="mm-prev rounded-xl border border-line p-2.5"><div className="mb-2 h-12 rounded-lg bg-cream" /><p className="text-[12px] font-semibold text-ink">{i.name}</p><p className="text-[11.5px] text-muted">{fmt(i.price[currency])}</p></div>
          ))}
          {n === 0 && <p className="col-span-2 mt-16 text-center text-[12.5px] text-muted">Your store appears here.</p>}
        </div>
        {order && <div className="mm-prev absolute inset-x-3 bottom-3 rounded-xl bg-ink p-3 text-[12.5px] text-white shadow-xl"><b className="text-[#25D366]">New order</b> · 2 × Rice 5kg · paid by mobile money</div>}
      </div>
    </div>
  );
}

const TABS = [
  { id: "sell", label: "Sell", text: "Ring up a sale. Watch stock, books, tax and the customer receipt update together.", C: Sell },
  { id: "stock", label: "Stock", text: "Move stock between shops and reorder from suppliers.", C: Stock },
  { id: "payroll", label: "Payroll", text: "Run payroll and send pay slips in seconds.", C: Payroll },
  { id: "store", label: "Online store", text: "Turn your inventory into an online shop with one press.", C: Store },
] as const;

export default function PulseStudio() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("sell");
  const T = TABS.find((t) => t.id === tab)!;
  return (
    <div>
      <PulseOrbit />
      <p className="mb-6 mt-14 text-[12px] font-bold uppercase tracking-[0.16em] text-muted">Now try each part yourself</p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Pulse features" className="inline-flex flex-wrap gap-1 rounded-xl bg-cream p-1">
          {TABS.map((t) => <button key={t.id} role="tab" aria-selected={tab === t.id} type="button" onClick={() => setTab(t.id)} className={`rounded-lg px-4 py-2 text-[14px] font-semibold transition ${tab === t.id ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"}`}>{t.label}</button>)}
        </div>
        <CurrencySwitch />
      </div>
      <p className="mt-4 text-[16px] text-muted">{T.text}</p>
      <div className="mt-6" key={tab}><div className="mm-prev"><T.C /></div></div>
      <div className="mt-8"><WaButton message="Hi Marichi Labs, I'd like a demo of MarichiPulse for my shop." source={`pulse-studio-${tab}`}>Try this on my shop</WaButton></div>
    </div>
  );
}
