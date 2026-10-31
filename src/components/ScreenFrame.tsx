import type { Scene, Step } from "@/lib/stories";
import StoryScene from "@/components/StoryScene";
import { Fragment } from "react";

const d = (s: number) => ({ ["--sd" as string]: `${s}s` }) as React.CSSProperties;
const time = (i: number) => `10:${String(41 + i).padStart(2, "0")}`;

const Ticks = () => <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 5l3 3 6-7M6 8l1 .5 7-7.500" /></svg>;

// An original WhatsApp-style chat screen inside a phone.
function PhoneChat({ scene }: { scene: Extract<Scene, { kind: "chat" }> }) {
  const name = scene.contact ?? scene.title;
  return (
    <div className="relative mx-auto h-[25rem] w-[15.5rem] overflow-hidden rounded-[2.4rem] border-[7px] border-[#15130f] bg-[#efeae2] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.7)]" role="img" aria-label={`Chat screen: ${scene.msgs.map((m) => m.text).join(" ")}`}>
      <div className="absolute left-1/2 top-0 z-20 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-[#15130f]" />
      <div className="flex items-center gap-2.5 bg-[#0b5a4e] px-3 pb-2.5 pt-7 text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-[13px] font-bold">{name.charAt(0)}</span>
        <span className="min-w-0 leading-tight"><span className="block truncate text-[13px] font-semibold">{name}</span><span className="block text-[10px] text-white/70">online</span></span>
      </div>
      <div className="h-[15.4rem] space-y-2 overflow-hidden px-2.5 pt-3" style={{ backgroundImage: "radial-gradient(rgba(0,0,0,0.045) 1px, transparent 1px)", backgroundSize: "14px 14px" }}>
        <p className="mx-auto w-fit rounded-md bg-[#fff4c4] px-2 py-0.5 text-[9px] font-medium text-[#6a5f2f]">TODAY</p>
        {scene.msgs.map((m, i) => (
          <div key={m.text} className={`s-in flex ${m.from === "us" ? "justify-end" : ""}`} style={d(0.5 + i * 1.2)}>
            <div className={`max-w-[88%] rounded-lg px-2.5 py-1.5 text-[12px] leading-snug text-[#15130f] shadow-sm ${m.from === "us" ? "rounded-tr-none bg-[#d9fdd3]" : "rounded-tl-none bg-white"}`}>
              {m.card && (
                <div className="mb-1.5 rounded-md bg-black/[0.05] p-2">
                  <p className="text-[11px] font-bold">{m.card.title}</p>
                  {m.card.lines.map((l) => <p key={l} className="text-[10.5px] text-black/60">{l}</p>)}
                  {m.card.button && <p className="mt-1.5 rounded border border-[#0b8a74]/30 bg-white py-1 text-center text-[10.5px] font-bold text-[#0b8a74]">{m.card.button}</p>}
                </div>
              )}
              {m.text}
              <span className="ml-2 inline-flex translate-y-0.5 items-center gap-1 align-bottom text-[9px] text-black/45">{time(i)}{m.from === "us" && <Ticks />}</span>
            </div>
          </div>
        ))}
        <div className="flex gap-1 pl-1" aria-hidden="true">{[0, 1, 2].map((i) => <span key={i} className="s-type h-1.5 w-1.5 rounded-full bg-black/35" style={{ animationDelay: `${i * 0.15}s` }} />)}</div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-[#f0f2f5] px-2.5 py-2.5">
        <span className="flex-1 rounded-full bg-white px-3 py-1.5 text-[11px] text-black/40">Message</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b8a74]"><svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M3 20l18-8L3 4v6l12 2-12 2z" /></svg></span>
      </div>
    </div>
  );
}

// An original browser/app screen: window chrome, product sidebar that follows the active step, and a top bar.
function AppWindow({ id, name, steps, si, scene }: { id: string; name: string; steps: Step[]; si: number; scene: Scene }) {
  return (
    <div className="w-full max-w-[34rem] overflow-hidden rounded-xl bg-white shadow-[0_30px_70px_-25px_rgba(0,0,0,0.7)]">
      <div className="flex items-center gap-1.5 border-b border-line bg-[#f3f1ec] px-3.5 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ee6a5f]" /><span className="h-2.5 w-2.5 rounded-full bg-[#f5bf4f]" /><span className="h-2.5 w-2.5 rounded-full bg-[#61c554]" />
        <span className="ml-3 flex-1 truncate rounded-md bg-white px-3 py-1 text-[11px] text-muted">app.marichi{id}.com</span>
      </div>
      <div className="grid grid-cols-[8.5rem_1fr]">
        <aside className="border-r border-line bg-[#faf9f7] p-3">
          <p className="flex items-center gap-2 text-[12px] font-bold text-ink"><span className="flex h-5 w-5 items-center justify-center rounded bg-red text-[10px] text-white">M</span>{name}</p>
          <ul className="mt-4 space-y-1">
            {steps.map((s, n) => (
              <li key={s.title} className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11.5px] font-medium transition ${n === si ? "bg-red text-white" : "text-muted"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${n === si ? "bg-white" : "bg-ink/20"}`} />{s.title}
              </li>
            ))}
          </ul>
        </aside>
        <div className="min-w-0 bg-white">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5"><span className="text-[12px] font-bold text-ink">{steps[si].title}</span><span className="flex items-center gap-2"><span className="h-6 w-20 rounded-full bg-cream" /><span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-white">A</span></span></div>
          <div className="p-3.5">
            {scene.kind === "bars" && scene.kpis && (
              <div className="mb-3 grid grid-cols-3 gap-2">{scene.kpis.map(([a, b], i) => <div key={a} className="s-in rounded-lg bg-cream px-3 py-2" style={d(0.1 + i * 0.12)}><p className="text-[10px] font-medium text-muted">{a}</p><p className="text-[15px] font-bold text-ink">{b}</p></div>)}</div>
            )}
            <StoryScene scene={scene} bare />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScreenFrame({ id, name, steps, si }: { id: string; name: string; steps: Step[]; si: number }) {
  const scene = steps[si].scene;
  return <Fragment>{scene.kind === "chat" ? <PhoneChat scene={scene} /> : <AppWindow id={id} name={name} steps={steps} si={si} scene={scene} />}</Fragment>;
}
