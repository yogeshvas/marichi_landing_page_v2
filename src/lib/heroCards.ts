// Hero feature cards for each product (Pulse has its own component with logos). Each card is one
// small looping animation. The wording is drafted from the product descriptions: review it.

export type HeroCard =
  | { kind: "connect"; title: string; tag: string; center: string; items: string[]; note: string }
  | { kind: "flow"; title: string; tag: string; left: string; mid: string; right: string; note: string }
  | { kind: "chat"; title: string; tag: string; msgs: { from: "us" | "them"; text: string }[] }
  | { kind: "checks"; title: string; tag: string; items: string[] }
  | { kind: "bars"; title: string; tag: string; bars: [string, number][] }
  | { kind: "route"; title: string; tag: string; points: [string, string, string]; note: string }
  | { kind: "pipeline"; title: string; tag: string; stages: [string, string, string]; card: string }
  | { kind: "action"; title: string; tag: string; button: string; result: string; chips: string[] }
  | { kind: "photos"; title: string; tag: string; note: string }
  | { kind: "sign"; title: string; tag: string; seal: string; note: string };

export const heroLines: Record<string, string> = {
  pulse: "Connects to Tally, Zoho, Odoo and other accounting software. Open an online store in one click. Accept payments on behalf of your retailers.",
  talks: "Plugs into your Sales CRM, Service CRM and other business software. Message customers on WhatsApp, SMS, email and voice from one wallet.",
  pays: "One gateway for mobile money, cards, bank transfers and wallets. Every payment is matched to its order, and payouts go out from the same account.",
  moves: "Run every truck, load and border crossing on one ledger. Attach border paperwork to the trip, track costs and invoice from the trip record.",
  grows: "Track your field team's visits, automate follow-ups and let AI draft proposals from your visit notes.",
  ops: "Capture leads from cards, calls, campaigns and field visits in one pipeline. AI nudges tell your team who to call next.",
  card: "A digital card that turns every scan into a lead in your CRM. Share by tap or QR code and follow up on WhatsApp.",
  assure: "Run geo-tagged field audits with AI photo checks. Spot edited or reused photos before they reach your report.",
  sign: "Send agreements, verify who signs and keep a tamper-proof record, with a full audit trail.",
};

export const heroCards: Record<string, HeroCard[]> = {
  talks: [
    { kind: "connect", title: "Plugs into your CRM", tag: "Integrations", center: "Talks", items: ["Sales CRM", "Service CRM", "Helpdesk", "+ more"], note: "Sales CRM, Service CRM and other business software." },
    { kind: "chat", title: "One inbox, every channel", tag: "Messaging", msgs: [{ from: "us", text: "Order confirmed ✓" }, { from: "them", text: "Thanks! When will it arrive?" }, { from: "us", text: "Tomorrow, by 3 pm." }] },
    { kind: "flow", title: "One wallet for every channel", tag: "Wallet", left: "Top up", mid: "Talks wallet", right: "4 channels", note: "WhatsApp, SMS, email and voice. Pay once, spend on any." },
  ],
  pays: [
    { kind: "connect", title: "Every way to pay", tag: "Accept", center: "Pays", items: ["Mobile money", "Cards", "Bank", "Wallets"], note: "One integration for 15+ payment rails." },
    { kind: "flow", title: "Matched to the right order", tag: "Reconcile", left: "Payment in", mid: "Pays matches", right: "Order paid ✓", note: "Only the exceptions need your attention." },
    { kind: "checks", title: "Payouts from the same account", tag: "Payouts", items: ["Supplier paid", "Staff paid", "Refund sent"] },
  ],
  moves: [
    { kind: "route", title: "Every trip, end to end", tag: "Tracking", points: ["Lusaka", "Border", "Dar es Salaam"], note: "At border · docs attached" },
    { kind: "checks", title: "Border paperwork attached", tag: "Documents", items: ["Customs declaration", "Transit permit", "Insurance"] },
    { kind: "flow", title: "From trip to invoice", tag: "Invoicing", left: "Trip done", mid: "Moves", right: "Invoice sent ✓", note: "Costs recorded against every trip." },
  ],
  grows: [
    { kind: "checks", title: "Visits, verified", tag: "Field team", items: ["Location confirmed", "Photo captured", "Notes saved"] },
    { kind: "chat", title: "AI drafts the proposal", tag: "AI", msgs: [{ from: "them", text: "Outlet 14 wants weekly delivery." }, { from: "us", text: "Proposal drafted. Review and send." }] },
    { kind: "bars", title: "Team activity", tag: "Managers", bars: [["Amina", 84], ["Joseph", 66], ["Grace", 52]] },
  ],
  ops: [
    { kind: "connect", title: "Leads from everywhere", tag: "Capture", center: "Ops", items: ["Card scans", "Calls", "Campaigns", "Field visits"], note: "Works with Card, Grows and Talks." },
    { kind: "pipeline", title: "Every deal moves forward", tag: "Pipeline", stages: ["New", "Qualified", "Won"], card: "Amina Traders" },
    { kind: "chat", title: "AI tells you who to call", tag: "Nudge", msgs: [{ from: "us", text: "Call Amina today." }, { from: "us", text: "She opened the proposal twice." }] },
  ],
  card: [
    { kind: "action", title: "A scan becomes a lead", tag: "QR", button: "Scan card", result: "New lead", chips: ["Name", "Phone", "Source: card"] },
    { kind: "flow", title: "Straight into your CRM", tag: "Sync", left: "Scan", mid: "MarichiOps", right: "New lead ✓", note: "No typing, no lost contacts." },
    { kind: "chat", title: "Follow up on WhatsApp", tag: "Follow-up", msgs: [{ from: "us", text: "Great meeting you today!" }, { from: "them", text: "Thanks, saved." }] },
  ],
  assure: [
    { kind: "photos", title: "AI checks every photo", tag: "Verify", note: "1 photo flagged · place and time recorded" },
    { kind: "checks", title: "Geo-tagged audits", tag: "Audit", items: ["Location confirmed", "Time recorded", "Photo captured"] },
    { kind: "bars", title: "Compliance by store", tag: "Reports", bars: [["Outlet 12", 94], ["Outlet 14", 71], ["Outlet 15", 88]] },
  ],
  sign: [
    { kind: "sign", title: "Sign on any phone", tag: "Sign", seal: "Sealed", note: "Tamper-proof, with a full audit trail." },
    { kind: "checks", title: "Signers are verified first", tag: "Verify", items: ["Phone confirmed", "ID confirmed", "Signature captured"] },
    { kind: "flow", title: "From send to sealed", tag: "Workflow", left: "Send", mid: "Sign", right: "Sealed ✓", note: "Download the final copy any time." },
  ],
};
