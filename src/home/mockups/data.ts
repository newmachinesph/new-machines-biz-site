import type { Status } from "@/design-system/components/Badge";
import { MARKETPLACE_LISTINGS, type MarketplaceListing } from "@/marketplace/listings";

export { KIND_FILTER_GROUP_LABEL, KIND_FILTERS, KIND_LABEL, type Kind, type KindFilter } from "@/marketplace/kinds";

export type DemoRun = { id: string; agent: string; status: Status; cost: string };

export const DEMO_RUNS: readonly DemoRun[] = [
  { id: "run_01HX4QK2", agent: "Invoice matcher", status: "running", cost: "¥180" },
  { id: "run_01HX4QJ7", agent: "Lead qualifier", status: "running", cost: "¥260" },
  { id: "run_01HX4QHM", agent: "Contract clause check", status: "waiting-for-human", cost: "¥95" },
  { id: "run_01HX4QG3", agent: "Support reply drafter", status: "waiting-for-human", cost: "¥140" },
  { id: "run_01HX4QFA", agent: "Receipt reconciler", status: "verified", cost: "¥410" },
  { id: "run_01HX4QEN", agent: "Market brief", status: "verified", cost: "¥330" },
];

export const DEMO_EVIDENCE = [
  { title: "Invoices matched", meta: "run_01HX4QFA · 2 files" },
  { title: "Clauses checked", meta: "run_01HX4QHM · 1 file" },
  { title: "Brief generated", meta: "run_01HX4QEN · 3 files" },
] as const;

export type DemoListing = Pick<MarketplaceListing, "title" | "kind" | "body" | "price" | "certified" | "portrait"> & { hovered?: boolean };

/** The homepage mockup shows the first six marketplace listings. */
export const DEMO_LISTINGS: readonly DemoListing[] = MARKETPLACE_LISTINGS.slice(0, 6).map(({ title, kind, body, price, certified, portrait }, index) => ({
  title, kind, body, price, certified, portrait, ...(index === 1 ? { hovered: true } : {}),
}));

export const DEMO_STEPS = ["Read inputs", "Draft output", "Check policy", "Human review", "Verify evidence"] as const;

export const DEMO_AGENTS = [
  { name: "Invoice matcher", runs: 142, verified: true, cost: "¥17,040" },
  { name: "Contract clause check", runs: 87, verified: false, cost: "¥8,265" },
  { name: "Lead qualifier", runs: 305, verified: true, cost: "¥18,300" },
  { name: "Receipt reconciler", runs: 76, verified: true, cost: "¥3,040" },
  { name: "Market brief", runs: 120, verified: true, cost: "¥39,600" },
] as const;

export const DEMO_LOG = [
  { id: "ap_9f31", who: "M. Tanaka", what: "approved run_01HX4QHM", at: "09:36:12 JST" },
  { id: "ap_9f2e", who: "policy v3", what: "authorized run_01HX4QG3", at: "09:31:40 JST" },
  { id: "ap_9f2a", who: "S. Lim", what: "rejected run_01HX4QD9", at: "08:28:05 SGT" },
  { id: "ap_9f27", who: "verifier", what: "verified run_01HX4QFA", at: "09:22:58 JST" },
  { id: "ap_9f21", who: "J. Park", what: "approved run_01HX4QCX", at: "09:19:33 KST" },
  { id: "ap_9f1d", who: "policy v3", what: "blocked run_01HX4QBB", at: "09:12:07 JST" },
] as const;
