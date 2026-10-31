// Pricing and currency. Edit the numbers below to change what the site shows.
// PLACEHOLDERS: the INR figures come from the website spec; the ZMW, AED and USD figures are
// hand-set equivalents. Replace all of them with your real price list before launch.

export type Currency = "ZMW" | "INR" | "AED" | "USD";

export const CURRENCIES: Record<Currency, { label: string; locale: string; tax: string }> = {
  ZMW: { label: "Zambian kwacha (ZMW)", locale: "en-ZM", tax: "Prices exclude VAT." },
  INR: { label: "Indian rupee (INR)", locale: "en-IN", tax: "Prices exclude GST." },
  AED: { label: "UAE dirham (AED)", locale: "en-AE", tax: "Prices exclude VAT." },
  USD: { label: "US dollar (USD)", locale: "en-US", tax: "Prices exclude applicable taxes." },
};

// Primary markets are Zambia and India. Anyone else sees USD, and AED in the UAE.
export const COUNTRY_CURRENCY: Record<string, Currency> = { ZM: "ZMW", IN: "INR", AE: "AED" };
export const COUNTRY_NAME: Record<string, string> = { ZM: "Zambia", IN: "India", AE: "the UAE" };

export const currencyForCountry = (code?: string): Currency => COUNTRY_CURRENCY[(code ?? "").toUpperCase()] ?? "USD";

export const formatMoney = (amount: number, currency: Currency) =>
  new Intl.NumberFormat(CURRENCIES[currency].locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

export const YEARLY_DISCOUNT = 0.2;
export const yearlyMonthly = (monthly: number) => Math.round(monthly * (1 - YEARLY_DISCOUNT));

export type Plan = {
  id: string;
  name: string;
  bestFor: string;
  prices?: Record<Currency, number>; // monthly; omit for custom plans
  highlighted?: boolean;
  features: string[];
};

const p = (INR: number, USD: number, AED: number, ZMW: number) => ({ INR, USD, AED, ZMW });

// Keyed by product id. Products with no entry show "custom pricing" and route to WhatsApp.
export const pricingPlans: Record<string, Plan[]> = {
  talks: [
    { id: "starter", name: "Starter", bestFor: "Startups testing messaging", prices: p(999, 12, 49, 299), features: ["SMS credits included", "WhatsApp Business API", "Basic delivery reports", "Email support"] },
    { id: "growth", name: "Growth", bestFor: "Growing businesses", prices: p(4999, 59, 219, 1499), highlighted: true, features: ["Higher message credits", "Campaign manager", "Two-way inbox", "Webhooks", "Priority support"] },
    { id: "business", name: "Business", bestFor: "High-volume senders", prices: p(14999, 179, 659, 4499), features: ["Dedicated sender IDs", "Voice and IVR", "Advanced analytics", "Account manager"] },
    { id: "enterprise", name: "Enterprise", bestFor: "Large enterprises", features: ["Volume rates", "SLA", "Dedicated infrastructure", "On-premise options"] },
  ],
  pulse: [
    { id: "solo", name: "Solo", bestFor: "Freelancers and single shops", prices: p(499, 6, 22, 149), features: ["Tax-ready billing and invoicing", "Inventory", "1 user"] },
    { id: "business", name: "Business", bestFor: "Small teams", prices: p(1999, 24, 89, 599), highlighted: true, features: ["Everything in Solo", "CRM", "Purchase orders", "Mobile app", "5 users"] },
    { id: "pro", name: "Pro", bestFor: "Multi-branch businesses", prices: p(4999, 59, 219, 1499), features: ["Everything in Business", "HR and payroll", "Multi-branch", "Advanced reports", "20 users"] },
    { id: "enterprise", name: "Enterprise", bestFor: "Large organizations", features: ["Unlimited users", "Custom modules", "API access", "Dedicated support"] },
  ],
};

export const hasPlans = (productId: string) => !!pricingPlans[productId];

export function startingPrice(productId: string, currency: Currency): number | null {
  const prices = (pricingPlans[productId] ?? []).flatMap((pl) => (pl.prices ? [pl.prices[currency]] : []));
  return prices.length ? Math.min(...prices) : null;
}

export const pricingKeyword: Record<string, string> = {
  talks: "SMS, WhatsApp and voice messaging plans",
  pulse: "billing, inventory and CRM plans",
};
