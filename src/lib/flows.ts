// Live WhatsApp flow demos shown on the MarichiTalks page. Each one is a working prototype hosted
// separately; `url` opens in the phone frame and in a new tab. Blurbs are inferred from the demo
// names, so edit them to match what each flow really does.

export type FlowGroup = "Health" | "Money" | "Shop and book" | "Service";

export type Flow = {
  id: string;
  group: FlowGroup;
  industry: string;
  title: string;
  text: string;
  steps: [string, string, string];
  color: string;
  icon: string; // SVG path, 24x24 stroke
  url: string;
};

const u = (name: string) => `https://${name}.lovable.app`;

const I = {
  heart: "M12 20s-7-4.500-7-10a4 4 0 017-2.500A4 4 0 0119 10c0 5.500-7 10-7 10z",
  cross: "M9 3h6v6h6v6h-6v6H9v-6H3V9h6z",
  bank: "M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18",
  truck: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.500 1.500 0 100-3 1.500 1.500 0 000 3zM17 19a1.500 1.500 0 100-3 1.500 1.500 0 000 3z",
  shield: "M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6zM8.500 12l2.500 2.500 4.500-5",
  bag: "M5 8h14l-1 12H6zM9 8a3 3 0 016 0",
  cal: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  school: "M2 9l10-5 10 5-10 5zM6 11v5c0 1.500 3 3 6 3s6-1.500 6-3v-5",
  hands: "M12 3v4M5 8l3 2M19 8l-3 2M4 21v-6a8 8 0 0116 0v6z",
  coin: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v10M9.500 9.500c0-1 1-1.500 2.500-1.500s2.500.7 2.500 1.800c0 2.200-5 1.200-5 3.400 0 1.100 1 1.800 2.500 1.800s2.500-.5 2.500-1.500",
  car: "M4 14l2-6h12l2 6v4H4zM7 18v2M17 18v2M7 14h.01M17 14h.01",
  repeat: "M17 2l4 4-4 4M3 11V9a3 3 0 013-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 01-3 3H3",
  tag: "M3 12V3h9l9 9-9 9zM7.500 7.500h.01",
  tool: "M14.500 6a4 4 0 00-5 5L3 17.500 6.500 21l6.500-6.500a4 4 0 005-5l-2.500 2.500-2.500-.5-.5-2.500z",
  link: "M10 14a4 4 0 005.700 0l3-3a4 4 0 00-5.700-5.700l-1 1M14 10a4 4 0 00-5.700 0l-3 3a4 4 0 005.700 5.700l1-1",
  card: "M3 6h18v12H3zM3 10h18M7 15h4",
  scissors: "M6 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM8 7.500L20 18M8 16.500L20 6",
  pen: "M4 20h16M5 16l9-9 3 3-9 9H5z",
};

export const flowSlug = (f: Flow) => `${f.industry}-${f.title}`.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const flowPath = (f: Flow) => `/whatsapp-flows/${flowSlug(f)}/`;
export const getFlow = (slug: string) => flows.find((f) => flowSlug(f) === slug);

export const flowGroups: FlowGroup[] = ["Health", "Money", "Shop and book", "Service"];

