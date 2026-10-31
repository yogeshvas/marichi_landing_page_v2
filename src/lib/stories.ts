// Each product's hero is a short animated story: a few steps, each showing one scene.
// The numbers and names in the scenes are illustrative examples, not customer data.

export type Scene =
  | { kind: "bill"; title: string; rows: [string, string][]; totalLabel: string; total: string; stamp: string }
  | { kind: "bars"; title: string; kpis?: [string, string][]; bars: { label: string; from: number; to: number; warn?: boolean }[]; alert?: string }
  | { kind: "flow"; from: string[]; hub: string; to: string[]; note?: string }
  | { kind: "chat"; title: string; contact?: string; msgs: { from: "them" | "us"; text: string; card?: { title: string; lines: string[]; button?: string } }[]; chips?: string[] }
  | { kind: "checks"; title: string; items: { label: string; state: "ok" | "warn"; tag?: string }[] }
  | { kind: "route"; title: string; points: string[]; note: string }
  | { kind: "pipeline"; stages: string[]; card: string; note: string }
  | { kind: "sign"; doc: string; seal: string; lines: string[] }
  | { kind: "photos"; title: string; flagged: number; tiles: number };

export type Step = { title: string; caption: string; scene: Scene };

export const stories: Record<string, Step[]> = {
  pulse: [
    { title: "Billing", caption: "Ring up a sale at the till. Cash, mobile money or card.", scene: { kind: "bill", title: "Bill #1042", rows: [["Rice 25 kg", "420"], ["Cooking oil 5 L", "96"], ["Sugar 2 kg", "58"]], totalLabel: "Total", total: "574", stamp: "PAID" } },
    { title: "Invoicing", caption: "Send an invoice to a credit customer on WhatsApp in a tap.", scene: { kind: "bill", title: "Invoice #318", rows: [["Wholesale order", "2,400"], ["Delivery", "60"], ["Tax", "148"]], totalLabel: "Due in 14 days", total: "2,608", stamp: "SENT" } },
    { title: "Inventory", caption: "Stock drops with every sale, across every branch.", scene: { kind: "bars", title: "Stock levels", bars: [{ label: "Rice 25 kg", from: 80, to: 62 }, { label: "Cooking oil", from: 40, to: 14, warn: true }, { label: "Sugar 2 kg", from: 70, to: 54 }], alert: "Cooking oil is running low" } },
    { title: "Suppliers", caption: "A low-stock alert becomes a purchase order to your supplier.", scene: { kind: "flow", from: ["Low stock alert"], hub: "Purchase order", to: ["Supplier"] } },
    { title: "Payroll", caption: "Pay your team on schedule and keep a clear history.", scene: { kind: "checks", title: "Payroll run", items: [{ label: "Amina · Cashier", state: "ok", tag: "Paid" }, { label: "Joseph · Stock", state: "ok", tag: "Paid" }, { label: "Grace · Manager", state: "ok", tag: "Paid" }] } },
    { title: "Reports", caption: "See every branch on one live dashboard, from any phone.", scene: { kind: "bars", title: "Sales by branch", kpis: [["Today", "Live"], ["Branches", "3"], ["Low stock", "4"]], bars: [{ label: "Lusaka", from: 0, to: 88 }, { label: "Ndola", from: 0, to: 64 }, { label: "Kitwe", from: 0, to: 47 }] } },
    { title: "Integrations", caption: "Connect to Tally, Zoho, Odoo and other accounting software.", scene: { kind: "flow", from: ["Marichi Pulse"], hub: "Sync", to: ["Tally", "Zoho", "Odoo", "Other apps"] } },
    { title: "Online store", caption: "Create an online store with one click.", scene: { kind: "checks", title: "Your online store", items: [{ label: "Products imported", state: "ok", tag: "Done" }, { label: "Store page created", state: "ok", tag: "Done" }, { label: "Store is live", state: "ok", tag: "Live" }] } },
    { title: "Retailer payments", caption: "Accept payments on behalf of your retailers and settle them automatically.", scene: { kind: "flow", from: ["Customer pays"], hub: "Pulse collects", to: ["Retailer settled"] } },
  ],
  talks: [
    { title: "One wallet", caption: "Top up once. Pay for SMS, WhatsApp, email and voice from the same balance.", scene: { kind: "flow", from: ["WhatsApp", "SMS", "Email", "Voice"], hub: "One wallet", to: ["Customers"] } },
    { title: "Send", caption: "Reach people on the channel they actually read.", scene: { kind: "chat", title: "WhatsApp", contact: "Amina Traders", msgs: [{ from: "us", text: "Hi Amina, your order is ready for pickup.", card: { title: "Order #1042", lines: ["3 items", "Total 574"], button: "View order" } }, { from: "them", text: "Great, I'm on my way!" }], chips: ["WhatsApp", "SMS", "Email", "Voice"] } },
    { title: "Follow up", caption: "Reminders go out on their own until the customer replies.", scene: { kind: "checks", title: "Follow-up plan", items: [{ label: "Reminder sent", state: "ok", tag: "Day 1" }, { label: "Second nudge scheduled", state: "ok", tag: "Day 3" }, { label: "Reply received", state: "ok", tag: "Done" }] } },
    { title: "Voice", caption: "AI calls handle routine confirmations and reminders.", scene: { kind: "chat", title: "AI voice call", contact: "Voice assistant", msgs: [{ from: "us", text: "Hello, confirming your delivery for 3 pm." }, { from: "them", text: "Yes, that works." }] } },
    { title: "Results", caption: "See delivered, read and replied for every campaign.", scene: { kind: "bars", title: "Campaign results", bars: [{ label: "Delivered", from: 0, to: 96 }, { label: "Read", from: 0, to: 71 }, { label: "Replied", from: 0, to: 38 }] } },
  ],
  pays: [
    { title: "Accept", caption: "Mobile money, cards, bank transfers and wallets through one gateway.", scene: { kind: "flow", from: ["Mobile money", "Card", "Bank", "Wallet"], hub: "MarichiPays", to: ["Your account"] } },
    { title: "Match", caption: "Each payment is matched to the order or invoice it settles.", scene: { kind: "bill", title: "Order #1042", rows: [["Paid by", "Mobile money"], ["Amount", "574"], ["Reference", "MM-88213"]], totalLabel: "Status", total: "Settled", stamp: "MATCHED" } },
    { title: "Reconcile", caption: "Only the exceptions need your attention.", scene: { kind: "checks", title: "Today's reconciliation", items: [{ label: "Mobile money · 38 payments", state: "ok", tag: "Matched" }, { label: "Card · 12 payments", state: "ok", tag: "Matched" }, { label: "Unknown reference", state: "warn", tag: "Review" }] } },
    { title: "Pay out", caption: "Pay suppliers and staff from the same account.", scene: { kind: "flow", from: ["Balance"], hub: "Payout", to: ["Supplier", "Staff"] } },
    { title: "Reports", caption: "One report across every payment method.", scene: { kind: "bars", title: "By payment method", bars: [{ label: "Mobile money", from: 0, to: 82 }, { label: "Card", from: 0, to: 46 }, { label: "Bank", from: 0, to: 29 }] } },
  ],
  moves: [
    { title: "Load", caption: "Create a load and assign the truck and driver.", scene: { kind: "bill", title: "Load 204", rows: [["From → To", "Lusaka → Dar es Salaam"], ["Truck", "ZMB 4471"], ["Driver", "Joseph M."]], totalLabel: "Status", total: "Dispatched", stamp: "ASSIGNED" } },
    { title: "Route", caption: "Follow every trip, including the border crossing.", scene: { kind: "route", title: "Trip 204", points: ["Lusaka", "Border", "Dar es Salaam"], note: "At border · docs attached" } },
    { title: "Border docs", caption: "Paperwork stays attached to the trip it belongs to.", scene: { kind: "checks", title: "Border documents", items: [{ label: "Customs declaration", state: "ok", tag: "Attached" }, { label: "Transit permit", state: "ok", tag: "Attached" }, { label: "Insurance", state: "ok", tag: "Attached" }] } },
    { title: "Costs", caption: "Fuel, tolls and allowances recorded against the trip.", scene: { kind: "bars", title: "Trip cost", bars: [{ label: "Fuel", from: 0, to: 78 }, { label: "Tolls", from: 0, to: 34 }, { label: "Allowances", from: 0, to: 22 }] } },
    { title: "Invoice", caption: "Invoice straight from the trip record.", scene: { kind: "bill", title: "Invoice · Trip 204", rows: [["Freight", "5,200"], ["Border fees", "310"], ["Tax", "0"]], totalLabel: "Total", total: "5,510", stamp: "INVOICED" } },
  ],
  grows: [
    { title: "Plan", caption: "Give each rep a route and a list of outlets to cover.", scene: { kind: "route", title: "Today's route", points: ["Outlet 12", "Outlet 14", "Outlet 15"], note: "3 visits planned" } },
    { title: "Check in", caption: "Visits are logged with place and time. No phone calls.", scene: { kind: "checks", title: "Visit · Outlet 14", items: [{ label: "Location confirmed", state: "ok", tag: "10:42" }, { label: "Photo captured", state: "ok", tag: "Done" }, { label: "Notes saved", state: "ok", tag: "Done" }] } },
    { title: "Proposal", caption: "AI drafts the proposal from your visit notes.", scene: { kind: "chat", title: "AI assistant", contact: "Marichi AI", msgs: [{ from: "them", text: "Outlet 14 wants weekly delivery." }, { from: "us", text: "Proposal drafted. Review and send." }], chips: ["AI draft"] } },
    { title: "Follow up", caption: "Nothing slips. The next step is scheduled automatically.", scene: { kind: "pipeline", stages: ["Visit", "Proposal", "Follow-up", "Won"], card: "Outlet 14", note: "Follow-up tomorrow" } },
    { title: "Team view", caption: "Managers see activity by rep and route.", scene: { kind: "bars", title: "Visits this week", bars: [{ label: "Amina", from: 0, to: 84 }, { label: "Joseph", from: 0, to: 66 }, { label: "Grace", from: 0, to: 52 }] } },
  ],
  ops: [
    { title: "Capture", caption: "Leads from cards, calls and campaigns land in one inbox.", scene: { kind: "flow", from: ["Card scan", "Call", "Campaign"], hub: "Lead inbox", to: ["Owner assigned"] } },
    { title: "Qualify", caption: "Move every deal through your own stages.", scene: { kind: "pipeline", stages: ["New", "Qualified", "Proposal", "Won"], card: "Amina Traders", note: "Deal moving forward" } },
    { title: "Next step", caption: "Every deal has an owner, a next step and a date.", scene: { kind: "checks", title: "Amina Traders", items: [{ label: "Send price list", state: "ok", tag: "Today" }, { label: "Call to discuss", state: "ok", tag: "Thu" }, { label: "Proposal review", state: "ok", tag: "Fri" }] } },
    { title: "Nudge", caption: "AI tells your team who to call next.", scene: { kind: "chat", title: "AI nudge", contact: "Marichi AI", msgs: [{ from: "us", text: "Call Amina today. She opened the proposal twice." }, { from: "them", text: "Calling now." }] } },
    { title: "Forecast", caption: "See the whole pipeline at a glance.", scene: { kind: "bars", title: "Pipeline by stage", bars: [{ label: "New", from: 0, to: 90 }, { label: "Proposal", from: 0, to: 55 }, { label: "Won", from: 0, to: 32 }] } },
  ],
  card: [
    { title: "Share", caption: "Share your digital card with a tap or a QR code.", scene: { kind: "flow", from: ["Your card"], hub: "QR scan", to: ["Their phone"] } },
    { title: "Save", caption: "Their details arrive without anyone typing.", scene: { kind: "checks", title: "New contact", items: [{ label: "Name", state: "ok", tag: "Saved" }, { label: "Phone", state: "ok", tag: "Saved" }, { label: "Source: your card", state: "ok", tag: "Tagged" }] } },
    { title: "Lead", caption: "Every scan becomes a lead in MarichiOps.", scene: { kind: "flow", from: ["Scan"], hub: "MarichiOps", to: ["New lead"] } },
    { title: "Follow up", caption: "Send a WhatsApp follow-up before they forget you.", scene: { kind: "chat", title: "WhatsApp", contact: "New lead", msgs: [{ from: "us", text: "Great meeting you today! Here's my number.", card: { title: "Marichi Labs", lines: ["Your digital card"], button: "Save contact" } }, { from: "them", text: "Thanks, saved." }] } },
  ],
  assure: [
    { title: "Checklist", caption: "Build the audit form once and use it everywhere.", scene: { kind: "checks", title: "Store audit", items: [{ label: "Shelf display", state: "ok", tag: "Done" }, { label: "Stock levels", state: "ok", tag: "Done" }, { label: "Signage", state: "ok", tag: "Done" }] } },
    { title: "Capture", caption: "Photos are taken inside the audit, stamped with place and time.", scene: { kind: "photos", title: "Audit photos", flagged: -1, tiles: 6 } },
    { title: "AI check", caption: "AI flags photos that look edited or reused.", scene: { kind: "photos", title: "AI photo check", flagged: 4, tiles: 6 } },
    { title: "Review", caption: "Managers review flagged items first.", scene: { kind: "checks", title: "Review queue", items: [{ label: "Outlet 12 · 6 photos", state: "ok", tag: "Verified" }, { label: "Outlet 14 · 6 photos", state: "warn", tag: "1 flagged" }, { label: "Outlet 15 · 6 photos", state: "ok", tag: "Verified" }] } },
    { title: "Report", caption: "Compare results across stores and routes.", scene: { kind: "bars", title: "Compliance by store", bars: [{ label: "Outlet 12", from: 0, to: 94 }, { label: "Outlet 14", from: 0, to: 71 }, { label: "Outlet 15", from: 0, to: 88 }] } },
  ],
  sign: [
    { title: "Send", caption: "Upload an agreement, add signers and send it.", scene: { kind: "bill", title: "Service agreement", rows: [["Parties", "2 signers"], ["Pages", "4"], ["Due", "Friday"]], totalLabel: "Status", total: "Sent for signature", stamp: "SENT" } },
    { title: "Verify", caption: "Signers confirm who they are before signing.", scene: { kind: "checks", title: "Signer check", items: [{ label: "Phone confirmed", state: "ok", tag: "Verified" }, { label: "ID confirmed", state: "ok", tag: "Verified" }] } },
    { title: "Sign", caption: "Sign on any phone. No printing, no scanning.", scene: { kind: "sign", doc: "Service agreement", seal: "Sealed", lines: ["Signed by Amina M.", "10:42 · Lusaka"] } },
    { title: "Prove", caption: "A tamper-proof record with a full audit trail.", scene: { kind: "checks", title: "Audit trail", items: [{ label: "Opened", state: "ok", tag: "10:38" }, { label: "Signed", state: "ok", tag: "10:42" }, { label: "Sealed", state: "ok", tag: "10:42" }] } },
  ],
};

export const storyOrder = ["pulse", "talks", "pays", "moves", "grows", "ops", "card", "assure", "sign"] as const;
export const STEP_MS = 3400;
