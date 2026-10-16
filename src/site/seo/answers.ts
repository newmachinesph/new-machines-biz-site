import { SITE } from "@/site/copy";
import { FOLLOWING_HUBS_TEXT } from "@/site/hubs";
import type { FaqItem } from "./schema";

/** Answer-first copy: the one-sentence definition and the FAQ sets for the company pages.
 *  Rules: same register as HOME_COPY (Japan and Asia-Pacific, agents are chosen or assigned, only people are hired,
 *  demo and pre-launch things are labelled, no model or integration vendors named). Each FAQ answer is 40–60 words and
 *  consistent with orchestration/PRODUCT.md and intent.md. The FAQPage JSON-LD repeats this text exactly. */

export const DEFINITION = {
  eyebrow: "In one sentence",
  question: "What is New Machines?",
  answer:
    "New Machines is a marketplace where businesses choose Workflow Packs and the AI agents inside them for defined back-office work, bring in qualified human reviewers where judgment is needed, and accept each outcome with the evidence attached. It is built for Japan and Asia-Pacific and is pre-launch: any app can run on simulated data, and billing is shown, not collected.",
  facts: [
    { term: "Status", detail: "Pre-launch. Working product; billing shown, not collected." },
    { term: "Market", detail: "Japan first, then Asia-Pacific." },
    { term: "Languages", detail: "日本語 and English, in the workspace too." },
    { term: "Listings", detail: "Workflow Packs and agents. Eight platform packs today." },
    { term: "Page updated", detail: SITE.updated },
  ],
} as const;

export type FaqSet = Readonly<{ id: string; eyebrow: string; lead: string; tail: string; items: readonly FaqItem[] }>;

export const PRODUCT_FAQ: FaqSet = {
  id: "product-faq-title",
  eyebrow: "Questions",
  lead: "How New Machines",
  tail: "works.",
  items: [
    { q: "What does New Machines do?", a: "New Machines is a marketplace for verified intelligent work. A business chooses a Workflow Pack, runs it on its own apps or on simulated data, and approves every write before it happens. Qualified people review where judgment is needed, spending stays inside caps, and every outcome arrives with a work receipt and its evidence." },
    { q: "How do AI agents and human reviewers work together?", a: "Agents carry out the defined steps: reading inputs, drafting outputs and running checks. When a pack needs judgment, a review task goes to your own team or to the New Machines reviewer network, which sees a redacted copy. The reviewer’s verdict, corrections and feedback are recorded, and the run resumes from its checkpoint." },
    { q: "Which business tools and data can agents use?", a: "Gmail, Google Calendar, Google Docs, Google Sheets, Shopify and Stripe connect today, and a business can add its own MCP server. Each pack states what it reads and what it can change. Reads run freely; writes wait for a person to approve the exact action. Connected data is never used to train models." },
    { q: "Can I try a pack before connecting my systems?", a: "Yes. Add any pack and switch its apps to simulated data: the run is real, nothing reaches your accounts, and any write lands in the sandbox. Every pack page also shows a short preview on sample data. Connect a real account later, one app at a time, when you are ready." },
    { q: "Is New Machines available now, and what does it cost?", a: "The product is pre-launch and working: eight platform packs, approvals, work receipts, spending caps and the Developer Studio. Each pack shows an estimate per run in USD, such as $0.80 to $3.00 of AI work. Billing is simulated during pre-launch: costs are shown, but no money moves." },
    { q: "How is security handled?", a: "Trust boundaries are enforced in code, not in prompts. Every tool call is checked against the pack’s contract, your connections and policy before it runs, and tools that delete records or move money are never offered. Customer data is stored in Mumbai on Google Cloud; AI model requests are not pinned to a region. No third-party certification yet." },
    { q: "Where does New Machines operate?", a: `New Machines is built for Japan first and for Asia-Pacific next, and the whole workspace is available in 日本語 and English. Customer data is stored in Mumbai today. Reviewer onboarding and the first commercial beta start in Japan; the hubs that follow are ${FOLLOWING_HUBS_TEXT}.` },
  ],
};

export const TRUST_FAQ: FaqSet = {
  id: "trust-faq-title",
  eyebrow: "Questions",
  lead: "About trust",
  tail: "and security.",
  items: [
    { q: "Can an AI agent approve its own work?", a: "No. Judgment, policy, approval, execution, verification, acceptance and settlement are separate responsibilities with separate records. An evaluator’s recommendation is advisory and no confidence score authorises anything; policy decides what is allowed, a person approves each write, and independent checks confirm the result. A returned success flag never counts as proof." },
    { q: "Where is my data hosted and who can see it?", a: "Customer data is stored and processed in Mumbai (asia-south1) on Google Cloud; AI model requests are not pinned to a region, and per-organisation regions are planned. Connected data is read within the access you grant, for the work you asked for. It is never used to train models, and publishers never see customer data." },
    { q: "What do human reviewers see?", a: "Only the task. Network reviewers get a redacted copy with no workspace name, emails or phone numbers, and only while their hold lasts. You choose whether a pack’s reviews go to your own team, to the network, or to your team first. Each verdict and its written feedback are recorded as evidence." },
    { q: "Is simulated data really isolated from my live systems?", a: "Yes. An app switched to simulated data uses sandbox records and inert write tools, so it cannot reach production credentials or change live systems. The evidence page says which reads and writes landed on sandbox data. Each pack page also offers a short preview on sample data, which is a scripted playback, not a run." },
    { q: "Does New Machines hold a security certification?", a: "Not yet. New Machines is pre-launch and has not earned a third-party security certification. The controls described on this page are enforced in the product today; an independent assessment is planned before commercial launch, and its scope and result will be stated here. No listing claims universal safety or guaranteed accuracy." },
    { q: "How do I report a vulnerability?", a: `Write to ${SITE.securityEmail} and we will acknowledge it as soon as we can. Include what you found, where, and how to reproduce it. Privileged access on the platform is logged, never implicit, and evidence records are append-only with correlation IDs from the web request to the connector call, which helps us investigate quickly.` },
  ],
};

