"use client";

import { useState } from "react";
import { products, fullName } from "@/lib/content";
import { WaButton } from "@/components/WhatsApp";

const field = "w-full rounded-xl border border-line bg-white px-4 py-3 text-[16px] text-ink outline-none transition focus:border-ink/40";

export default function SalesForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setState("loading");
    try {
      const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, products: [f.product], source: "contact-sales" }) });
      if (!res.ok) throw new Error();
      setState("done");
    } catch { setState("error"); }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-2xl border border-line bg-white p-8">
        <h2 className="font-display text-2xl text-ink">Thanks, we have your request.</h2>
        <p className="mt-2 text-muted">Our team will reply shortly. For a faster answer, message us on WhatsApp.</p>
        <div className="mt-5"><WaButton message="Hi Marichi Labs, I just sent a sales request on your website." source="contact-sales-done" /></div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-line bg-white p-6 sm:grid-cols-2 sm:p-8">
      {[["name", "Your name", "name", true], ["email", "Work email", "email", true], ["phone", "Phone or WhatsApp", "tel", false], ["company", "Company", "organization", false]].map(([n, l, ac, req]) => (
        <label key={n as string} className="block"><span className="mb-1 block text-sm font-medium text-muted">{l as string}</span><input name={n as string} type={n === "email" ? "email" : n === "phone" ? "tel" : "text"} autoComplete={ac as string} required={!!req} className={field} /></label>
      ))}
      <label className="block"><span className="mb-1 block text-sm font-medium text-muted">Company size</span>
        <select name="size" className={field} defaultValue=""><option value="" disabled>Select</option>{["Just me", "2–10", "11–50", "51–200", "200+"].map((o) => <option key={o}>{o}</option>)}</select></label>
      <label className="block"><span className="mb-1 block text-sm font-medium text-muted">Product of interest</span>
        <select name="product" className={field} defaultValue=""><option value="" disabled>Select</option>{products.map((p) => <option key={p.id} value={p.id}>{fullName(p)}</option>)}</select></label>
      <label className="block sm:col-span-2"><span className="mb-1 block text-sm font-medium text-muted">Expected monthly volume (messages, invoices, trips…)</span><input name="volume" className={field} /></label>
      <label className="block sm:col-span-2"><span className="mb-1 block text-sm font-medium text-muted">What would you like to achieve?</span><textarea name="message" rows={4} className={field} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="sm:col-span-2">
        <button type="submit" disabled={state === "loading"} className="rounded-lg bg-ink px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-red disabled:opacity-60">{state === "loading" ? "Sending…" : "Request a demo"}</button>
        {state === "error" && <p role="alert" className="mt-3 text-sm text-red">Something went wrong. Please try again or message us on WhatsApp.</p>}
      </div>
    </form>
  );
}
