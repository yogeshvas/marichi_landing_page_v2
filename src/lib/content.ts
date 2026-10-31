// All page copy lives here so pages, menus, sitemap and structured data stay in sync.
// Source: Marichi Labs pitch deck (v2). Copy that goes beyond the deck is marked "review".

export type ProductStatus = "live" | "beta" | "coming_soon";

export type Product = {
  id: string; // short internal key, e.g. "pulse"
  slug: string; // URL slug, e.g. "marichi-pulse"
  status: ProductStatus;
  signupUrl?: string;
  demoUrl?: string;
  appUrl?: string; // where signed-in customers open the product
  launch?: string; // e.g. "Q1 2027", for coming-soon products

  name: string; // suffix after "Marichi"
  category: "Run" | "Pay" | "Engage" | "Sell" | "Trust";
  tagline: string;
  intro: string;
  features: { title: string; text: string }[];
  bestFor: string[];
  solutions: string[];
  industries: string[];
};

type BaseProduct = Omit<Product, "id" | "status" | "signupUrl" | "demoUrl" | "appUrl" | "launch">;

const baseProducts: BaseProduct[] = [
  {
    slug: "pulse",
    name: "Pulse",
    category: "Run",
    tagline: "Run, bill and grow every store: POS, inventory, accounting and payroll.",
    intro:
      "MarichiPulse is the retail operating system for shop owners and multi-store businesses. It brings checkout, stock, books and payroll into one place so you always know how every store is performing.",
    features: [
      { title: "Point of sale and billing", text: "Fast checkout and invoicing at every counter, online or offline." },
      { title: "Inventory", text: "Track stock, reorders and transfers across all your stores." },
      { title: "Accounting", text: "Books that update automatically as you sell." },
      { title: "Payroll", text: "Pay your team accurately and on time." },
      { title: "Ask your numbers", text: "Ask a plain-language question and get an answer from live store data." },
    ],
    bestFor: ["Independent shop owners", "Multi-store retail chains", "Wholesalers and distributors"],
    solutions: ["business-intelligence", "workflow-automation"],
    industries: ["retail-fmcg"],
  },
  {
    slug: "moves",
    name: "Moves",
    category: "Run",
    tagline: "Transport ERP: every truck, load, border and invoice on one ledger.",
    intro:
      "MarichiMoves is a transport ERP built for cross-border freight. Fleet, loads, border documentation and invoicing sit on a single ledger instead of in spreadsheets and WhatsApp groups.",
    features: [
      { title: "Fleet and load management", text: "Assign trucks and loads and see where everything is." },
      { title: "Border and documentation", text: "Keep crossings and paperwork tied to the trip they belong to." },
      { title: "One ledger", text: "Costs, revenue and invoices for every trip in one place." },
      { title: "Live visibility", text: "A single view across trucks, drivers and customers." },
    ],
    bestFor: ["Freight and haulage companies", "Cross-border operators", "Fleet owners"],
    solutions: ["business-intelligence", "workflow-automation"],
    industries: ["transport-logistics"],
  },
  {
    slug: "pays",
    name: "Pays",
    category: "Pay",
    tagline: "One gateway to accept, send and reconcile every payment, across 15+ rails.",
    intro:
      "MarichiPays is a single payments gateway for businesses that sell across mobile money, cards, banks and wallets. Accept, send and reconcile from one integration.",
    features: [
      { title: "Accept payments", text: "Collect from customers across 15+ payment rails." },
      { title: "Send payouts", text: "Pay suppliers, staff and partners from one account." },
      { title: "Automatic reconciliation", text: "Every payment matched to the order or invoice it belongs to." },
      { title: "One integration", text: "Connect once instead of integrating each rail separately." },
    ],
    bestFor: ["Retailers and marketplaces", "Fintech and financial services", "Businesses with many payment channels"],
    solutions: ["workflow-automation", "business-intelligence"],
    industries: ["retail-fmcg", "financial-services", "transport-logistics"],
  },
  {
    slug: "talks",
    name: "Talks",
    category: "Engage",
    tagline: "Email, SMS, WhatsApp and AI voice from a single wallet and dashboard.",
    intro:
      "MarichiTalks puts every customer channel behind one wallet and one dashboard, so each conversation, campaign and follow-up can turn into revenue and trust.",
    features: [
      { title: "Four channels, one wallet", text: "Email, SMS, WhatsApp and AI voice, paid for from a single balance." },
      { title: "Unified dashboard", text: "See every conversation and campaign in one view." },
      { title: "AI voice", text: "Automated calls that handle routine conversations." },
      { title: "Campaigns and follow-ups", text: "Reach the right customers at the right moment." },
    ],
    bestFor: ["Retail and FMCG brands", "Sales and service teams", "Fintech and lenders"],
    solutions: ["conversations", "workflow-automation"],
    industries: ["retail-fmcg", "telecom-distribution", "financial-services"],
  },
  {
    slug: "grows",
    name: "Grows",
    category: "Sell",
    tagline: "Field force tracking, automated follow-ups and AI-written proposals.",
    intro:
      "MarichiGrows helps sales leaders manage a field team and win more deals. It tracks visits, automates follow-ups and drafts proposals with AI.",
    features: [
      { title: "Field force tracking", text: "See where your team is and which visits happened." },
      { title: "Automated follow-ups", text: "Never lose a lead because someone forgot to call." },
      { title: "AI-written proposals", text: "Draft a proposal in moments and refine it." },
      { title: "Meeting summaries and nudges", text: "AI summarises meetings and suggests who to call next." },
    ],
    bestFor: ["Distribution and FMCG sales teams", "Telecom channel teams", "B2B sales organisations"],
    solutions: ["ai-copilot", "workflow-automation"],
    industries: ["telecom-distribution", "retail-fmcg"],
  },
  {
    slug: "ops",
    name: "Ops",
    category: "Sell",
    tagline: "The sales CRM that keeps every lead, deal and pipeline moving.",
    intro:
      "MarichiOps is the sales CRM at the centre of the suite. Leads from MarichiCard, visits from MarichiGrows and conversations from MarichiTalks all land in one pipeline.",
    features: [
      { title: "Lead management", text: "Capture, assign and qualify every lead." },
      { title: "Deal pipeline", text: "A clear view of every deal and what it needs next." },
      { title: "AI nudges", text: "Prompts on who to call and where to act." },
      { title: "Connected suite", text: "Works with Card, Grows and Talks out of the box." },
    ],
    bestFor: ["Sales teams", "Distributors and wholesalers", "Professional service firms"],
    solutions: ["ai-copilot", "business-intelligence"],
    industries: ["telecom-distribution", "financial-services"],
  },
  {
    slug: "card",
    name: "Card",
    category: "Sell",
    tagline: "Smart digital visiting card: every scan becomes a lead in your CRM.",
    intro:
      "MarichiCard replaces paper business cards. Share your details with a tap or a scan and every contact lands straight in MarichiOps as a lead.",
    features: [
      { title: "Smart digital card", text: "Share name, links and offers from any phone." },
      { title: "Scan to lead", text: "Each scan creates a lead automatically." },
      { title: "CRM sync", text: "Leads flow into MarichiOps with no manual entry." },
      { title: "Always up to date", text: "Change a detail once and every card reflects it." },
    ],
    bestFor: ["Sales representatives", "Event and trade-show teams", "Small businesses"],
    solutions: ["conversations", "ai-copilot"],
    industries: ["telecom-distribution", "retail-fmcg"],
  },
  {
    slug: "assure",
    name: "Assure",
    category: "Trust",
    tagline: "Geo-tagged field audits with AI tamper detection on every photo.",
    intro:
      "MarichiAssure gives you proof that field work actually happened. Audits are geo-tagged and every photo is checked by AI for tampering.",
    features: [
      { title: "Geo-tagged audits", text: "Every audit is tied to a verified location." },
      { title: "AI tamper detection", text: "Photos are checked for edits and reuse." },
      { title: "Structured checklists", text: "Capture the same data in the same way every time." },
      { title: "Reporting", text: "Review results across stores, routes and teams." },
    ],
    bestFor: ["FMCG and retail audit teams", "Distributors and channel managers", "Logistics operators"],
    solutions: ["business-intelligence", "workflow-automation"],
    industries: ["telecom-distribution", "transport-logistics", "retail-fmcg"],
  },
  {
    slug: "sign",
    name: "Sign",
    category: "Trust",
    tagline: "Verified, tamper-proof e-signatures. Sign anything, prove everything.",
    intro:
      "MarichiSign lets people sign contracts and forms from anywhere, with verification and a tamper-proof record that stands up when you need to prove it.",
    features: [
      { title: "Verified signers", text: "Confirm who signed." },
      { title: "Tamper-proof records", text: "Every signed document is protected against changes." },
      { title: "Sign from any device", text: "Customers and partners sign from a phone, no printing." },
      { title: "Complete audit trail", text: "A clear history of who did what and when." },
    ],
    bestFor: ["Financial services", "Sales teams closing contracts", "Logistics and distribution contracts"],
    solutions: ["workflow-automation"],
    industries: ["financial-services", "transport-logistics"],
  },
];

