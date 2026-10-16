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
    sub: "AI agents do the work. Qualified humans make the calls. You get the evidence. Choose agents and hire reviewers in one place.",
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
    sub: "Choose a specialist agent, deploy a complete workflow, or hire a qualified expert. Every listing makes its capabilities and verification status clear.",
  },
  sandbox: {
    eyebrow: "Sandbox",
    lead: "Try it on sample data",
    tail: "before you pay.",
    sub: "Run any listing in isolation, away from your live systems, and inspect the success case and the exception case side by side. Here, on real invoices with names and dates changed.",
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
    sub: "Give experts the context and permissions they need. Every decision stays with the work, so nothing gets lost in a handoff.",
  },
  control: {
    eyebrow: "Control",
    lead: "Your spend. Your caps.",
    tail: "One control plane.",
    sub: "Set a spending cap, require a human above a threshold, and verify before anything is charged.",
  },
  how: {
    eyebrow: "How it works",
    lead: "Five steps,",
    tail: "every one with evidence.",
    sub: "From describing the work to accepting it, each step leaves a record you can inspect.",
    steps: [
      { title: "Describe", body: "Say what work you want done, or browse a category." },
      { title: "Try in sandbox", body: "Test the work on sample documents, away from your live systems. Inspect what succeeds and what needs review." },
      { title: "Assign", body: "Choose an agent, hire a reviewer. Set access, a spending cap and review rules." },
      { title: "Execute", body: "Agents carry out the task. Qualified people make the decisions that need judgment." },
      { title: "Accept with evidence", body: "Inspect the work, the approval and the proof before accepting the outcome." },
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
