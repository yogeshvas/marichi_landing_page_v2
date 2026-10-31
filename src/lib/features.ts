import { getProduct, type Product } from "@/lib/content";
import { productDetails } from "@/lib/productDetails";

export type Feature = { slug: string; title: string; text: string; h1: string; productId: string };

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Keyword-friendly URLs and headings for the features people actually search for.
// Key = "<product id>:<module title>". Anything not listed gets a slug from its title.
const overrides: Record<string, { slug: string; h1: string }> = {
  "talks:WhatsApp messaging": { slug: "whatsapp-business-api", h1: "WhatsApp Business API for growing businesses" },
  "talks:SMS and email": { slug: "sms-and-email-api", h1: "SMS and email API for campaigns and alerts" },
  "talks:AI voice": { slug: "voice-api-and-ai-calling", h1: "Voice API and AI calling for customer follow-ups" },
  "talks:Single wallet": { slug: "single-wallet-messaging", h1: "One wallet for SMS, WhatsApp, email and voice" },
  "talks:CRM integrations": { slug: "crm-integrations", h1: "Messaging that plugs into your Sales and Service CRM" },
  "pulse:Point of sale": { slug: "pos-software", h1: "POS software for shops and multi-store retail" },
  "pulse:Inventory control": { slug: "inventory-management", h1: "Inventory management software for multi-branch stores" },
  "pulse:Billing and invoicing": { slug: "billing-and-invoicing-software", h1: "Billing and invoicing software for retail and wholesale" },
  "pulse:Accounting": { slug: "accounting-software", h1: "Accounting software that posts as you sell" },
  "pulse:Payroll": { slug: "payroll-software", h1: "Payroll software for shops and small teams" },
  "pulse:Ask your numbers": { slug: "reports-and-dashboards", h1: "Reports and dashboards you can ask questions" },
  "pulse:Accounting integrations": { slug: "accounting-integrations", h1: "Accounting integrations for Tally, Zoho and Odoo" },
  "pulse:Online store": { slug: "online-store-builder", h1: "Create an online store in one click" },
  "pulse:Retailer payments": { slug: "collect-payments-for-retailers", h1: "Accept payments on behalf of your retailers" },
};

export function featuresOf(product: Product): Feature[] {
  const d = productDetails[product.id];
  if (!d) return [];
  return d.modules.map((m) => {
    const o = overrides[`${product.id}:${m.title}`];
    return { slug: o?.slug ?? slugify(m.title), title: m.title, text: m.text, h1: o?.h1 ?? `${m.title} in Marichi${product.name}`, productId: product.id };
  });
}

export const getFeature = (productKey: string, featureSlug: string) => {
  const p = getProduct(productKey);
  return p ? featuresOf(p).find((f) => f.slug === featureSlug) : undefined;
};

export const featuresPath = (p: Product) => `/products/${p.slug}/features/`;
export const featurePath = (p: Product, f: Feature) => `/products/${p.slug}/features/${f.slug}/`;
