"use client";

import { useState } from "react";
import { Container } from "@/components/ui";

export default function AdminLogin() {
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setErr("");
    const res = await fetch("/api/admin/login/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: new FormData(e.currentTarget).get("password") }) });
    const d = await res.json().catch(() => ({}));
    if (res.ok) { window.location.href = "/admin/blog/"; return; }
    setErr(d.error ?? "Could not sign in."); setBusy(false);
  }
  return (
    <section className="pb-16 pt-28 sm:pt-36">
      <Container className="max-w-md">
        <h1 className="font-display text-4xl text-ink">Blog admin</h1>
        <p className="mt-3 text-muted">Sign in to write and publish posts.</p>
        <form onSubmit={onSubmit} className="mt-8 grid gap-3">
          <label className="block"><span className="mb-1 block text-sm font-medium text-muted">Password</span>
            <input name="password" type="password" required autoFocus autoComplete="current-password" className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[16px] outline-none focus:border-ink/40" /></label>
          <button disabled={busy} className="rounded-lg bg-ink px-6 py-3.5 text-[15px] font-semibold text-white transition hover:bg-red disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
          {err && <p role="alert" className="text-sm text-red">{err}</p>}
        </form>
      </Container>
    </section>
  );
}
