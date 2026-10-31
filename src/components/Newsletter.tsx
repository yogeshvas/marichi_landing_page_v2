"use client";

import Link from "next/link";
import { useState } from "react";

export default function Newsletter({ source = "site", dark = false, compact = false, small = false }: { source?: string; dark?: boolean; compact?: boolean; small?: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [topics, setTopics] = useState<string[]>(["sales", "tech"]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), website: form.get("website"), topics, source }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong.");
      setState("done");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  const toggle = (t: string) => setTopics((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  const text = dark ? "text-white" : "text-ink";
  const sub = dark ? "text-white/70" : "text-muted";

  if (state === "done") {
    return <p role="status" className={`text-lg font-semibold ${text}`}>Check your inbox to confirm your subscription.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-xl">
      {!compact && (
        <fieldset className="mb-4 flex flex-wrap gap-2">
          <legend className="sr-only">Topics</legend>
          {[{ id: "sales", label: "Sales" }, { id: "tech", label: "Tech" }].map((t) => (
            <label key={t.id} className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition ${topics.includes(t.id) ? (dark ? "bg-white text-ink" : "bg-ink text-white") : dark ? "border border-white/20 text-white/70" : "border border-ink/20 text-muted"}`}>
              <input type="checkbox" className="sr-only" checked={topics.includes(t.id)} onChange={() => toggle(t.id)} />
              {t.label}
            </label>
          ))}
        </fieldset>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`email-${source}`} className="sr-only">Email address</label>
        <input
          id={`email-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className={`min-w-0 flex-1 rounded-lg px-6 py-3.5 text-[17px] outline-none ring-1 transition focus:ring-2 focus:ring-red ${dark ? "bg-white/10 text-white placeholder:text-white/40 ring-white/20" : "bg-white text-ink ring-line"}`}
        />
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button type="submit" disabled={state === "loading" || topics.length === 0} className={`bg-ink ${small ? "px-4 py-2.5 text-[15px]" : "px-7 py-3.5 text-[17px]"} font-semibold text-white transition hover:bg-red disabled:opacity-60 ${dark ? "!bg-white !text-ink hover:!bg-red hover:!text-white" : ""}`}>
          {state === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {(state === "error" || !compact) && (
        <p className={`mt-3 text-sm ${state === "error" ? "text-red" : sub}`} role={state === "error" ? "alert" : undefined}>
          {state === "error" ? msg : <>Tech on Fridays, Sales on Saturdays. Unsubscribe any time. See our <Link href="/privacy/" className="underline underline-offset-2">privacy page</Link>.</>}
        </p>
      )}
    </form>
  );
}
