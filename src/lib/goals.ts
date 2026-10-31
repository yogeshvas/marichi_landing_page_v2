// "What are you looking for?" in the words a visitor would actually search with.
// Drives the home-page finder and the get-started quiz.
export const needs = [
  { id: "pos", title: "Run my shop", label: "POS and inventory for my shop", short: "Shop software", blurb: "Sell at the till, track stock, keep your books and pay staff.", products: ["pulse", "pays", "talks"] },
  { id: "payments", title: "Get paid", label: "Accept mobile money, card and bank payments", short: "Payments", blurb: "One gateway for every way customers pay, matched to your orders.", products: ["pays", "pulse", "sign"] },
  { id: "messaging", title: "Message customers", label: "Message customers on WhatsApp, SMS and email", short: "Customer messaging", blurb: "Send campaigns and follow-ups from a single wallet.", products: ["talks", "card", "ops"] },
  { id: "sales", title: "Manage my sales team", label: "Track my sales team and leads", short: "Sales and CRM", blurb: "See field visits, manage your pipeline and follow up on time.", products: ["grows", "ops", "card"] },
  { id: "fleet", title: "Move goods", label: "Manage trucks, loads and invoices", short: "Transport software", blurb: "Run fleet, border paperwork and invoicing on one ledger.", products: ["moves", "pays", "sign"] },
  { id: "verify", title: "Verify and sign", label: "Verify field audits and sign contracts", short: "Audits and e-signatures", blurb: "Get proof the work happened and contracts that hold up.", products: ["assure", "sign", "grows"] },
] as const;

export const businessTypes = ["Retail / shop", "Wholesale / distribution", "Transport / logistics", "Financial services", "Sales team / agency", "Other"] as const;
export const businessSizes = ["Just me", "2–10 people", "11–50 people", "50+ people"] as const;
