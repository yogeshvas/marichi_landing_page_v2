"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { fullName, getProduct } from "@/lib/content";

const WaitlistContext = createContext<(productId: string, source?: string) => void>(() => {});
export const useWaitlist = () => useContext(WaitlistContext);

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<{ id: string; source: string } | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  const openWaitlist = useCallback((id: string, source = "site") => { setState("idle"); setMsg(""); setOpen({ id, source }); }, []);

  useEffect(() => {
    if (!open) return;
    emailRef.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open]);

  const product = open ? getProduct(open.id) : undefined;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: f.get("email"), name: f.get("name"), company: f.get("company"), phone: f.get("phone"), website: f.get("website"), product: open?.id, source: open?.source }) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong.");
      setState("done");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  const field = "w-full rounded-xl border border-line bg-white px-4 py-3 text-[16px] text-ink outline-none transition focus:border-ink/40";

  return (
    <WaitlistContext.Provider value={openWaitlist}>
      {children}
      {open && product && (
        <div data-lenis-prevent className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/40 p-4 sm:items-center" onMouseDown={(e) => e.target === e.currentTarget && setOpen(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="waitlist-title" className="w-full max-w-md rounded-2xl bg-white p-7">
            <div className="flex items-start justify-between gap-4">
              <h2 id="waitlist-title" className="font-display text-2xl text-ink">Join the {fullName(product)} waitlist</h2>
              <button type="button" aria-label="Close" onClick={() => setOpen(null)} className="text-2xl leading-none text-muted hover:text-ink">×</button>
            </div>
            {state === "done" ? (
              <p role="status" className="mt-6 text-lg text-ink">You&apos;re on the list. We&apos;ll email you when {fullName(product)} opens.</p>
            ) : (
              <form onSubmit={onSubmit} className="mt-5 grid gap-3">
                <label className="block"><span className="mb-1 block text-sm font-medium text-muted">Email</span><input ref={emailRef} name="email" type="email" required autoComplete="email" className={field} /></label>
                <label className="block"><span className="mb-1 block text-sm font-medium text-muted">Name</span><input name="name" autoComplete="name" className={field} /></label>
                <label className="block"><span className="mb-1 block text-sm font-medium text-muted">Company (optional)</span><input name="company" autoComplete="organization" className={field} /></label>
                <label className="block"><span className="mb-1 block text-sm font-medium text-muted">Phone (optional)</span><input name="phone" type="tel" autoComplete="tel" className={field} /></label>
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                <button type="submit" disabled={state === "loading"} className="mt-2 rounded-lg bg-ink px-6 py-3.5 text-[15px] font-semibold text-white transition hover:bg-red disabled:opacity-60">{state === "loading" ? "Saving…" : "Notify me"}</button>
                {state === "error" && <p role="alert" className="text-sm text-red">{msg}</p>}
              </form>
            )}
          </div>
        </div>
      )}
    </WaitlistContext.Provider>
  );
}
