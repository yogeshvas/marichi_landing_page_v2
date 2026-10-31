// Durable storage for hosting without a disk (Vercel). Talks to Upstash Redis over its REST API.
// Connect the "Upstash Redis" integration in Vercel (Storage tab) and it sets KV_REST_API_URL and
// KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL / _TOKEN). Without them, local files are used instead.
const url = () => process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = () => process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const kvEnabled = () => !!(url() && token());
export const isServerless = () => !!process.env.VERCEL;
// On Vercel the disk is temporary, so writing anything that must last needs the KV store.
export const durableStorageMissing = () => isServerless() && !kvEnabled();
export const STORAGE_HELP = "Storage is not connected. In Vercel, open Storage, add the Upstash Redis integration and redeploy.";

async function cmd<T = unknown>(...args: (string | number)[]): Promise<T> {
  const res = await fetch(url()!.replace(/\/$/, ""), { method: "POST", headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" }, body: JSON.stringify(args), cache: "no-store" });
  const j = (await res.json().catch(() => ({}))) as { result?: T; error?: string };
  if (!res.ok || j.error) throw new Error(j.error ?? `KV request failed (${res.status})`);
  return j.result as T;
}

export async function hgetall(key: string): Promise<Record<string, string>> {
  const flat = (await cmd<string[]>("HGETALL", key)) ?? [];
  const out: Record<string, string> = {};
  for (let i = 0; i < flat.length; i += 2) out[flat[i]] = flat[i + 1];
  return out;
}
export const hset = (key: string, field: string, value: string) => cmd("HSET", key, field, value);
export const rpush = (key: string, value: string) => cmd("RPUSH", key, value);
export const del = (key: string) => cmd("DEL", key);
export async function hit(key: string, windowSec: number) {
  const n = await cmd<number>("INCR", key);
  if (n === 1) await cmd("EXPIRE", key, windowSec);
  return n;
}
