import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { del, hit, kvEnabled, rpush } from "@/lib/kv";

// Persists a record to .data/<name>.jsonl (works locally / on a VPS) and forwards it to an
// optional webhook (Zapier, Make, Google Sheets, CRM...). Returns true if either succeeded.
export async function saveRecord(name: "leads" | "subscribers" | "waitlist", record: Record<string, unknown>, webhookEnv: string) {
  const entry = { ...record, createdAt: new Date().toISOString() };
  let saved = false;
  try {
    const dir = path.join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, `${name}.jsonl`), JSON.stringify(entry) + "\n");
    saved = true;
  } catch {
    // read-only filesystem (serverless): rely on the webhook
  }
  if (kvEnabled()) { try { await rpush(`mc:${name}`, JSON.stringify(entry)); saved = true; } catch {} }
  const hook = process.env[webhookEnv];
  if (hook) {
    try {
      const res = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(entry) });
      saved = saved || res.ok;
    } catch {}
  }
  return saved;
}

// Rate limiting. On Vercel every request can land on a different instance, so the counter lives in the
// KV store; without it (local development) a per-process counter is used.
const hits = new Map<string, number[]>();
export async function rateLimited(key: string, limit = 5, windowMs = 60_000) {
  if (kvEnabled()) {
    try { return (await hit(`mc:rl:${key}`, Math.ceil(windowMs / 1000))) > limit; } catch { /* fail open rather than block real visitors */ return false; }
  }
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > limit;
}
export async function rateReset(key: string) {
  hits.delete(key);
  if (kvEnabled()) { try { await del(`mc:rl:${key}`); } catch {} }
}
