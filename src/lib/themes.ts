import type React from "react";
// Per-product look: colours, photos, floating UI cards and the animated motif.
// Colours follow the website spec's product palette. "p1" is the brand colour, "p1d" a deeper shade
// used for buttons and text so white-on-colour stays readable.

export type Motif = "heartbeat" | "chat" | "route" | "flow" | "pins" | "pipeline" | "scan" | "audit" | "sign";

export type Floater = { label: string; value: string; note?: string; pos: string; delay: number };

export type Theme = {
  p1: string;
  p1d: string;
  p2: string;
  aura: [string, string, string];
  motif: Motif;
  photos: { hero: string; scenes: { src: string; caption: string; chip: string }[] };
  floaters: Floater[];
  alt: string;
};

const ph = (id: string, n: string) => `/photos/${id}-${n}.jpg`;

export const themes: Record<string, Theme> = {
  pulse: {
    p1: "#0EA371", p1d: "#0a7f58", p2: "#14B8A6", motif: "heartbeat",
    aura: ["rgba(20,184,166,0.38)", "rgba(14,163,113,0.30)", "rgba(110,231,183,0.40)"],
    alt: "A shopkeeper in his market stall, the kind of shop MarichiPulse runs",
    photos: { hero: ph("pulse", "hero"), scenes: [
      { src: ph("pulse", "1"), caption: "Checkout that updates stock and books on its own.", chip: "Sale recorded" },
      { src: ph("pulse", "2"), caption: "Scan stock in and out across every branch.", chip: "Stock updated" },
    ] },
    floaters: [
      { label: "Today's sales", value: "Live", note: "Every till, one total", pos: "left-[-4%] top-[10%]", delay: 0 },
      { label: "Low stock", value: "4 items", note: "Reorder suggested", pos: "right-[-5%] top-[38%]", delay: 1.2 },
      { label: "Payroll", value: "Ready", note: "Run on schedule", pos: "left-[6%] bottom-[-5%]", delay: 2.2 },
    ],
  },
  talks: {
    p1: "#5B3FFF", p1d: "#4a30e8", p2: "#00D4FF", motif: "chat",
    aura: ["rgba(124,92,255,0.34)", "rgba(0,212,255,0.28)", "rgba(167,139,250,0.38)"],
    alt: "Hands typing a message on a phone, the way customers reach a business on MarichiTalks",
    photos: { hero: ph("talks", "hero"), scenes: [
      { src: ph("talks", "1"), caption: "Reach customers on the channel they actually read.", chip: "WhatsApp" },
      { src: ph("talks", "2"), caption: "Follow up automatically until they reply.", chip: "Follow-up sent" },
    ] },
    floaters: [
      { label: "WhatsApp", value: "Delivered", note: "Read 2 min ago", pos: "left-[-5%] top-[12%]", delay: 0 },
      { label: "SMS", value: "Sent", note: "OTP, reminders", pos: "right-[-5%] top-[34%]", delay: 1.1 },
      { label: "AI voice", value: "Calling", note: "Routine follow-ups", pos: "left-[8%] bottom-[-5%]", delay: 2.1 },
    ],
  },
  moves: {
    p1: "#D97706", p1d: "#b45309", p2: "#FBBF24", motif: "route",
    aura: ["rgba(251,191,36,0.40)", "rgba(217,119,6,0.28)", "rgba(253,186,116,0.40)"],
    alt: "A freight truck on a highway, the loads MarichiMoves keeps on one ledger",
    photos: { hero: ph("moves", "hero"), scenes: [
      { src: ph("moves", "1"), caption: "Loads, drivers and costs on one ledger.", chip: "Load assigned" },
      { src: ph("moves", "2"), caption: "Border paperwork tied to the trip it belongs to.", chip: "Docs attached" },
    ] },
    floaters: [
      { label: "Trip 204", value: "At border", note: "Docs attached", pos: "left-[-5%] top-[14%]", delay: 0 },
      { label: "Trip cost", value: "Tracked", note: "Fuel, tolls, allowances", pos: "right-[-5%] top-[40%]", delay: 1.2 },
      { label: "Invoice", value: "Sent", note: "From the trip record", pos: "left-[6%] bottom-[-5%]", delay: 2.2 },
    ],
  },
  pays: {
    p1: "#2563EB", p1d: "#1d4fd7", p2: "#60A5FA", motif: "flow",
    aura: ["rgba(96,165,250,0.40)", "rgba(37,99,235,0.28)", "rgba(165,180,252,0.38)"],
    alt: "A customer paying by phone at a card terminal, the payments MarichiPays accepts",
    photos: { hero: ph("pays", "hero"), scenes: [
      { src: ph("pays", "1"), caption: "Tap, scan or transfer: one gateway for all of it.", chip: "Payment received" },
      { src: ph("pays", "2"), caption: "Every payment matched to the order it settles.", chip: "Matched" },
    ] },
    floaters: [
      { label: "Mobile money", value: "Received", note: "Matched to order", pos: "left-[-5%] top-[12%]", delay: 0 },
      { label: "Card", value: "Settled", note: "Reconciled", pos: "right-[-5%] top-[36%]", delay: 1.1 },
      { label: "Payout", value: "Sent", note: "To supplier", pos: "left-[8%] bottom-[-5%]", delay: 2.1 },
    ],
  },
  grows: {
    p1: "#E11D48", p1d: "#be123c", p2: "#FB7185", motif: "pins",
    aura: ["rgba(251,113,133,0.38)", "rgba(225,29,72,0.24)", "rgba(253,164,175,0.42)"],
    alt: "A salesperson working with notes outdoors, the field work MarichiGrows tracks",
    photos: { hero: ph("grows", "hero"), scenes: [
      { src: ph("grows", "1"), caption: "Visits logged with place and time, no phone calls.", chip: "Visit logged" },
    ] },
    floaters: [
      { label: "Visit", value: "Checked in", note: "Outlet 14", pos: "left-[-5%] top-[12%]", delay: 0 },
      { label: "Proposal", value: "Drafted", note: "By AI, from notes", pos: "right-[-5%] top-[38%]", delay: 1.2 },
      { label: "Follow-up", value: "Tomorrow", note: "Scheduled", pos: "left-[8%] bottom-[-5%]", delay: 2.2 },
    ],
  },
  ops: {
    p1: "#7C3AED", p1d: "#6d28d9", p2: "#C084FC", motif: "pipeline",
    aura: ["rgba(192,132,252,0.38)", "rgba(124,58,237,0.26)", "rgba(216,180,254,0.42)"],
    alt: "A small business owner serving a customer with a tablet, the pipeline MarichiOps keeps moving",
    photos: { hero: ph("ops", "hero"), scenes: [
      { src: ph("ops", "1"), caption: "Every lead and deal, owned and dated.", chip: "Deal moved" },
    ] },
    floaters: [
      { label: "New lead", value: "From card", note: "Assigned", pos: "left-[-5%] top-[12%]", delay: 0 },
      { label: "Deal", value: "Proposal", note: "Next step set", pos: "right-[-5%] top-[38%]", delay: 1.2 },
      { label: "Call next", value: "3 people", note: "AI nudge", pos: "left-[8%] bottom-[-5%]", delay: 2.2 },
    ],
  },
  card: {
    p1: "#DB2777", p1d: "#be185d", p2: "#F472B6", motif: "scan",
    aura: ["rgba(244,114,182,0.38)", "rgba(219,39,119,0.24)", "rgba(249,168,212,0.42)"],
    alt: "A phone scanning a QR code, how MarichiCard turns a scan into a lead",
    photos: { hero: ph("card", "hero"), scenes: [
      { src: ph("card", "1"), caption: "One scan, one new lead in your CRM.", chip: "Lead captured" },
    ] },
    floaters: [
      { label: "QR scan", value: "New contact", note: "Just now", pos: "left-[-5%] top-[12%]", delay: 0 },
      { label: "CRM", value: "Synced", note: "MarichiOps", pos: "right-[-5%] top-[38%]", delay: 1.2 },
      { label: "WhatsApp", value: "Queued", note: "Follow-up", pos: "left-[8%] bottom-[-5%]", delay: 2.2 },
    ],
  },
  assure: {
    p1: "#0891B2", p1d: "#0e7490", p2: "#67E8F9", motif: "audit",
    aura: ["rgba(103,232,249,0.40)", "rgba(8,145,178,0.26)", "rgba(165,243,252,0.42)"],
    alt: "A checklist being ticked on a tablet, the audits MarichiAssure verifies",
    photos: { hero: ph("assure", "hero"), scenes: [
      { src: ph("assure", "1"), caption: "Field audits with location, time and photo checks.", chip: "Audit verified" },
    ] },
    floaters: [
      { label: "Audit", value: "Geo-tagged", note: "Place and time", pos: "left-[-5%] top-[12%]", delay: 0 },
      { label: "Photo check", value: "1 flagged", note: "Possible edit", pos: "right-[-5%] top-[38%]", delay: 1.2 },
      { label: "Report", value: "Ready", note: "By route", pos: "left-[8%] bottom-[-5%]", delay: 2.2 },
    ],
  },
  sign: {
    p1: "#475569", p1d: "#475569", p2: "#94A3B8", motif: "sign",
    aura: ["rgba(148,163,184,0.38)", "rgba(71,85,105,0.22)", "rgba(203,213,225,0.50)"],
    alt: "Hands signing a contract with a pen, the agreements MarichiSign seals",
    photos: { hero: ph("sign", "hero"), scenes: [
      { src: ph("sign", "1"), caption: "Sign on any phone. Prove it later.", chip: "Signed" },
    ] },
    floaters: [
      { label: "Signer", value: "Verified", note: "Before signing", pos: "left-[-5%] top-[12%]", delay: 0 },
      { label: "Document", value: "Sealed", note: "Tamper-proof", pos: "right-[-5%] top-[38%]", delay: 1.2 },
      { label: "Audit trail", value: "Complete", note: "Who, when", pos: "left-[8%] bottom-[-5%]", delay: 2.2 },
    ],
  },
};

export const themeOf = (id: string) => themes[id];
export const themeVars = (id: string) => {
  const t = themes[id];
  return t ? ({ "--p1": t.p1, "--p1d": t.p1d, "--p2": t.p2 } as React.CSSProperties) : undefined;
};