// Edit status, launch quarter and app URLs here. Pulse and Talks follow the website spec; the rest
// use WhatsApp until their own signup and demo links exist.
const APP = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.marichilabs.com";
const meta: Record<string, { status?: ProductStatus; launch?: string; signup?: boolean; signupUrl?: string; demoUrl?: string; appUrl?: string }> = {
  pulse: { signupUrl: "https://app.marichipulse.com/", appUrl: "https://app.marichipulse.com/" },
  talks: { signup: true },
};

export const products: Product[] = baseProducts.map((b) => {
  const id = b.slug;
  const m = meta[id] ?? {};
  return {
    ...b,
    id,
    slug: `marichi-${id}`,
    status: m.status ?? "live",
    launch: m.launch,
    signupUrl: m.signupUrl ?? (m.signup ? `${APP}/signup?product=${id}&plan=free-trial` : undefined),
    demoUrl: m.demoUrl ?? (m.signup ? `${APP}/demo/${id}` : undefined),
    appUrl: m.appUrl,
  };
});



export type Solution = {
  slug: string;
  num: string;
  title: string;
  short: string;
  intro: string;
  outcomes: string[];
  products: string[];
};

export const solutions: Solution[] = [
  {
    slug: "conversations",
    num: "01",
    title: "Conversations that convert",
    short: "Email, SMS, WhatsApp and AI voice from one wallet, turning every exchange into revenue and trust.",
    intro:
      "Customers talk to you on many channels. Marichi brings them together so every message, call and campaign is tracked and tied to revenue.",
    outcomes: ["One wallet and dashboard for four channels", "Leads from digital cards flow straight into your CRM", "AI voice handles routine calls"],
    products: ["talks", "card"],
  },
  {
    slug: "business-intelligence",
    num: "02",
    title: "Your business's sixth sense",
    short: "Live numbers from every store, truck, field visit and payment, in one view. Ask a plain-language question, get an answer.",
    intro:
      "Stores, trucks, field visits and payments all produce data. Marichi puts it in one live view and lets anyone ask questions in plain language.",
    outcomes: ["Live numbers across stores, fleet and field", "Ask questions in plain language", "One version of the truth for owners and managers"],
    products: ["pulse", "moves", "pays", "assure", "ops"],
  },
  {
    slug: "ai-copilot",
    num: "03",
    title: "A co-pilot for every decision",
    short: "AI drafts the proposal, summarises the meeting and nudges your team on who to call and where to act next.",
    intro:
      "Marichi's AI works alongside your team. It writes first drafts, summarises meetings and points people to the next best action.",
    outcomes: ["Proposals drafted in moments", "Meetings summarised automatically", "Clear nudges on who to call next"],
    products: ["grows", "ops", "card"],
  },
  {
    slug: "workflow-automation",
    num: "04",
    title: "Work that runs itself",
    short: "Workflows that dispatch, follow up, reconcile and verify on their own, so people focus on judgement.",
    intro:
      "Repetitive work such as dispatching, chasing, reconciling and verifying can run on its own. Your people spend their time on decisions that need judgement.",
    outcomes: ["Automatic dispatch and follow-up", "Payments reconciled without manual matching", "Verification built into every workflow"],
    products: ["pulse", "moves", "pays", "talks", "grows", "assure", "sign"],
  },
];

