/** The Lead qualifier's output contract (the JSON its run hands to the UI), and one synthetic run in that shape.
 *  Fictional companies on reserved `.example` domains; nothing here describes a real account. */

export type CheckStatus = "pass" | "warn" | "fail" | "could_not_check";
export type Confidence = "high" | "medium" | "low";

export type QualifierCriterion = Readonly<{
  criterion: string;
  score: number;
  max: number;
  evidence: string;
  source: string;
  source_date: string;
  /** Official site, filing or CRM record; false when inferred (e.g. size from job postings). */
  verified: boolean;
  /** Set when no evidence was found: the criterion scores 0 rather than being guessed. */
  could_not_check?: boolean;
}>;

export type QualifierAccount = Readonly<{
  account: string;
  domain: string;
  fit_score: number;
  confidence: Confidence;
  status: "ready" | "review";
  review_reason: string;
  criteria: readonly QualifierCriterion[];
  /** Timing, not fit: reported alongside and never added to the fit score. */
  intent_signals: readonly Readonly<{ signal: string; source: string; date: string }>[];
  checks: readonly Readonly<{ check: string; status: CheckStatus; reason: string }>[];
  fit_notes: string;
  suggested_next_action: string;
}>;

export type QualifierRun = Readonly<{
  run_id: string;
  summary: string;
  shortlist: readonly QualifierAccount[];
  excluded: readonly Readonly<{ account: string; reason: string }>[];
  audit: Readonly<{ tools_called: readonly string[]; sources_checked: readonly string[]; checked_at: string }>;
}>;

/** The rubric the sample run scores against. Weights sum to 100. */
export const QUALIFIER_RUBRIC = [
  { criterion: "Industry / segment", weight: 25 },
  { criterion: "Company size", weight: 20 },
  { criterion: "Geography / markets", weight: 15 },
  { criterion: "Use-case fit", weight: 25 },
  { criterion: "Buying environment", weight: 15 },
] as const;

export const QUALIFIER_CHECKS = ["CRM duplicate", "Do-not-contact", "Hard disqualifiers", "Data coverage", "Data freshness", "Entity resolution"] as const;

const ALL_CLEAR = (coverage: string, freshness: string, entity: string) => [
  { check: "CRM duplicate", status: "pass", reason: "No account, open opportunity or owner in the CRM." },
  { check: "Do-not-contact", status: "pass", reason: "Not on a suppression list; no opt-outs recorded." },
  { check: "Hard disqualifiers", status: "pass", reason: "Inside served markets and above the minimum size." },
  { check: "Data coverage", status: "pass", reason: coverage },
  { check: "Data freshness", status: "pass", reason: freshness },
  { check: "Entity resolution", status: "pass", reason: entity },
] as const;

