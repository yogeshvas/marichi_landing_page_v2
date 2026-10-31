// Cookie consent, kept in one first-party cookie. "Essential" cookies need no consent and are not listed here:
// the visitor's country (so prices show in the right currency) and the staff login.
export type Consent = { v: 1; preferences: boolean; analytics: boolean; at: number };

const NAME = "mc_consent";
export const GA_ID = /^G-[A-Z0-9]{4,}$/.test(process.env.NEXT_PUBLIC_GA_ID ?? "") ? (process.env.NEXT_PUBLIC_GA_ID as string) : null;

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${NAME}=([^;]*)`));
  if (!m) return null;
  try {
    const c = JSON.parse(decodeURIComponent(m[1]));
    return c && c.v === 1 ? { v: 1, preferences: !!c.preferences, analytics: !!c.analytics, at: Number(c.at) || 0 } : null;
  } catch { return null; }
}

export function writeConsent(c: { preferences: boolean; analytics: boolean }) {
  const value: Consent = { v: 1, ...c, at: Date.now() };
  document.cookie = `${NAME}=${encodeURIComponent(JSON.stringify(value))}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  window.dispatchEvent(new Event("mc-consent"));
}

export const preferencesAllowed = () => readConsent()?.preferences === true;
export const openCookieSettings = () => window.dispatchEvent(new Event("mc-open-cookies"));
