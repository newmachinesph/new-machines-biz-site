import type { City } from "./clock";

const CITIES: readonly City[] = [
  { name: "Tokyo", native: "東京", zone: "Asia/Tokyo", abbr: "JST" },
  { name: "Singapore", zone: "Asia/Singapore", abbr: "SGT" },
  { name: "Sydney", zone: "Australia/Sydney", abbr: "AEST/AEDT" },
  { name: "Seoul", zone: "Asia/Seoul", abbr: "KST" },
];

export const HOME_COPY = {
  nav: {
    links: [
      { href: "/marketplace", label: "Marketplace" },
      { href: "/product", label: "Product" },
      { href: "/pricing", label: "Pricing" },
      { href: "/developers", label: "Developers" },
      { href: "/trust", label: "Trust" },
    ],
    secondaryAction: "Try a workflow",
    getStarted: "Get started",
    // The live demo app (Firebase App Hosting); "Get started" sends visitors there.
    appUrl: "https://app-157kih4j--nm-demo-iu7uo4.asia-southeast1.hosted.app",
    menu: "Menu",
  },
  hero: {
    lead: "A new kind",
    tail: "of workforce.",
    sub: "AI agents do the work. Qualified humans make the calls. You get the evidence. Choose Workflow Packs and bring in qualified reviewers, in one place.",
    primary: { href: "/marketplace", label: "Explore the marketplace" },
    secondary: { href: "/#work-explorer", label: "Try a workflow" },
  },
  japac: {
    eyebrow: "Leading JAPAC tech hubs",
    lead: "Built for Japan. Ready for everywhere.",
    sub: "Local expertise. Shared standards. Work across borders with confidence.",
    languages: "日本語 / English",
    cities: CITIES,
  },
  hire: {
    eyebrow: "Marketplace",
    lead: "The right fit.",
    tail: "For every kind of work.",
    sub: "Add a ready-made Workflow Pack for a complete outcome. Each pack states its outcome, who does the work, what it can touch (read only, or writes with your approval) and its cost per run. Platform packs are published by New Machines Labs and marked Certified.",
  },
  sandbox: {
    eyebrow: "Sandbox",
    lead: "Try it on sample data",
    tail: "before you connect anything.",
    sub: "Add any pack and choose simulated data for its apps: the run is real, nothing reaches your accounts, and any write lands in the sandbox. Every pack page also shows a short preview on sample data. The preview here is illustrative, on real invoices with names and dates changed.",
  },
  trust: {
    eyebrow: "Trust",
    lead: "Judgment recommends. Policy authorizes. Verification checks.",
    sub: "An AI's confidence is never a substitute for authorization or proof. These responsibilities are kept separate on purpose.",
  },
  human: {
    eyebrow: "Human work",
    lead: "Bring in qualified humans",
    tail: "when judgment is needed.",
    sub: "A run waits for a person before it changes anything in your apps, and review steps go to your team or the New Machines reviewer network. Your team reviews unpaid; network reviewers see a redacted copy, with no workspace name, emails or phone numbers. Every decision stays with the work.",
  },
  control: {
    eyebrow: "Control",
    lead: "Your spend. Your caps.",
    tail: "One control plane.",
    sub: "Set a budget per run and a monthly cap, require a person before any write, and see every charge against the run step that caused it. Runs stop before passing the cap.",
  },
  how: {
    eyebrow: "How it works",
    lead: "Five steps,",
    tail: "every one with evidence.",
    sub: "From describing the work to accepting it, each step leaves a record you can inspect.",
    steps: [
      { title: "Describe", body: "Say what work you want done in the ask box and get a pack suggested, or browse the marketplace." },
      { title: "Try on simulated data", body: "Preview the pack on sample data, or run it for real with simulated data for each app, so nothing reaches your accounts." },
      { title: "Add the pack", body: "Add it to your workspace, pinned to its version. Connect the apps it needs, set its access, a spending cap per run and who reviews." },
      { title: "Start a run", body: "Choose the data to work on. Agents carry out the steps; every write waits for your approval, and review steps wait for a reviewer." },
      { title: "Accept with evidence", body: "Read the work receipt and the evidence: every step, who did it, what changed outside New Machines and the versions used, before accepting the outcome." },
    ],
  },
  close: {
    lead: "Agents execute.\nHumans decide.",
    sub: "Give your team a workforce that works as hard as they do. Start with one task, and see the evidence for yourself.",
  },
  footer: {
    domain: "newmachin.es",
    columns: [
      { title: "Platform", links: [{ href: "/marketplace", label: "Marketplace" }, { href: "/product", label: "Product" }, { href: "/pricing", label: "Pricing" }, { href: "/#sandbox", label: "Sandbox" }, { href: "/#connectors", label: "Connectors" }] },
      { title: "Solutions", links: [{ href: "/?workflow=finance#work-explorer", label: "Finance & operations" }, { href: "/?workflow=sales#work-explorer", label: "Sales & growth" }, { href: "/#customer-stories", label: "Workflow stories" }, { href: "/work", label: "For reviewers" }, { href: "/developers", label: "For developers" }] },
      { title: "Company", links: [{ href: "/about", label: "About" }, { href: "/trust", label: "Trust & security" }, { href: "/contact", label: "Contact" }, { href: "/#faq", label: "Questions & answers" }] },
    ],
    legal: [{ href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }],
  },
} as const;
