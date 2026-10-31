import Link from "next/link";
import { WaButton } from "@/components/WhatsApp";
import { Eyebrow } from "@/components/ui";

// "How it works" as a journey: three live mini-scenes joined by a line a WhatsApp-green dot travels along.
// Everything animates in CSS (10s loop), so the section stays a server component.

const tick = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>;

function ChatScene() {
  return (
    <div className="flex h-full flex-col justify-end gap-2 p-4 text-[12.5px]">
      <p className="fj fj-s1 ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-[#25D366] px-3 py-2 font-medium text-[#073b1c]">Hi, I run 3 shops. Billing is a mess.</p>
      <p className="fj fj-s2 flex w-14 justify-center gap-1 rounded-2xl rounded-bl-md bg-white/15 px-3 py-3" aria-hidden="true">
        {[0, 1, 2].map((i) => <span key={i} className="fj-dot h-1.5 w-1.5 rounded-full bg-white/80" style={{ animationDelay: `${i * 0.15}s` }} />)}
      </p>
      <p className="fj fj-s3 max-w-[85%] rounded-2xl rounded-bl-md bg-white/15 px-3 py-2 text-white">Got it. How many people use the till?</p>
    </div>
  );
}

function PlanScene() {
  const rows = [["Pulse", "Billing and stock", "#0EA371"], ["Pays", "Accept payments", "#2563EB"], ["Talks", "WhatsApp follow-ups", "#6D4AFF"]];
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-4">
      {rows.map(([n, t, c], i) => (
        <div key={n} className={`fj fj-s${i + 1} flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2`}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold text-white" style={{ background: c }}>{n[0]}</span>
          <span className="text-[12.5px] text-white"><b className="font-semibold">Marichi{n}</b> <span className="text-white/60">{t}</span></span>
        </div>
      ))}
      <div className="fj fj-s4 mt-1 h-1.5 overflow-hidden rounded-full bg-white/15"><span className="fj-bar block h-full rounded-full bg-[#ee3b2b]" /></div>
    </div>
  );
}

function LiveScene() {
  const rows = ["Account set up", "Team trained", "First invoice sent"];
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 p-4">
      {rows.map((r, i) => (
        <p key={r} className={`fj fj-s${i + 1} flex items-center gap-3 text-[13px] text-white`}>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-[#073b1c]">{tick}</span>{r}
        </p>
      ))}
      <p className="fj fj-s4 mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-[#ee3b2b] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white"><span className="fj-live h-2 w-2 rounded-full bg-white" />Live</p>
    </div>
  );
}

const steps = [
  { n: "01", t: "Message us", d: "Tell us what you run and what is slowing you down. Two minutes on WhatsApp is enough.", scene: <ChatScene /> },
  { n: "02", t: "See it for your business", d: "We send a short walkthrough of the products that fit, with a clear plan and timeline.", scene: <PlanScene /> },
  { n: "03", t: "Go live with support", d: "We set it up with you, train your team and stay on WhatsApp when you need help.", scene: <LiveScene /> },
];

export default function FunnelJourney() {
  return (
    <div>
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div>
          <Eyebrow light>How it works</Eyebrow>
          <h2 className="font-display mt-4 text-4xl text-white sm:text-5xl lg:text-6xl">From first message to <span className="text-white/55">live, in three steps.</span></h2>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-5 whitespace-nowrap sm:flex-row sm:items-center">
          <WaButton message="Hi Marichi Labs, I'd like to talk about my business." source="funnel" />
          <Link href="/get-started/" className="text-[15px] font-semibold text-white underline decoration-white/30 underline-offset-[6px] transition hover:decoration-red">Find my best fit →</Link>
        </div>
      </div>

      <div className="relative mt-14">
        <div aria-hidden="true" className="relative mb-6 hidden h-3 lg:block">
          <span className="absolute left-[16.6%] right-[16.6%] top-1/2 h-px bg-white/20" />
          {["16.6%", "50%", "83.3%"].map((l) => <span key={l} className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40 bg-ink" style={{ left: l }} />)}
          <span className="fj-track absolute left-[16.6%] right-[16.6%] top-1/2"><span className="fj-run absolute -top-[5px] h-[11px] w-[11px] rounded-full bg-[#25D366] shadow-[0_0_0_6px_rgba(37,211,102,.18)]" /></span>
        </div>
        <ol className="grid gap-5 lg:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-3 transition duration-300 hover:-translate-y-1.5 hover:border-white/25 hover:bg-white/[0.07]">
              <div className="relative h-52 overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.09] to-white/[0.02]" aria-hidden="true">
                {s.scene}
              </div>
              <div className="px-3 pb-4 pt-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ee3b2b] text-[12px] font-bold text-white">{s.n}</span>
                  <h3 className="font-display text-2xl text-white">{s.t}</h3>
                </div>
                <p className="mt-3 text-[16px] leading-relaxed text-white/65">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