export type Industry = {
  slug: string;
  title: string;
  short: string;
  intro: string;
  challenges: string[];
  products: string[];
};

export const industries: Industry[] = [
  {
    slug: "retail-fmcg",
    title: "Retail & FMCG",
    short: "Run stores, collect payments, reach customers and audit the shelf.",
    intro:
      "From the corner shop to national chains, retail runs on thin margins and fast decisions. Marichi connects checkout, stock, payments, customer messaging and field execution.",
    challenges: ["Stock and sales scattered across stores", "Many payment methods to reconcile", "Little visibility of what happens on the shelf"],
    products: ["pulse", "pays", "talks", "grows", "assure", "card"],
  },
  {
    slug: "transport-logistics",
    title: "Transport & Logistics",
    short: "Every truck, load, border crossing and invoice on one ledger.",
    intro:
      "Cross-border freight means many parties, many documents and many places for money to leak. Marichi keeps trips, paperwork and payments together.",
    challenges: ["Paperwork and border steps tracked by hand", "Trip costs and invoices that do not match", "No single view of fleet and loads"],
    products: ["moves", "pays", "assure", "sign"],
  },
  {
    slug: "telecom-distribution",
    title: "Telecom & Distribution",
    short: "Manage field teams, channel partners and outlets at scale.",
    intro:
      "Telecom and distribution depend on large field teams and thousands of outlets. Our team has built these channels, and our products reflect that experience.",
    challenges: ["Field teams that are hard to supervise", "Outlet audits without proof", "Leads and follow-ups that slip"],
    products: ["grows", "ops", "assure", "talks", "pays", "card"],
  },
  {
    slug: "financial-services",
    title: "Financial Services",
    short: "Payments, communications and verified signatures in one stack.",
    intro:
      "Financial businesses need to move money, talk to customers and get agreements signed with proof. Marichi provides those building blocks in one connected suite.",
    challenges: ["Many rails to integrate and reconcile", "Contracts that need verified signatures", "Customer communication across channels"],
    products: ["pays", "talks", "sign", "ops", "assure"],
  },
];

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  metric: string;
  metricLabel: string;
  summary: string;
  sections: { heading: string; body: string }[];
  products: string[];
  industries: string[];
  lead: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "mama-stops-zero-to-2m-monthly-revenue",
    title: "Mama Stops: from zero to $2M a month in under 12 months",
    client: "Mama Stops",
    metric: "$2M",
    metricLabel: "monthly revenue in under 12 months",
    summary: "How Hanumant Shukla grew Mama Stops from nothing to $2M in monthly revenue in under a year.",
    sections: [
      { heading: "The result", body: "Mama Stops grew from zero to $2M in monthly revenue in under 12 months." },
      { heading: "Who led it", body: "Hanumant Shukla, now Chief Executive Officer of Marichi Labs, led Mama Stops as its CEO. He brings more than 25 years of experience in channel, sales and key accounts." },
      { heading: "What it means for Marichi", body: "The playbooks behind that growth, from channel building to sales execution, shape how Marichi products such as MarichiGrows, MarichiOps and MarichiPulse are designed." },
    ],
    products: ["grows", "ops", "pulse"],
    industries: ["retail-fmcg", "telecom-distribution"],
    lead: "Hanumant Shukla",
  },
  {
    slug: "urban-vyapari-33000-retailers",
    title: "Urban Vyapari: 33,000 retailers on one platform",
    client: "Urban Vyapari",
    metric: "33,000",
    metricLabel: "retailers onboarded onto one platform",
    summary: "How Urban Vyapari was built from zero to 33,000 retailers on a single platform.",
    sections: [
      { heading: "The result", body: "Urban Vyapari onboarded 33,000 retailers onto one platform, built from zero." },
      { heading: "Who led it", body: "Rituraj, now Chief Product Officer of Marichi Labs, co-founded Urban Vyapari and served as its CTO." },
      { heading: "What it means for Marichi", body: "Serving tens of thousands of retailers taught us what small shops need from software. That learning goes straight into MarichiPulse, MarichiPays and MarichiTalks." },
    ],
    products: ["pulse", "pays", "talks"],
    industries: ["retail-fmcg"],
    lead: "Rituraj",
  },
  {
    slug: "airtel-africa-channel-building",
    title: "Airtel in Africa: 25 years of channel building",
    client: "Telecom and distribution",
    metric: "25+",
    metricLabel: "years building channels across telecom and distribution",
    summary: "Decades of building telecom and distribution channels, including pioneering Airtel in Africa.",
    sections: [
      { heading: "The experience", body: "Our CEO has spent more than 25 years building channels across telecom and distribution and pioneered Airtel in Africa." },
      { heading: "What it means for Marichi", body: "Field force tracking, outlet audits and CRM are not theory for us. MarichiGrows, MarichiOps and MarichiAssure are built from lessons learned running channels at national scale." },
    ],
    products: ["grows", "ops", "assure"],
    industries: ["telecom-distribution"],
    lead: "Hanumant Shukla",
  },
  {
    slug: "swib-visitflow-guardly-products-shipped",
    title: "Swib, VisitFlow and Guardly: shipping products to market",
    client: "Swib, VisitFlow, Guardly",
    metric: "4,500+",
    metricLabel: "users on Swib alone",
    summary: "How Yogesh Vashisht took more than 10 products from code to customers.",
    sections: [
      { heading: "The result", body: "More than 10 products are live in the market under our engineering lead, including Swib (4,500+ users), VisitFlow and Guardly." },
      { heading: "Who led it", body: "Yogesh Vashisht, Chief of Engineering at Marichi Labs, is a full-stack builder who has taken products from code to customers." },
      { heading: "What it means for Marichi", body: "The same engineering approach, shipping quickly and supporting real users, powers the Marichi suite." },
    ],
    products: ["card", "assure", "sign"],
    industries: ["retail-fmcg", "financial-services"],
    lead: "Yogesh Vashisht",
  },
];

