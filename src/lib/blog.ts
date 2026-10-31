export type BlogKind = "sales" | "tech";

export type Post = {
  kind: BlogKind;
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  readMins: number;
  author: string;
  tags: string[];
  body: { h: string; p: string[] }[];
  cta?: { product: string; text: string };
  html?: string; // rich-text body for posts written in the editor (already sanitised)
};

export const blogMeta = {
  sales: {
    name: "Sales Blog",
    path: "/blog/sales",
    title: "Sales Blog: field sales, CRM and customer conversations",
    description: "Practical guides on field sales, CRM, WhatsApp selling and getting paid, for sales teams and business owners across Africa and beyond.",
    lead: "Practical playbooks for winning customers, following up and getting paid.",
  },
  tech: {
    name: "Tech Blog",
    path: "/blog/tech",
    title: "Tech Blog: engineering, AI and payments infrastructure",
    description: "How we think about building AI-native business software: payments, messaging, data and reliability.",
    lead: "How we build AI-native business software that works in real markets.",
  },
} as const;

export const posts: Post[] = [
  {
    kind: "sales",
    slug: "whatsapp-follow-up-playbook-for-sales-teams",
    title: "The WhatsApp follow-up playbook for sales teams",
    excerpt: "Most deals are lost in the silence after a first meeting. Here is a simple follow-up rhythm that works on WhatsApp.",
    date: "2026-10-20",
    readMins: 5,
    author: "Marichi Labs",
    tags: ["WhatsApp", "Follow-ups"],
    cta: { product: "talks", text: "Run WhatsApp follow-ups from one wallet with MarichiTalks." },
    body: [
      { h: "Why follow-up decides the sale", p: ["Customers rarely say no. They go quiet. A prompt, useful message after a meeting keeps your offer fresh while the buyer is still thinking about it.", "WhatsApp is where many customers already read and reply, so it is the natural place to continue the conversation."] },
      { h: "A simple three-touch rhythm", p: ["Touch one, within the hour: thank them, restate what you agreed and confirm the next step.", "Touch two, within two days: send something useful such as a price sheet, a short video or a reference. Do not just ask if they have decided.", "Touch three, within a week: ask one clear question that makes replying easy, such as whether Thursday suits for a call."] },
      { h: "Keep messages short and human", p: ["Write like a person. One idea per message, no walls of text, and a name at the start. Voice notes work well when the topic is complex.", "Always make the next step obvious. A message without a question or an action is easy to ignore."] },
      { h: "Make it a system, not a habit", p: ["Follow-up depends on memory unless you automate the reminder. Schedule the next touch the moment a meeting ends, and give someone ownership for each lead.", "A CRM that nudges the rep on who to contact next removes the guesswork."] },
    ],
  },
  {
    kind: "sales",
    slug: "how-to-manage-a-field-sales-team",
    title: "How to manage a field sales team you cannot see",
    excerpt: "Visibility, routes and quick feedback loops: the basics of running a field team without micromanaging.",
    date: "2026-10-13",
    readMins: 6,
    author: "Marichi Labs",
    tags: ["Field sales", "Management"],
    cta: { product: "grows", text: "Track visits and automate follow-ups with MarichiGrows." },
    body: [
      { h: "Start with routes, not targets", p: ["Targets tell reps what to achieve. Routes tell them where to spend the day. A planned route removes wasted travel and makes coverage measurable."] },
      { h: "Make every visit verifiable", p: ["Check-ins with location and time make visits visible to managers without phone calls. They also protect honest reps from doubt.", "For high-stakes audits, add photo evidence and check it for tampering."] },
      { h: "Track a few numbers well", p: ["Visits per day, conversion from visit to order and follow-up completed on time tell you more than a long report. Review them weekly with each rep."] },
      { h: "Shorten the feedback loop", p: ["Coach from yesterday's data, not last quarter's. A five-minute daily review changes behaviour faster than a monthly meeting."] },
    ],
  },
  {
    kind: "sales",
    slug: "reconcile-mobile-money-card-and-bank-payments",
    title: "How to reconcile mobile money, card and bank payments without losing a week",
    excerpt: "When customers pay across many channels, reconciliation becomes the bottleneck. Here is how to simplify it.",
    date: "2026-10-06",
    readMins: 5,
    author: "Marichi Labs",
    tags: ["Payments", "Finance"],
    cta: { product: "pays", text: "Reconcile payments across 15+ rails with MarichiPays." },
    body: [
      { h: "Why reconciliation breaks", p: ["Each channel reports differently: different references, different cut-off times and different fee treatments. Matching them by hand is slow and error-prone."] },
      { h: "Give every sale a single reference", p: ["Create one order or invoice number and make customers include it in the payment. A clean reference is what makes automatic matching possible."] },
      { h: "Match first, investigate exceptions", p: ["Most payments match perfectly. Automate those and spend your time on the few that do not: partial payments, duplicates and unknown references."] },
      { h: "Close the books daily", p: ["Daily reconciliation turns a monthly crisis into a five-minute routine, and it catches fraud and mistakes while they are still small."] },
    ],
  },
  {
    kind: "tech",
    slug: "why-we-build-ai-native-business-software",
    title: "Why we build AI-native business software, not AI add-ons",
    excerpt: "Adding a chatbot to old software is different from designing around what AI can do. Here is how we think about it.",
    date: "2026-10-18",
    readMins: 6,
    author: "Marichi Labs Engineering",
    tags: ["AI", "Product"],
    body: [
      { h: "Add-on AI versus AI-native", p: ["An add-on sits beside the workflow. An AI-native product reshapes the workflow around the model, so the software drafts, summarises and suggests as a normal part of the job."] },
      { h: "Where AI earns its place", p: ["We focus on tasks that are repetitive, text-heavy and costly to delay: drafting proposals, summarising meetings, answering questions about live data and deciding who to follow up with next."] },
      { h: "Keep humans in control", p: ["Every AI output is a draft the user can review. Business decisions stay with people; the software removes the busywork around them."] },
      { h: "Data first", p: ["AI is only as useful as the data it can see. That is why our products share one connected data layer instead of separate silos."] },
    ],
  },
  {
    kind: "tech",
    slug: "designing-a-multi-rail-payments-gateway",
    title: "Designing a multi-rail payments gateway: lessons from 15+ integrations",
    excerpt: "Every payment rail has its own quirks. The trick is hiding them behind one clean interface.",
    date: "2026-10-11",
    readMins: 7,
    author: "Marichi Labs Engineering",
    tags: ["Payments", "Architecture"],
    body: [
      { h: "One interface, many rails", p: ["Mobile money, cards and bank transfers differ in flow, timing and failure modes. A gateway should expose one consistent model of a payment, and translate it for each rail."] },
      { h: "Idempotency is not optional", p: ["Networks fail and clients retry. Every payment request needs an idempotency key so a retry never charges twice."] },
      { h: "Treat webhooks as unreliable", p: ["Callbacks arrive late, twice or not at all. Verify signatures, process them idempotently and run a reconciliation job that checks status directly."] },
      { h: "Reconciliation as a first-class feature", p: ["Reconciliation is not an afterthought. Storing every state change as an append-only ledger makes audits and debugging straightforward."] },
    ],
  },
  {
    kind: "tech",
    slug: "building-reliable-messaging-whatsapp-sms-email-voice",
    title: "Building reliable messaging across WhatsApp, SMS, email and voice",
    excerpt: "Delivering a message sounds simple until you handle four channels, retries and a shared wallet.",
    date: "2026-10-04",
    readMins: 6,
    author: "Marichi Labs Engineering",
    tags: ["Messaging", "Reliability"],
    body: [
      { h: "A shared model for every channel", p: ["Messages, recipients and delivery states look similar across channels. We model them once and let channel adapters handle differences."] },
      { h: "Queues and back-pressure", p: ["Campaigns can mean thousands of messages at once. Queues smooth the load and respect each provider's rate limits."] },
      { h: "Wallet accounting", p: ["With a single wallet, every send reserves credit, and a failed delivery refunds it. Ledger-style accounting keeps balances correct under retries."] },
      { h: "Observability", p: ["We track delivery, failure and reply rates per channel so problems show up in dashboards before customers notice."] },
    ],
  },
];

export const postsByKind = (k: BlogKind) => posts.filter((p) => p.kind === k).sort((a, b) => b.date.localeCompare(a.date));
export const getPost = (k: BlogKind, slug: string) => posts.find((p) => p.kind === k && p.slug === slug);
export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