export const flows: Flow[] = [
  { id: "labs", group: "Health", industry: "Diagnostics", title: "Lab tests and results", text: "Patients book a test, get reminders and receive their results in the same chat.", steps: ["Pick a test", "Choose a slot", "Get results"], color: "#0EA371", icon: I.cross, url: u("unilabs") },
  { id: "doctor", group: "Health", industry: "Clinics", title: "Doctor appointments", text: "Choose a doctor, pick a time and get a reminder the day before.", steps: ["Choose doctor", "Pick time", "Reminder"], color: "#0891B2", icon: I.heart, url: u("doctorscheduling") },
  { id: "hospital", group: "Health", industry: "Hospitals", title: "Patient services", text: "Appointments, department help and follow-ups for a whole hospital on one number.", steps: ["Ask", "Book", "Follow up"], color: "#2563EB", icon: I.cross, url: u("hospitalflow") },
  { id: "loan", group: "Money", industry: "Lending", title: "Loan application", text: "Collect details, documents and consent inside WhatsApp, then show the status.", steps: ["Apply", "Upload ID", "Track"], color: "#D97706", icon: I.coin, url: u("loanflowcomplete") },
  { id: "bayport", group: "Money", industry: "Financial services", title: "Customer connect", text: "Customers check balances, ask questions and reach an agent without calling.", steps: ["Ask", "Verify", "Resolve"], color: "#1D4ED8", icon: I.bank, url: u("bayport-connect-app") },
  { id: "insurance", group: "Money", industry: "Insurance", title: "Quotes, policies and claims", text: "Get a quote, see your policy and start a claim from one conversation.", steps: ["Quote", "Policy", "Claim"], color: "#7C3AED", icon: I.shield, url: u("insuranceflow") },
  { id: "collect", group: "Money", industry: "Collections", title: "Payment reminders", text: "Polite reminders with a pay-now link, and replies routed to the right person.", steps: ["Remind", "Pay link", "Reconcile"], color: "#DC2626", icon: I.tag, url: u("collectly-chat") },
  { id: "subs", group: "Money", industry: "Subscriptions", title: "Renewals and billing", text: "Renewal notices, plan changes and receipts without a support ticket.", steps: ["Notice", "Renew", "Receipt"], color: "#DB2777", icon: I.repeat, url: u("subscriptionflow") },
  { id: "retail", group: "Shop and book", industry: "Retail", title: "Shop in chat", text: "Browse, search, order and track a delivery in one conversation (ShopEase).", steps: ["Browse", "Order", "Track"], color: "#EA580C", icon: I.bag, url: u("retailcustomerflow") },
  { id: "salon", group: "Shop and book", industry: "Salons and beauty", title: "Book a salon visit", text: "Pick a service and stylist, confirm a slot and get a reminder.", steps: ["Service", "Stylist", "Confirm"], color: "#C026D3", icon: I.scissors, url: u("salon-ease-chat") },
  { id: "booking", group: "Shop and book", industry: "Hospitality", title: "Reservations", text: "Tables and rooms booked, changed and confirmed in chat.", steps: ["Date", "Party size", "Confirm"], color: "#E11D48", icon: I.cal, url: u("bookingreserves") },
  { id: "arch", group: "Shop and book", industry: "Architecture", title: "Consultation booking", text: "Clients choose a topic and a time to meet the studio.", steps: ["Topic", "Time", "Confirm"], color: "#475569", icon: I.pen, url: u("arch-appoint-buddy") },
  { id: "advisory", group: "Shop and book", industry: "Advisory", title: "Client appointments", text: "Clients book and reschedule time with an adviser without back and forth.", steps: ["Request", "Slot", "Remind"], color: "#0F766E", icon: I.cal, url: u("cascheduling") },
  { id: "school", group: "Service", industry: "Schools", title: "Parents and fees", text: "Notices, fee reminders and parent questions handled on WhatsApp.", steps: ["Notice", "Fees", "Reply"], color: "#4F46E5", icon: I.school, url: u("schoolflow11") },
  { id: "faith", group: "Service", industry: "Faith communities", title: "Members and giving", text: "Event updates, member care and giving in one place.", steps: ["Updates", "Events", "Give"], color: "#9333EA", icon: I.hands, url: u("religiousflow") },
  { id: "fuel", group: "Service", industry: "Transport", title: "Truck fuel requests", text: "Drivers request fuel, managers approve and the record is kept automatically.", steps: ["Request", "Approve", "Log"], color: "#CA8A04", icon: I.truck, url: u("truck-fuel-flow") },
  { id: "car", group: "Service", industry: "Automotive", title: "Car servicing", text: "Service reminders, bookings and status updates for every vehicle.", steps: ["Remind", "Book", "Status"], color: "#0369A1", icon: I.car, url: u("carmaintainance") },
  { id: "warranty", group: "Service", industry: "Warranty", title: "Register and claim", text: "Customers register a product and raise a warranty claim in chat.", steps: ["Register", "Claim", "Resolve"], color: "#16A34A", icon: I.shield, url: u("warrantymanagment") },
  { id: "field", group: "Service", industry: "Field services", title: "Service requests", text: "Customers raise a job, see who is coming and when it is done.", steps: ["Request", "Assign", "Done"], color: "#EA580C", icon: I.tool, url: u("serviceflowmarichi") },
  { id: "falkon", group: "Service", industry: "Customer care", title: "Connect with customers", text: "A single inbox for questions, updates and hand-offs to a human.", steps: ["Ask", "Route", "Reply"], color: "#0D9488", icon: I.link, url: u("falkon-connect") },
  { id: "card", group: "Service", industry: "Sales teams", title: "Digital business card", text: "Share a smart card by QR or link and track who opened it.", steps: ["Share", "Scan", "Lead"], color: "#E11D48", icon: I.card, url: u("connectcard-hub") },
];