export const DEVELOPERS_FAQ: FaqSet = {
  id: "developers-faq-title",
  eyebrow: "Questions",
  lead: "About publishing",
  tail: "on New Machines.",
  items: [
    { q: "Who can publish agents on New Machines today?", a: "Any workspace whose owner or admin turns on publishing in Settings. You then submit an agent or a pack from the Developer Studio, with a price per call or per run. Automatic checks run first, and New Machines reviews every version before it is listed. Packs that use your own MCP server stay private." },
    { q: "Which frameworks and protocols are supported?", a: "Agents are defined in the Developer Studio and run on Google’s Agent Development Kit today; agents built with other frameworks, or your own deployed code, will follow through adapters. Apps connect through the integration layer, and your own systems through MCP with a token. Workflows run on a durable engine that survives restarts." },
    { q: "What is a Trust Passport?", a: "A planned record of measured results for one exact version of a listing. It is not built yet: live listings carry no Trust Passport, and the demo workspace shows only a labelled sample. Today a platform pack is marked Certified, and every submitted version passes automatic checks and a review by New Machines." },
    { q: "How do publishers get paid?", a: "You set a price per run for a pack or per call for an agent. The publisher keeps 80% and New Machines 20%, and each fee is itemised on the buyer’s work receipt. During pre-launch, fees, earnings and payouts are simulated: the Publisher page shows them, but no money moves." },
    { q: "Can a published version change after buyers install it?", a: "No. A submitted version is fixed, and a workspace that adds it is pinned to that version. A new version is a new release that goes through review again. Updates reach a buyer only after they approve them, and a running workflow keeps the version it started with." },
  ],
};

export const WORK_FAQ: FaqSet = {
  id: "work-faq-title",
  eyebrow: "Questions",
  lead: "About reviewing",
  tail: "for New Machines.",
  items: [
    { q: "How do I become a reviewer?", a: "Sign in to New Machines, open the reviewer portal and turn on Review for the network, with your languages and skills. Customers never see your profile. During pre-launch we also take applications by email, Japan and Asia-Pacific first. Identity and credential checks are planned before paid work opens." },
    { q: "How and when are reviewers paid?", a: "Network tasks show their pay, time and due date before you claim them, and pay is owed once your submission is accepted, even if a later automated step fails. During pre-launch that pay is simulated: no money moves. Reviews you do for your own workspace’s team are unpaid." },
    { q: "What kind of work do reviewers do?", a: "Review with a verdict, today. You check what the agents prepared, make a call on each record, write feedback, and approve as is, send back with corrections, reject or escalate. The run resumes from its checkpoint with your corrections. Evaluation, execution, expert review and quality audit are planned modes." },
    { q: "What data will I see as a reviewer?", a: "Only what the task needs. Network tasks arrive as a redacted copy with no workspace name, emails or phone numbers, and buyer names are hidden. You see the records only while your hold lasts, never unrelated customer records or an organisation’s wider memory, and your work is covered by confidentiality terms." },
    { q: "What happens if a decision is disputed?", a: "Your verdict and written feedback are recorded as part of the evidence, so there is a clear record of what you saw and decided. A route to appeal is planned. A timed hold means one task has one reviewer at a time: if your hold runs out, the task goes back to the queue." },
  ],
};

export const ABOUT_FAQ: FaqSet = {
  id: "about-faq-title",
  eyebrow: "Questions",
  lead: "About",
  tail: "New Machines.",
  items: [
    { q: "What stage is New Machines at?", a: "Pre-launch, with a working product: eight platform Workflow Packs including an order-to-cash exception desk, your approvals and qualified reviewers, work receipts, spending caps, connectors, the Developer Studio and a workspace in 日本語 and English. Billing is shown, not collected. Next is a commercial beta, Japan first, then an open marketplace." },
    { q: "Who is New Machines for?", a: "Operations owners and team leads at digitally enabled businesses: repetitive back-office work, existing spreadsheets and SaaS tools, little time to build automations, and a need for reliable exception handling. Qualified reviewers who want paid judgment work and developers with agents or Workflow Packs to publish are the other two groups." },
    { q: "Why Japan and Asia-Pacific first?", a: `The go-to-market is focused on purpose: Japan is the launch market, with the workspace in 日本語 and English, support and qualified language review, and the hubs that follow are ${FOLLOWING_HUBS_TEXT}. The architecture is global; the first release does not attempt every market or vertical at once.` },
    { q: "What makes New Machines different from an AI automation tool?", a: "It sells completed, verified work rather than prompts or a builder. Judgment, policy, approval, execution, verification, acceptance and settlement are kept separate, qualified people are first-class participants rather than a fallback, and every outcome carries evidence a colleague or an auditor can inspect. A generated response is not accepted work." },
    { q: "How can I get in touch?", a: `Email ${SITE.email}, in 日本語 or English. Businesses can start on simulated data in their own workspace or describe the work they need done; reviewers can apply to review; developers can turn on publishing in their workspace. Security reports go to ${SITE.securityEmail}. Press and investor enquiries use the main address with the subject marked.` },
  ],
};

export const SEO_FAQ_SETS: readonly FaqSet[] = [PRODUCT_FAQ, TRUST_FAQ, DEVELOPERS_FAQ, WORK_FAQ, ABOUT_FAQ];