export const team = [
  {
    name: "Shouvik Bhattacharyya",
    role: "Founder, Texas AI Ventures",
    initials: "SB",
    bio: "Founder of multiple ventures; 19+ companies funded, including Marichi. Deep tech, go-to-market and strategy. IIT Kharagpur and MIT Sloan.",
  },
  {
    name: "Hanumant Shukla",
    role: "Chief Executive Officer",
    initials: "HS",
    bio: "Ex-CEO of Mama Stops: grew it from zero to $2M monthly revenue in under 12 months. 25+ years in channel, sales and key accounts; pioneered Airtel in Africa.",
  },
  {
    name: "Rituraj",
    role: "Chief Product Officer",
    initials: "R",
    bio: "Product and growth leader. Co-founder and CTO, Urban Vyapari, scaled to 33,000 retailers. Builds what solves; scales what compounds.",
  },
  {
    name: "Yogesh Vashisht",
    role: "Chief of Engineering",
    initials: "YV",
    bio: "Full-stack builder with 10+ products live in the market, from code to customers, including Swib (4,500+ users), VisitFlow and Guardly.",
  },
];

export const stats = [
  { value: "$2M", label: "a month in revenue at Mama Stops, from zero in under 12 months" },
  { value: "33,000", label: "retailers onboarded onto one platform, built from zero" },
  { value: "19+", label: "companies funded through Texas AI Ventures" },
  { value: "25+", label: "years building channels across telecom and distribution" },
];

export const engagementSteps = [
  { time: "2–4 weeks", title: "Discover", text: "Map journeys, data and the moments that matter." },
  { time: "2–4 weeks", title: "Design", text: "Pick the right Marichi products; build the ROI case." },
  { time: "8–16 weeks", title: "Build", text: "Configure, integrate and go live, fast." },
  { time: "Ongoing", title: "Scale", text: "Roll out, measure, optimise and hand over." },
];

export const getProduct = (key: string) => products.find((p) => p.id === key || p.slug === key);
export const getSolution = (slug: string) => solutions.find((s) => s.slug === slug);
export const getIndustry = (slug: string) => industries.find((i) => i.slug === slug);
export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
export const productsBySlugs = (slugs: string[]) => slugs.map((s) => getProduct(s)).filter((p): p is Product => !!p);
export const fullName = (p: Product) => `Marichi${p.name}`;