export const LEAD_QUALIFIER_SAMPLE: QualifierRun = {
  run_id: "run_01HX4QJ7",
  summary: "Six accounts checked: one is ready, two need a reviewer to confirm fit, and three are excluded with a reason.",
  shortlist: [
    {
      account: "Meridian",
      domain: "meridian.example",
      fit_score: 88,
      confidence: "high",
      status: "review",
      review_reason: "Enterprise tier (about 1,400 employees): confirm fit before outreach.",
      criteria: [
        { criterion: "Industry / segment", score: 25, max: 25, evidence: "B2B logistics software, matching the target segment.", source: "meridian.example/about", source_date: "2026-09-02", verified: true },
        { criterion: "Company size", score: 20, max: 20, evidence: "About 1,400 employees in the FY2025 annual report.", source: "Registry filing · FY2025", source_date: "2026-06-30", verified: true },
        { criterion: "Geography / markets", score: 15, max: 15, evidence: "Offices in Tokyo, Singapore and Seoul.", source: "meridian.example/offices", source_date: "2026-09-02", verified: true },
        { criterion: "Use-case fit", score: 20, max: 25, evidence: "Job postings describe manual invoice and order reconciliation.", source: "meridian.example/careers", source_date: "2026-09-18", verified: false },
        { criterion: "Buying environment", score: 8, max: 15, evidence: "Central procurement with an annual vendor review.", source: "meridian.example/suppliers", source_date: "2026-04-11", verified: true },
      ],
      intent_signals: [{ signal: "Hiring two revenue operations roles", source: "meridian.example/careers", date: "2026-09-18" }],
      checks: ALL_CLEAR("All five criteria have evidence.", "Every source is from the last 12 months.", "Domain, registry number and offices agree."),
      fit_notes: "Strong segment and market match with a clear reconciliation problem. The main risk is a central procurement cycle that may slow a first deal.",
      suggested_next_action: "Reviewer confirms enterprise fit, then assigns an owner for the first conversation.",
    },
    {
      account: "Aster Labs",
      domain: "asterlabs.example",
      fit_score: 92,
      confidence: "high",
      status: "ready",
      review_reason: "",
      criteria: [
        { criterion: "Industry / segment", score: 25, max: 25, evidence: "Applied research services for manufacturers.", source: "asterlabs.example", source_date: "2026-10-01", verified: true },
        { criterion: "Company size", score: 18, max: 20, evidence: "About 240 employees in the latest filing.", source: "Registry filing · FY2025", source_date: "2026-05-15", verified: true },
        { criterion: "Geography / markets", score: 15, max: 15, evidence: "Headquartered in Osaka, serving Japan and Taiwan.", source: "asterlabs.example/company", source_date: "2026-10-01", verified: true },
        { criterion: "Use-case fit", score: 22, max: 25, evidence: "Public statement on automating supplier onboarding.", source: "asterlabs.example/news", source_date: "2026-08-20", verified: true },
        { criterion: "Buying environment", score: 12, max: 15, evidence: "Uses a cloud accounting stack; team-level purchasing.", source: "asterlabs.example/careers", source_date: "2026-09-05", verified: false },
      ],
      intent_signals: [{ signal: "Announced expansion into Taiwan", source: "asterlabs.example/news", date: "2026-08-20" }],
      checks: ALL_CLEAR("All five criteria have evidence.", "Every source is from the last 12 months.", "Domain and registry number agree."),
      fit_notes: "Mid-size, in-market and already talking publicly about the problem we solve. The buying environment is inferred from job postings.",
      suggested_next_action: "Add to this week’s shortlist for the account owner to review.",
    },
    {
      account: "Hoshi Energy",
      domain: "hoshienergy.example",
      fit_score: 74,
      confidence: "medium",
      status: "review",
      review_reason: "Size data is from July 2024; the buying environment could not be checked.",
      criteria: [
        { criterion: "Industry / segment", score: 25, max: 25, evidence: "Energy services for commercial buildings.", source: "hoshienergy.example", source_date: "2026-09-28", verified: true },
        { criterion: "Company size", score: 16, max: 20, evidence: "About 600 employees in a 2024 filing.", source: "Registry filing · FY2023", source_date: "2024-07-10", verified: true },
        { criterion: "Geography / markets", score: 15, max: 15, evidence: "Operates in Japan and the Philippines.", source: "hoshienergy.example/locations", source_date: "2026-09-28", verified: true },
        { criterion: "Use-case fit", score: 18, max: 25, evidence: "Careers page lists a finance operations analyst role.", source: "hoshienergy.example/careers", source_date: "2026-10-03", verified: false },
        { criterion: "Buying environment", score: 0, max: 15, evidence: "No public stack or procurement signals found.", source: "—", source_date: "—", verified: false, could_not_check: true },
      ],
      intent_signals: [],
      checks: [
        { check: "CRM duplicate", status: "pass", reason: "No account, open opportunity or owner in the CRM." },
        { check: "Do-not-contact", status: "pass", reason: "Not on a suppression list; no opt-outs recorded." },
        { check: "Hard disqualifiers", status: "pass", reason: "Inside served markets and above the minimum size." },
        { check: "Data coverage", status: "pass", reason: "Four of five criteria have evidence." },
        { check: "Data freshness", status: "warn", reason: "Size comes from a July 2024 filing, older than 12 months." },
        { check: "Entity resolution", status: "pass", reason: "Domain and registry number agree." },
      ],
      fit_notes: "Good segment and market match. Size may have changed since the 2024 filing, and nothing is known about how they buy.",
      suggested_next_action: "Reviewer confirms current size before the account is shortlisted.",
    },
  ],
  excluded: [
    { account: "Kanso Studio", reason: "Existing customer with an assigned owner: routed to the owner, not a new lead." },
    { account: "Toki Electric", reason: "Do-not-contact: opted out of outreach in March 2026." },
    { account: "Sora Freight", reason: "Hard disqualifier: operates outside served markets." },
  ],
  audit: {
    tools_called: ["crm.search_accounts", "crm.check_suppression", "web.fetch"],
    sources_checked: ["CRM", "Suppression list", "Company websites", "Registry filings", "Job postings"],
    checked_at: "2026-10-14 09:12 JST",
  },
};
