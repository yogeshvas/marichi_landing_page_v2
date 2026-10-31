"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { businessSizes, businessTypes, needs } from "@/lib/goals";
import { fullName, getProduct, type Product } from "@/lib/content";
import { waLink } from "@/lib/site";
import { WaIcon } from "@/components/WhatsApp";

const STEPS = 4;

const Option = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button type="button" onClick={onClick} aria-pressed={on} className={`rounded-3xl p-5 text-left text-lg font-semibold transition ${on ? "bg-ink text-white" : "bg-cream text-ink hover:bg-line/60"}`}>
    {children}
  </button>
);

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [size, setSize] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  const recs = useMemo(() => {
    const score = new Map<string, number>();
    needs.filter((g) => picked.includes(g.id)).forEach((g) => g.products.forEach((p, i) => score.set(p, (score.get(p) ?? 0) + 3 - i)));
    return [...score.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([s]) => getProduct(s)).filter((p): p is Product => !!p);
  }, [picked]);

  const goalLabels = needs.filter((g) => picked.includes(g.id)).map((g) => g.label.toLowerCase());
  const message = `Hi Marichi Labs, I'm ${name || "a visitor"}${company ? ` from ${company}` : ""}. We are a ${type.toLowerCase()} (${size}). We are looking for: ${goalLabels.join("; ")}. I'd like to talk about ${recs.map(fullName).join(", ")}.`;

  const canNext = [!!type, picked.length > 0, !!size, name.trim().length > 1][step];
  const toggle = (id: string) => setPicked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  function logLead() {
    fetch("/api/lead", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, company, industry: type, size, goals: picked, products: recs.map((r) => r.slug), source: "get-started" }),
    }).catch(() => {});
  }

  if (step === STEPS) {
    return (
      <div>
        <p className="text-sm font-semibold text-ink">Your match</p>
        <h2 className="font-display mt-3 text-4xl text-ink sm:text-5xl">Here&apos;s what we&apos;d start with{name ? `, ${name.split(" ")[0]}` : ""}.</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {recs.map((p) => (
            <li key={p.slug} className="rounded-3xl bg-cream p-6 border border-line">
              <p className="font-display text-2xl text-ink">Marichi<span className="text-ink/40">{p.name}</span></p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.tagline}</p>
              <Link href={`/products/${p.slug}/`} className="mt-4 inline-block text-sm font-medium text-ink hover:underline">See details ›</Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 rounded-3xl bg-ink p-8 text-white">
          <h3 className="font-display text-2xl sm:text-3xl">Get your plan on WhatsApp</h3>
          <p className="mt-2 text-white/70">We&apos;ll reply with a short walkthrough and next steps. Your answers are pre-filled in the message.</p>
          <a href={waLink(message)} target="_blank" rel="noopener noreferrer" onClick={logLead} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-8 py-4 text-lg font-semibold text-[#073b1c] transition hover:bg-[#1fbd5a]">
            <WaIcon className="h-6 w-6" /> Continue on WhatsApp
          </a>
        </div>
        <button type="button" onClick={() => setStep(0)} className="mt-6 text-sm font-medium text-muted hover:text-ink">Start over</button>
      </div>
    );
  }

  const titles = ["What kind of business do you run?", "What do you need software for? (pick all that apply)", "How big is your team?", "Who should we say is asking?"];
  return (
    <div>
      <div className="flex items-center gap-2" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS} aria-valuenow={step + 1} aria-label="Progress">
        {Array.from({ length: STEPS }).map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-lg ${i <= step ? "bg-red" : "bg-line"}`} />)}
      </div>
      <p className="mt-8 text-sm font-semibold text-ink">Step {step + 1} of {STEPS}</p>
      <h2 className="font-display mt-3 text-4xl text-ink sm:text-5xl">{titles[step]}</h2>

      <div className="mt-8">
        {step === 0 && <div className="grid gap-3 sm:grid-cols-2">{businessTypes.map((t) => <Option key={t} on={type === t} onClick={() => setType(t)}>{t}</Option>)}</div>}
        {step === 1 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {needs.map((g) => (
              <Option key={g.id} on={picked.includes(g.id)} onClick={() => toggle(g.id)}>
                {g.label}
                <span className={`mt-1 block text-sm font-normal ${picked.includes(g.id) ? "text-white/70" : "text-muted"}`}>{g.blurb}</span>
              </Option>
            ))}
          </div>
        )}
        {step === 2 && <div className="grid gap-3 sm:grid-cols-2">{businessSizes.map((t) => <Option key={t} on={size === t} onClick={() => setSize(t)}>{t}</Option>)}</div>}
        {step === 3 && (
          <div className="grid max-w-lg gap-3">
            {[
              { l: "Your name", v: name, s: setName, ac: "name", req: true },
              { l: "Company (optional)", v: company, s: setCompany, ac: "organization", req: false },
              { l: "WhatsApp number (optional)", v: phone, s: setPhone, ac: "tel", req: false },
            ].map((f) => (
              <label key={f.l} className="block">
                <span className="mb-1.5 block text-sm font-medium text-muted">{f.l}</span>
                <input value={f.v} onChange={(e) => f.s(e.target.value)} autoComplete={f.ac} required={f.req} className="w-full rounded-2xl bg-cream px-5 py-4 text-lg text-ink outline-none ring-red focus:ring-2 border border-line" />
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 flex items-center gap-4">
        {step > 0 && <button type="button" onClick={() => setStep(step - 1)} className="rounded-lg px-5 py-3 text-[17px] font-medium text-muted hover:text-ink">Back</button>}
        <button type="button" disabled={!canNext} onClick={() => setStep(step + 1)} className="rounded-lg bg-ink px-8 py-3.5 text-[17px] font-semibold text-white transition hover:bg-red disabled:opacity-40">
          {step === STEPS - 1 ? "See my match" : "Continue"}
        </button>
      </div>
    </div>
  );
}
