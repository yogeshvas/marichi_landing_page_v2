// Search terms per product. `core` terms go in page metadata and structured data. `uses` are the
// longer, specific searches; they are shown on the product page as "Popular ways teams use it" so
// the words appear in real, readable content rather than only in hidden tags.
// Check every compliance claim here (ZRA, eTIMS, GST, NAPSA, PAYE, Aadhaar) is true before launch.

export const companyKeywords = [
  "Marichi Labs", "Marichi Solutions", "Marichi Solutions Limited", "Marichi business suite", "business software Zambia", "AI business software Africa",
  "all-in-one business software", "SME software suite", "business automation platform", "AI-native business tools", "digital transformation Zambia",
  "software company Lusaka", "enterprise software Africa", "ERP and CRM suite", "all-in-one software for small businesses in Zambia",
  "AI business automation for African companies", "connected business software for retail and logistics", "custom software development Lusaka",
];

export const productKeywords: Record<string, { core: string[]; uses: string[] }> = {
  pulse: {
    core: ["MarichiPulse", "POS system Zambia", "point of sale software", "retail POS", "cloud POS", "inventory management software", "stock management system", "accounting software Zambia", "payroll software Zambia", "retail ERP", "billing software"],
    uses: ["ZRA Smart Invoice POS", "ZRA compliant POS system", "ZRA VSDC integration", "Smart invoice software Zambia", "Fiscal invoicing software", "eTIMS POS Kenya", "GST billing software India", "Best POS system for shops in Zambia", "POS with inventory and accounting", "Multi-store inventory management software", "POS software for supermarkets", "POS for hardware stores", "POS for pharmacies", "Restaurant POS Lusaka", "Stock transfer between branches software", "Payroll software with NAPSA and PAYE", "Sage integration POS"],
  },
  moves: {
    core: ["MarichiMoves", "transport management system", "TMS software", "fleet management software Zambia", "logistics ERP", "trucking software", "transport ERP Africa", "fleet tracking software", "freight management software"],
    uses: ["Transport management software for trucking companies", "Cross-border logistics software Africa", "Fleet management with fuel tracking", "Truck trip management software", "Load and dispatch management system", "Border clearance tracking software", "Haulage company software Zambia", "Transport invoicing software", "SADC logistics software"],
  },
  pays: {
    core: ["MarichiPays", "payment gateway Zambia", "online payment gateway Africa", "mobile money payment gateway", "payment collection platform", "payment reconciliation software", "payouts API", "multi-rail payment gateway"],
    uses: ["Accept MTN MoMo and Airtel Money payments", "Mobile money API Zambia", "Accept card and mobile money payments online", "Bulk payment disbursement Zambia", "Automated payment reconciliation software", "Payment gateway for small businesses in Zambia", "WhatsApp payment collection", "Recurring payment collection Africa"],
  },
  talks: {
    core: ["MarichiTalks", "WhatsApp Business API Zambia", "bulk SMS Zambia", "WhatsApp automation", "WhatsApp chatbot", "AI voice calling", "AI calling agent", "omnichannel communication platform", "bulk email platform", "customer engagement platform"],
    uses: ["WhatsApp Business API provider in Zambia", "Bulk SMS service Lusaka", "WhatsApp chatbot for banks", "WhatsApp automation for microfinance", "AI voice bot for loan collections", "Automated payment reminders via WhatsApp", "SMS and WhatsApp from one wallet", "WhatsApp customer support automation", "Conversational AI for financial services Africa"],
  },
  grows: {
    core: ["MarichiGrows", "field force management software", "sales force automation", "field sales tracking app", "employee GPS tracking app", "field visit tracking", "sales rep tracking software", "SFA software Africa"],
    uses: ["Field sales tracking app with GPS", "Attendance and visit tracking for sales teams", "Beat planning software", "Automated follow-up for field sales", "AI proposal generator for sales teams", "Field force app for FMCG distributors", "Distributor sales management software Zambia", "Track sales rep visits in real time"],
  },
  ops: {
    core: ["MarichiOps", "CRM software Zambia", "sales CRM", "lead management software", "pipeline management software", "deal tracking software", "CRM for small business", "B2B CRM"],
    uses: ["Simple CRM for small businesses in Africa", "Sales pipeline tracking software", "Lead management with WhatsApp integration", "CRM for real estate Zambia", "CRM for insurance agents", "Affordable CRM for SMEs", "AI-powered sales CRM", "CRM with automated follow-ups"],
  },
  card: {
    core: ["MarichiCard", "digital business card", "digital visiting card", "NFC business card", "QR code business card", "smart business card", "electronic business card", "virtual business card"],
    uses: ["NFC business card Zambia", "Digital visiting card India", "Digital business card with CRM integration", "QR code business card for sales teams", "Contactless business card for events", "Digital business card that captures leads", "Best digital business card for companies"],
  },
  assure: {
    core: ["MarichiAssure", "field audit app", "retail audit software", "merchandising audit app", "store audit software", "inspection app", "geo-tagged photo app", "photo verification software"],
    uses: ["Geo-tagged photo audit app", "AI photo tamper detection", "Retail execution audit software", "Outlet audit app for FMCG", "Site inspection app with GPS", "Field verification app for banks", "KYC field verification app", "Branding and signage audit software", "Compliance audit app for distributors"],
  },
  sign: {
    core: ["MarichiSign", "e-signature software", "electronic signature", "digital signature software", "online document signing", "e-sign platform", "DocuSign alternative"],
    uses: ["E-signature software Zambia", "Legally binding electronic signature Africa", "Tamper-proof digital signature", "E-signature for HR documents", "Contract signing software for SMEs", "Affordable DocuSign alternative", "Aadhaar e-sign India", "E-signature with audit trail"],
  },
};

// Blog and cross-product themes
export const topicKeywords = [
  "WhatsApp payroll loans", "Loan collections automation", "Microfinance software Zambia", "WhatsApp banking Zambia", "ERP for distributors Zambia", "Forecourt automation software",
  "Fuel station management system Zambia", "Warranty and claims management software", "HRMS Zambia", "ZRA compliance software", "Digital lending platform Africa", "Offshore development centre India", "Nano GCC for startups",
];

export const keywordsFor = (id: string) => {
  const k = productKeywords[id];
  return k ? [...k.core, ...k.uses] : [];
};
