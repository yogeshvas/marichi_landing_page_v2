"use client";

import { useEffect, useRef, useState } from "react";
import { WaButton } from "@/components/WhatsApp";
import { industries, languages, voiceTemplates, type LangId } from "@/lib/voiceDemos";

const Play = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>;
const Pause = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>;

// A sample AI voice call you can play: pick an industry, a template and a language. Lines appear as a live
// transcript and, when the device has a voice for the language, are read aloud with the browser's own voices.
export default function VoiceStudio() {
  const [ind, setInd] = useState<(typeof industries)[number]["id"]>("BFSI");
  const list = voiceTemplates.filter((t) => t.industry === ind);
  const [tid, setTid] = useState(list[0].id);
  const [lang, setLang] = useState<LangId>("en");
  const [sound, setSound] = useState(true);
  const [n, setN] = useState(0); // lines shown so far
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [note, setNote] = useState("");
  const feed = useRef<HTMLDivElement>(null);

  const meta = industries.find((i) => i.id === ind)!;
  const t = voiceTemplates.find((x) => x.id === tid) ?? list[0];
  const L = languages.find((l) => l.id === lang)!;
  const lines = t.lines[lang];

  const stop = () => { if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel(); };
  const reset = () => { stop(); setN(0); setPlaying(false); setDone(false); setNote(""); };

  useEffect(() => { reset(); return stop; }, [tid, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!playing || n < 1) return;
    const line = lines[n - 1], ai = (n - 1) % 2 === 0;
    let fired = false, timer = 0;
    const next = () => {
      if (fired) return;
      fired = true; clearTimeout(timer);
      timer = window.setTimeout(() => (n < 5 ? setN(n + 1) : (setPlaying(false), setDone(true))), 450);
    };
    let spoke = false;
    if (sound && typeof speechSynthesis !== "undefined") {
      const voices = speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith(L.tag.slice(0, 2)));
      if (voices.length) {
        const u = new SpeechSynthesisUtterance(line);
        u.lang = L.tag; u.voice = ai ? voices[0] : voices[1] ?? voices[0];
        u.rate = 0.95; u.pitch = ai ? 1.05 : 0.85;
        u.onend = next; u.onerror = next;
        speechSynthesis.speak(u); spoke = true;
      } else setNote(`This device has no ${L.label} voice, so you'll see captions only.`);
    }
    timer = window.setTimeout(next, Math.max(2400, line.length * (spoke ? 140 : 62)));
    return () => { fired = true; clearTimeout(timer); stop(); };
  }, [playing, n]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { feed.current?.scrollTo({ top: feed.current.scrollHeight, behavior: "smooth" }); }, [n]);

  const toggle = () => {
    if (done) { reset(); setN(1); setPlaying(true); return; }
    if (!playing && n === 0) { setN(1); setPlaying(true); return; }
    setPlaying(!playing);
  };
  const pickIndustry = (id: typeof ind) => { setInd(id); setTid(voiceTemplates.find((x) => x.industry === id)!.id); };
  const speaking = playing ? ((n - 1) % 2 === 0 ? "ai" : "cust") : null;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-14">
      <div>
        <div role="tablist" aria-label="Industry" className="grid gap-2 sm:grid-cols-3">
          {industries.map((i) => (
            <button key={i.id} role="tab" aria-selected={i.id === ind} type="button" onClick={() => pickIndustry(i.id)} className="rounded-2xl border p-4 text-left transition duration-300" style={i.id === ind ? { background: i.color, borderColor: i.color, color: "#fff" } : { background: "#fff", borderColor: "var(--color-line, #e7e3dc)" }}>
              <span className="block text-[18px] font-bold">{i.label}</span>
              <span className={`mt-0.5 block text-[12.5px] leading-snug ${i.id === ind ? "text-white/85" : "text-muted"}`}>{i.full}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 max-w-xl text-[16px] text-muted">{meta.text}</p>

        <p className="mt-8 text-[12px] font-bold uppercase tracking-[0.16em] text-muted">1 · Choose a call</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {list.map((x) => (
            <button key={x.id} type="button" aria-pressed={x.id === t.id} onClick={() => setTid(x.id)} className="rounded-xl border p-4 text-left transition" style={x.id === t.id ? { borderColor: meta.color, background: `color-mix(in srgb, ${meta.color} 8%, white)` } : { borderColor: "var(--color-line, #e7e3dc)", background: "#fff" }}>
              <span className="block text-[15.5px] font-bold text-ink">{x.title}</span>
              <span className="mt-1 block text-[13px] leading-snug text-muted">{x.caller} calls {x.callee}</span>
            </button>
          ))}
        </div>

        <p className="mt-8 text-[12px] font-bold uppercase tracking-[0.16em] text-muted">2 · Choose a language</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {languages.map((l) => (
            <button key={l.id} type="button" aria-pressed={l.id === lang} onClick={() => setLang(l.id)} className="rounded-full border px-4 py-2 text-[14px] font-semibold transition" style={l.id === lang ? { background: "#141412", color: "#fff", borderColor: "#141412" } : { background: "#fff", color: "#6b665e", borderColor: "var(--color-line, #e7e3dc)" }}>{l.label}</button>
          ))}
          <label className="ml-auto flex cursor-pointer items-center gap-2 text-[13px] text-muted">
            <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} className="accent-red" /> Read aloud
          </label>
        </div>
        <p className="mt-2 text-[12.5px] text-muted">More languages, including Bemba and Nyanja, can be added with native-speaker review.</p>

        <div className="mt-8 rounded-2xl border border-line bg-white p-5">
          <p className="text-[16px] leading-relaxed text-ink/85">{t.scenario}</p>
          <ol className="mt-4 space-y-2">
            {t.steps.map((s, i) => (
              <li key={s} className="flex items-start gap-3 text-[14.5px] text-ink/80">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: meta.color }}>{i + 1}</span>{s}
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <WaButton message={`Hi Marichi Labs, I'd like the "${t.title}" AI voice call for ${meta.full.toLowerCase()}.`} source={`voice-${t.id}`}>I want this call</WaButton>
        </div>
      </div>

      {/* Phone */}
      <div className="mx-auto lg:sticky lg:top-24">
        <div className="relative rounded-[2.6rem] bg-ink p-3" style={{ boxShadow: `0 40px 80px -30px ${meta.color}aa` }}>
          <div className="absolute left-1/2 top-3 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-ink" aria-hidden="true" />
          <div className="relative flex h-[34rem] w-[17rem] flex-col overflow-hidden rounded-[2rem] text-white sm:w-[18.5rem]" style={{ background: `linear-gradient(170deg, color-mix(in srgb, ${meta.color} 55%, #0d0d10), #0d0d10 75%)` }}>
            <div className="px-5 pb-3 pt-9 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">AI voice call · {L.label}</p>
              <p className="mt-1 text-[17px] font-bold">{t.caller}</p>
              <p className="text-[12.5px] text-white/60">calling {t.callee}</p>
            </div>
            <div ref={feed} className={`flex-1 space-y-2.5 overflow-y-auto px-4 ${done ? "pb-48" : "pb-3"}`} data-lenis-prevent dir={L.rtl ? "rtl" : "ltr"} aria-live="polite">
              {n === 0 && <p className="mt-10 text-center text-[13px] text-white/55">Press play to hear the call.</p>}
              {lines.slice(0, n).map((line, i) => {
                const ai = i % 2 === 0;
                return <p key={i} className={`mm-prev max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-snug ${ai ? "rounded-bl-md bg-white/15" : "rounded-br-md bg-[#25D366] text-[#073b1c] ltr:ml-auto rtl:mr-auto"}`}>{line}</p>;
              })}
            </div>
            {note && <p className="px-4 pb-2 text-center text-[11.5px] text-amber-200/90">{note}</p>}
            <div className="flex h-9 items-end justify-center gap-[3px]" aria-hidden="true">
              {Array.from({ length: 28 }).map((_, i) => <span key={i} className="w-[3px] rounded-full bg-white/70" style={{ height: playing ? undefined : 4, animation: playing ? `vs-bar ${0.5 + (i % 5) * 0.12}s ease-in-out ${i * 0.03}s infinite alternate` : undefined, opacity: speaking === "cust" ? 0.5 : 1 }} />)}
            </div>
            <div className="flex items-center justify-center gap-4 px-4 pb-6 pt-3">
              <button type="button" onClick={toggle} aria-label={playing ? "Pause call" : done ? "Replay call" : "Play call"} className="flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-[#073b1c] shadow-lg transition hover:scale-105">{playing ? <Pause /> : <Play />}</button>
            </div>

            {done && (
              <div className="mm-prev absolute inset-x-3 bottom-3 z-10 rounded-2xl bg-white p-4 text-ink shadow-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: meta.color }}>Call outcome</p>
                <ul className="mt-2 space-y-1.5">
                  {t.writes.map(([k, v]) => <li key={k} className="flex items-baseline justify-between gap-3 text-[13px]"><span className="text-muted">{k}</span><span className="text-right font-semibold">{v}</span></li>)}
                </ul>
                <button type="button" onClick={toggle} className="mt-3 w-full rounded-full py-2 text-[13px] font-semibold text-white" style={{ background: meta.color }}>Replay call</button>
              </div>
            )}
          </div>
        </div>
        <p className="mx-auto mt-4 max-w-[18rem] text-center text-[12px] text-muted">Sample script for illustration. Real calls use your customer data, language and tone.</p>
      </div>
    </div>
  );
}
