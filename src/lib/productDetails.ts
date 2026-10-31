// Long-form content for each product page. Review before publishing: written from the pitch deck's
// one-line product descriptions, so confirm every capability matches what ships today.

export type MockKind = "dashboard" | "chat" | "ledger" | "payments" | "pipeline" | "card" | "audit" | "sign";

export type ProductDetail = {
  headline: string;
  accent: string;
  problem: string;
  mock: MockKind;
  modules: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  useCases: { who: string; text: string }[];
  faqs: { q: string; a: string }[];
};

export const productDetails: Record<string, ProductDetail> = {
  pulse: {
    headline: "Know exactly how every store is doing,",
    accent: "before you close the till.",
    problem: "Most shops run on a till, a notebook and a spreadsheet. Stock counts drift, books are weeks behind and payroll is a monthly scramble. By the time you see a problem, the money is already gone.",
    mock: "dashboard",
    modules: [
      { title: "Point of sale", text: "A fast checkout screen for cash, mobile money and cards, with receipts and returns handled in a few taps." },
      { title: "Inventory control", text: "Stock updates on every sale. See what is low, what is moving and what is sitting, across every branch." },
      { title: "Billing and invoicing", text: "Issue invoices for credit customers and wholesale orders, and track what is still owed." },
      { title: "Accounting", text: "Sales, expenses and payments post to your books as they happen, so month-end is a review, not a rebuild." },
      { title: "Payroll", text: "Keep staff records, run payroll on schedule and keep a clear history of every payment." },
      { title: "Ask your numbers", text: "Type a plain-language question such as which product sold least last week and get an answer from live data." },
      { title: "Accounting integrations", text: "Connects with Tally, Zoho, Odoo and other accounting software, so your books stay in step with your sales." },
      { title: "Online store", text: "Create an online store with one click, using the products and prices you already keep in Pulse." },
      { title: "Retailer payments", text: "Accept payments on behalf of your retailers and settle them to each retailer automatically." },
    ],
    steps: [
      { title: "Set up your stores", text: "Add branches, products and staff. We help you import what you already have." },
      { title: "Start selling", text: "Cashiers use the POS; stock, sales and payments record themselves." },
      { title: "Watch the business", text: "Owners follow every store from one dashboard, from any phone." },
    ],
    useCases: [
      { who: "Single-shop owners", text: "Replace the notebook with a till that also keeps your stock and books." },
      { who: "Multi-branch retailers", text: "Compare branches, move stock between them and stop shrinkage early." },
      { who: "Wholesalers", text: "Manage credit customers and large orders alongside walk-in sales." },
    ],
    faqs: [
      { q: "What is MarichiPulse?", a: "MarichiPulse is a retail operating system that combines point of sale, inventory, accounting and payroll for shops and multi-store businesses." },
      { q: "Can I manage more than one store?", a: "Yes. Pulse is built for multi-store businesses, with stock, sales and staff visible per branch and in total." },
      { q: "Does it connect to payments?", a: "Pulse works with MarichiPays so card, bank and mobile money payments reconcile against your sales automatically." },
      { q: "How do I get started?", a: "Message us on WhatsApp. We will ask a few questions about your stores and set up a walkthrough." },
    ],
  },
  moves: {
    headline: "Every truck, load and border crossing,",
    accent: "on one ledger.",
    problem: "Freight runs on phone calls, WhatsApp groups and paper at the border. Costs are guessed, invoices go out late and nobody can say what a trip really earned.",
    mock: "ledger",
    modules: [
      { title: "Fleet management", text: "Keep every vehicle, driver and document in one register with reminders before anything expires." },
      { title: "Load and trip planning", text: "Assign loads to trucks, track each trip from pickup to delivery and keep customers informed." },
      { title: "Border and documents", text: "Attach customs and crossing paperwork to the trip it belongs to, so nothing is chased by phone." },
      { title: "Trip costing", text: "Record fuel, tolls, allowances and repairs against each trip to see real profit per load." },
      { title: "One-ledger invoicing", text: "Invoice from the trip record and watch payments land against the right invoice." },
      { title: "Customer visibility", text: "Share status with customers so they stop calling to ask where the truck is." },
    ],
    steps: [
      { title: "Load your fleet", text: "Add trucks, drivers and customers." },
      { title: "Run trips in Moves", text: "Plan, dispatch and track every load, with border steps recorded as they happen." },
      { title: "Invoice and reconcile", text: "Bill from the trip and match payments on the same ledger." },
    ],
    useCases: [
      { who: "Cross-border haulers", text: "Keep crossings, paperwork and costs tied to each trip." },
      { who: "Fleet owners", text: "See which trucks and routes actually make money." },
      { who: "Logistics managers", text: "Replace spreadsheets and group chats with one source of truth." },
    ],
    faqs: [
      { q: "What is MarichiMoves?", a: "MarichiMoves is a transport ERP that manages trucks, loads, border documentation and invoicing on a single ledger." },
      { q: "Is it only for cross-border transport?", a: "It is built with cross-border freight in mind, but works for domestic fleets as well." },
      { q: "Can customers see their shipments?", a: "Yes, you can share trip status with customers so they do not need to call for updates." },
      { q: "How do I get a demo?", a: "Message us on WhatsApp and tell us about your fleet and routes." },
    ],
  },
  pays: {
    headline: "Accept, send and reconcile every payment,",
    accent: "through one gateway.",
    problem: "Customers pay by mobile money, card, bank transfer and cash, and each channel has its own portal and report. Someone ends up matching them by hand at the end of the week.",
    mock: "payments",
    modules: [
      { title: "15+ payment rails", text: "Offer your customers the methods they already use, through a single integration." },
      { title: "Collections", text: "Take payments on invoices, orders and payment links, in person or online." },
      { title: "Payouts", text: "Pay suppliers, staff and partners in bulk or one at a time from the same account." },
      { title: "Automatic reconciliation", text: "Each payment is matched to the order or invoice it settles, with exceptions flagged for review." },
      { title: "Unified reporting", text: "One report across every rail instead of a different export from each provider." },
      { title: "Works with the suite", text: "Connects to Pulse, Moves and Ops so money and records stay in sync." },
    ],
    steps: [
      { title: "Connect once", text: "Integrate with MarichiPays instead of each payment provider." },
      { title: "Collect and pay out", text: "Receive and send money across the rails you choose." },
      { title: "Reconcile automatically", text: "Review a clean report with only the exceptions needing attention." },
    ],
    useCases: [
      { who: "Retailers", text: "Accept every payment type at the till and reconcile at close." },
      { who: "Marketplaces and platforms", text: "Collect from buyers and pay out to many sellers." },
      { who: "Finance teams", text: "End manual matching across providers." },
    ],
    faqs: [
      { q: "What is MarichiPays?", a: "MarichiPays is a payment gateway to accept, send and reconcile payments across more than 15 payment rails." },
      { q: "Which payment methods are supported?", a: "More than 15 rails across mobile money, cards and bank channels. Message us to confirm the ones you need in your market." },
      { q: "Can I use it without the rest of the suite?", a: "Yes. Pays works on its own and connects to the other products when you are ready." },
      { q: "How long does integration take?", a: "It depends on your setup. Message us on WhatsApp and we will scope it with you." },
    ],
  },
  talks: {
    headline: "Email, SMS, WhatsApp and AI voice.",
    accent: "One wallet. One inbox.",
    problem: "Customer messages are spread across tools. Campaigns go out from one, replies land in another, and nobody knows which conversation led to a sale.",
    mock: "chat",
    modules: [
      { title: "Single wallet", text: "Top up once and spend across email, SMS, WhatsApp and voice instead of managing four balances." },
      { title: "WhatsApp messaging", text: "Reach customers on the channel they actually read, with templates and follow-ups." },
      { title: "SMS and email", text: "Send reminders, receipts and campaigns to the right segments." },
      { title: "AI voice", text: "Automated calls handle routine conversations such as reminders and confirmations." },
      { title: "Shared dashboard", text: "See sends, replies and results for every channel in one place." },
      { title: "CRM connection", text: "Conversations attach to the customer record in MarichiOps." },
      { title: "CRM integrations", text: "Plugs into your Sales CRM, Service CRM and other business software, so every message lands on the right customer record." },
    ],
    steps: [
      { title: "Top up the wallet", text: "Fund one balance for all channels." },
      { title: "Build your audience", text: "Import customers or sync them from Pulse and Ops." },
      { title: "Send and follow up", text: "Launch campaigns and automated follow-ups, then read the results." },
    ],
    useCases: [
      { who: "Retail brands", text: "Announce offers and win back lapsed customers." },
      { who: "Sales teams", text: "Follow up every lead on the channel they respond to." },
      { who: "Lenders and service firms", text: "Send reminders and confirmations automatically." },
    ],
    faqs: [
      { q: "What is MarichiTalks?", a: "MarichiTalks is a communications platform for email, SMS, WhatsApp and AI voice, run from one wallet and one dashboard." },
      { q: "Why a single wallet?", a: "It removes the need to fund and track a separate balance for every channel." },
      { q: "What does the AI voice do?", a: "It places automated calls for routine tasks such as reminders and confirmations." },
      { q: "Can I try it?", a: "Message us on WhatsApp and we will set up a pilot." },
    ],
  },
  grows: {
    headline: "Know where your field team is,",
    accent: "and what happens after every visit.",
    problem: "Field teams are hard to see. Visits are reported from memory, follow-ups slip and proposals take days to write, so deals cool off while everyone is busy.",
    mock: "pipeline",
    modules: [
      { title: "Field force tracking", text: "See visits as they happen, with routes and check-ins your managers can trust." },
      { title: "Visit planning", text: "Give each rep a route and a list of accounts to cover." },
      { title: "Automated follow-ups", text: "A follow-up is scheduled after every visit, so no lead is left waiting." },
      { title: "AI-written proposals", text: "Draft a proposal from the visit notes and refine it before sending." },
      { title: "Meeting summaries", text: "AI turns notes into a short summary and next steps." },
      { title: "Manager view", text: "See activity and results by rep, route and region." },
    ],
    steps: [
      { title: "Set territories", text: "Assign accounts and routes to your reps." },
      { title: "Visit and capture", text: "Reps check in, log the visit and capture what was agreed." },
      { title: "Follow up and close", text: "AI drafts the proposal and reminds the team what to do next." },
    ],
    useCases: [
      { who: "Distribution and FMCG teams", text: "Cover outlets consistently and prove the visit happened." },
      { who: "B2B sales teams", text: "Move from meeting to proposal in minutes." },
      { who: "Regional sales managers", text: "Coach from real activity data." },
    ],
    faqs: [
      { q: "What is MarichiGrows?", a: "MarichiGrows is a field sales platform with team tracking, automated follow-ups and AI-written proposals." },
      { q: "Does it replace my CRM?", a: "It works with MarichiOps, our sales CRM, so field activity flows into your pipeline." },
      { q: "How does the AI help?", a: "It drafts proposals and meeting summaries and suggests who to follow up with." },
      { q: "How do I start?", a: "Message us on WhatsApp with your team size and we will arrange a demo." },
    ],
  },
  ops: {
    headline: "Every lead, deal and follow-up,",
    accent: "moving forward.",
    problem: "Leads live in notebooks, inboxes and phones. Deals stall because nobody owns the next step and managers only learn about losses after the fact.",
    mock: "pipeline",
    modules: [
      { title: "Lead capture", text: "Bring leads in from cards, campaigns, calls and field visits without retyping." },
      { title: "Pipeline", text: "Drag deals through stages and see value and status at a glance." },
      { title: "Tasks and reminders", text: "Every deal has a next step with an owner and a date." },
      { title: "AI nudges", text: "Prompts on who to call and where to act next." },
      { title: "Conversation history", text: "See every call, message and meeting on the customer record." },
      { title: "Connected suite", text: "Works with Card, Grows and Talks out of the box." },
    ],
    steps: [
      { title: "Import or capture leads", text: "Start with your existing contacts and new scans." },
      { title: "Work the pipeline", text: "Move deals forward with clear next steps." },
      { title: "Review and improve", text: "Spot stalled deals and coach the team." },
    ],
    useCases: [
      { who: "Sales teams", text: "Stop losing leads between conversations." },
      { who: "Distributors", text: "Track key accounts and orders in one pipeline." },
      { who: "Professional services", text: "Manage proposals and renewals." },
    ],
    faqs: [
      { q: "What is MarichiOps?", a: "MarichiOps is a sales CRM that keeps every lead, deal and pipeline moving." },
      { q: "How is it different from Grows?", a: "Grows manages field visits; Ops manages the pipeline. They are designed to work together." },
      { q: "Can I import contacts?", a: "Yes, you can start from your existing contact lists." },
      { q: "How do I try it?", a: "Message us on WhatsApp and we will show you a pipeline built for your sales process." },
    ],
  },
  card: {
    headline: "Replace the paper card.",
    accent: "Turn every scan into a lead.",
    problem: "Business cards get lost and details get typed in wrong, or never at all. Most of the people you meet are forgotten by Monday.",
    mock: "card",
    modules: [
      { title: "Digital card", text: "Share your name, role, links and offers from a tap or a QR code." },
      { title: "Scan to lead", text: "Every scan or form fill creates a lead record straight away." },
      { title: "CRM sync", text: "Leads go to MarichiOps with the source recorded." },
      { title: "Always current", text: "Update your details once and every shared card reflects it." },
      { title: "Team cards", text: "Give every team member a consistent branded card." },
      { title: "Follow-up ready", text: "Trigger a WhatsApp or email follow-up the moment someone connects." },
    ],
    steps: [
      { title: "Create your card", text: "Add your details, links and brand." },
      { title: "Share it anywhere", text: "Use the QR code, a link or a tap." },
      { title: "Follow up", text: "New leads appear in your CRM, ready to contact." },
    ],
    useCases: [
      { who: "Sales representatives", text: "Never lose a contact after a meeting." },
      { who: "Event teams", text: "Capture visitors at a stand without clipboards." },
      { who: "Small businesses", text: "Look professional with no printing cost." },
    ],
    faqs: [
      { q: "What is MarichiCard?", a: "MarichiCard is a smart digital visiting card where every scan becomes a lead in your CRM." },
      { q: "Do people need an app to scan it?", a: "No. A phone camera is enough to open your card." },
      { q: "Where do the leads go?", a: "Into MarichiOps, our sales CRM." },
      { q: "Can my whole team use it?", a: "Yes, each team member can have their own card." },
    ],
  },
  assure: {
    headline: "Proof that the work happened,",
    accent: "and the photo is real.",
    problem: "Field audits depend on photos and reports from the field. Photos get reused, locations get faked and by the time you notice, the decision has already been made.",
    mock: "audit",
    modules: [
      { title: "Geo-tagged audits", text: "Each audit is stamped with where and when it was completed." },
      { title: "AI tamper detection", text: "Every photo is checked for editing and for being reused from an earlier audit." },
      { title: "Custom checklists", text: "Design the audit form for stores, vehicles, outlets or sites." },
      { title: "Photo evidence", text: "Capture required photos inside the audit, not from the gallery." },
      { title: "Review and approve", text: "Managers review flagged items first and approve the rest quickly." },
      { title: "Reports", text: "Compare results across locations, routes and auditors." },
    ],
    steps: [
      { title: "Build the checklist", text: "Define what must be checked and photographed." },
      { title: "Audit in the field", text: "Auditors complete it on their phones with location captured." },
      { title: "Verify and report", text: "AI flags suspicious photos and managers review results." },
    ],
    useCases: [
      { who: "FMCG and retail", text: "Verify shelf, display and stock compliance." },
      { who: "Distribution", text: "Confirm outlet visits really happened." },
      { who: "Logistics", text: "Inspect vehicles and delivery points." },
    ],
    faqs: [
      { q: "What is MarichiAssure?", a: "MarichiAssure runs geo-tagged field audits with AI tamper detection on every photo." },
      { q: "What does tamper detection check?", a: "It looks for signs that a photo was edited or reused." },
      { q: "Can I design my own audit form?", a: "Yes, checklists are configurable for your process." },
      { q: "How do I get started?", a: "Message us on WhatsApp and we will help you set up a first audit." },
    ],
  },
  sign: {
    headline: "Sign anything.",
    accent: "Prove everything.",
    problem: "Printing, signing, scanning and emailing slows every deal. And when a dispute comes, a scanned PDF is hard to defend.",
    mock: "sign",
    modules: [
      { title: "Send for signature", text: "Upload a document, add signers and send it in minutes." },
      { title: "Signer verification", text: "Confirm that the person signing is who they say they are." },
      { title: "Tamper-proof record", text: "Signed documents are sealed so any change is detectable." },
      { title: "Audit trail", text: "A timeline of who opened, viewed and signed, and when." },
      { title: "Sign on any phone", text: "Signers do not need to print, scan or install anything." },
      { title: "Templates", text: "Reuse common agreements to send faster." },
    ],
    steps: [
      { title: "Upload and add signers", text: "Place signature fields and send." },
      { title: "Signers verify and sign", text: "They sign from any device." },
      { title: "Download the sealed copy", text: "Keep the final document with its full audit trail." },
    ],
    useCases: [
      { who: "Sales teams", text: "Close contracts the same day." },
      { who: "Financial services", text: "Collect signed agreements with proof." },
      { who: "Logistics firms", text: "Sign carrier and customer agreements remotely." },
    ],
    faqs: [
      { q: "What is MarichiSign?", a: "MarichiSign provides verified, tamper-proof e-signatures with a full audit trail." },
      { q: "Do signers need an account?", a: "No, they can sign from a link on their phone." },
      { q: "How do I know a document has not been changed?", a: "Signed documents are sealed, so edits after signing are detectable." },
      { q: "Can I use my own templates?", a: "Yes, you can save and reuse your agreements." },
    ],
  },
};
