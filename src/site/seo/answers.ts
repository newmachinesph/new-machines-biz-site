import { SITE } from "@/site/copy";
import type { FaqItem } from "./schema";

/** Answer-first copy: the one-sentence definition and the FAQ sets for the company pages.
 *  Rules: same register as HOME_COPY (Japan and Asia-Pacific, agents are chosen or assigned, only people are hired,
 *  demo and pre-launch things are labelled, no model or integration vendors named). Each FAQ answer is 40–60 words and
 *  consistent with orchestration/PRODUCT.md and intent.md. The FAQPage JSON-LD repeats this text exactly. */

export const DEFINITION = {
  eyebrow: "In one sentence",
  question: "What is New Machines?",
  answer:
    "New Machines is a marketplace where businesses choose AI agents and workflow packs for defined back-office work, bring in qualified human reviewers where judgment is needed, and accept each outcome with the evidence attached. It is built for Japan and Asia-Pacific and is pre-launch: the sandbox runs on sample data and billing is shown, not collected.",
  facts: [
    { term: "Status", detail: "Pre-launch. Working product; billing shown, not collected." },
    { term: "Market", detail: "Japan first, then Asia-Pacific." },
    { term: "Languages", detail: "日本語 and English." },
    { term: "Listings", detail: "AI agents, workflow packs and qualified human work. Demo catalogue today." },
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
    { q: "What does New Machines do?", a: "New Machines is a marketplace for verified intelligent work. A business chooses an AI agent or a workflow pack, tries it on sample data in the sandbox, sets spending caps and review rules, then runs it. Qualified people decide wherever judgment is needed, and every outcome arrives with its evidence attached." },
    { q: "How do AI agents and human reviewers work together?", a: "Agents carry out the defined task: reading inputs, drafting outputs and running checks. Where your policy requires judgment, the run pauses and a qualified reviewer receives a scoped, redacted task with the context it needs. Their decision, reason and timestamp become part of the run’s evidence before work continues." },
    { q: "Which business tools and data can agents use?", a: "Each listing states which tools it reads from and writes to and the permissions it requests. Your organisation connects a tool once and grants each agent only the scopes its task needs. Connected data is used for the work you asked for, never to train models, and access can be revoked mid-run." },
    { q: "Can I try an agent before connecting my systems?", a: "Yes. Every listing runs in the sandbox on sample data, isolated from your live systems and credentials, with inert write tools. You compare the success case and the exception case, read each check, and only then connect your tools. The invoice example uses real invoices with names and dates changed." },
    { q: "Is New Machines available now, and what does it cost?", a: "The product is pre-launch. The sandbox is free, and the catalogue, workflow packs, approvals, work receipts, spending caps and operator console work today. Prices in the product are illustrative demo values in Japanese yen; spend is shown but no payment is collected until billing starts. Final prices are set at launch." },
    { q: "How is security handled?", a: "Trust boundaries are enforced in code, not in prompts. Every agent installation has its own identity, permissions and memory scope; a gateway checks tenant, contract, policy and connector scope before any tool call runs. Data is hosted on Google Cloud in Asia-Pacific, encrypted in transit and at rest. No third-party certification yet." },
    { q: "Where does New Machines operate?", a: "New Machines is built for Japan first and for Asia-Pacific next, with documentation and support in 日本語 and English. Reviewer onboarding and the first commercial beta start in Japan; the hubs that follow are Seoul, Singapore, Manila, Sydney and Bengaluru. Reviewer matching respects the languages and jurisdictions you allow." },
  ],
};

export const TRUST_FAQ: FaqSet = {
  id: "trust-faq-title",
  eyebrow: "Questions",
  lead: "About trust",
  tail: "and security.",
  items: [
    { q: "Can an AI agent approve its own work?", a: "No. Judgment, policy, approval, execution, verification, acceptance and settlement are separate responsibilities with separate records. A model’s recommendation is advisory; your organisation’s policy decides what is allowed, a qualified person grants any required approval, and independent verification confirms what happened. A returned success flag never counts as proof." },
    { q: "Where is my data hosted and who can see it?", a: "Data is hosted on Google Cloud in Asia-Pacific, encrypted in transit and at rest; per-organisation workspace regions are planned. Connected data is read within the scopes you grant, for the work you asked for. It is never used to train models or shared across organisations, and publishers never see customer data, credentials or run history." },
    { q: "What do human reviewers see?", a: "Only the task. Reviewers receive task-scoped, redacted records with the context the task needs and nothing more, and only if they meet the qualification, language and jurisdiction rules your organisation sets. External reviewers work under confidentiality terms, and their decision and written reason are recorded as part of the evidence." },
    { q: "Is the sandbox really isolated from my live systems?", a: "Yes. Sandbox runs use sample or expressly approved data and inert write tools. They cannot reach production credentials or change live systems. The invoice example runs on real invoices with names and dates changed. You see the success case and the exception case before any connector is granted to a listing." },
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
    { q: "Who can publish agents on New Machines today?", a: "Publishing is invitation-only during pre-launch: the catalogue is curated and first-party. Developers with a versioned agent or workflow pack can request publisher access by email, and reviewed third-party publishers are planned for the commercial beta. Every listing is a versioned manifest with capabilities, schemas, permissions, pricing basis and test cases." },
    { q: "Which frameworks and protocols are supported?", a: "Agents built with Google’s Agent Development Kit are supported today; other frameworks follow through adapters. Tools connect through the Model Context Protocol, and workflows run on a durable engine that survives restarts and long human waits. You write the agent; authorisation, isolation, metering and evidence are the platform’s job." },
    { q: "What is a Trust Passport?", a: "The Trust Passport records the results of the publishing review’s sandbox tests for one exact version: function, schema compatibility, prompt injection, privacy, connector authorisation and recovery. Results are labelled as measured or as sample until measured on real work. A publisher’s own demonstration is never presented as certification." },
    { q: "How do publishers get paid?", a: "Through a revenue share of each verified run or pack subscription. Usage is metered per run at the price version it was listed at, and settlement follows the work contract, not a success flag. Rates are illustrative until launch; publishers with a measured Trust Passport are planned to pay a lower platform fee." },
    { q: "Can a published version change after buyers install it?", a: "No. Once a version is submitted nothing changes; trust evidence is attached to the exact version a buyer installs. A new version is a new release, and a running workflow keeps the version it started with. You can deprecate or supersede a version with a later release at any time." },
  ],
};

export const WORK_FAQ: FaqSet = {
  id: "work-faq-title",
  eyebrow: "Questions",
  lead: "About reviewing",
  tail: "for New Machines.",
  items: [
    { q: "How do I become a reviewer?", a: "Reviewer onboarding is invitation-based during pre-launch, Japan and Asia-Pacific first. Apply by email with your skills, languages and the jurisdictions you can work in. Identity and credential verification is planned before paid work opens, and tasks are matched to the qualification, language and jurisdiction rules each organisation sets." },
    { q: "How and when are reviewers paid?", a: "Pay is per task and shown on the task card, with the deadline and criteria, before you accept. Earnings are recorded against your task agreement when your submission is validated. Correctly performed work is payable even if a later automated step fails. During pre-launch, earnings are simulated and labelled as such." },
    { q: "What kind of work do reviewers do?", a: "Six modes, each with its own instructions, submission schema and pay: approval, evaluation, correction, execution, expert review and quality audit. Human work is chosen for expertise and judgment, such as contracts in 日本語 and English, tax workings or payroll, not only for exceptions. Every assignment is a bounded task created exactly once." },
    { q: "What data will I see as a reviewer?", a: "Only what the task needs. You work on redacted, task-scoped records with the context the task requires, never unrelated customer records or an organisation’s wider memory. Tasks are offered only where you meet the qualification, language and jurisdiction rules the organisation set, and your work is covered by confidentiality terms." },
    { q: "What happens if a decision is disputed?", a: "Your decision and written reason are recorded as part of the evidence, so there is a clear record of what you saw and decided. A route to appeal is planned: disputed decisions will go to a separate review with the evidence on both sides. Leases and atomic assignment mean two people are never blamed for the same task." },
  ],
};

export const ABOUT_FAQ: FaqSet = {
  id: "about-faq-title",
  eyebrow: "Questions",
  lead: "About",
  tail: "New Machines.",
  items: [
    { q: "What stage is New Machines at?", a: "Pre-launch, with a working product: a curated catalogue, workflow packs including an order-to-cash exception desk, the sandbox, approvals by qualified reviewers, work receipts, spending caps, connectors and an operator console. Billing is shown, not collected. Next is a commercial beta, Japan first, then an open marketplace across Asia-Pacific." },
    { q: "Who is New Machines for?", a: "Operations owners and team leads at digitally enabled businesses: repetitive back-office work, existing spreadsheets and SaaS tools, little time to build automations, and a need for reliable exception handling. Qualified reviewers who want paid judgment work and developers with versioned agents or workflow packs to publish are the other two groups." },
    { q: "Why Japan and Asia-Pacific first?", a: "The go-to-market is focused on purpose: Japan is the launch market, with 日本語 and English documentation, support and qualified language review, and the hubs that follow are Seoul, Singapore, Manila, Sydney and Bengaluru. The architecture is global; the first release does not attempt every market or vertical at once." },
    { q: "What makes New Machines different from an AI automation tool?", a: "It sells completed, verified work rather than prompts or a builder. Judgment, policy, approval, execution, verification, acceptance and settlement are kept separate, qualified people are first-class participants rather than a fallback, and every outcome carries evidence a colleague or an auditor can inspect. A generated response is not accepted work." },
    { q: "How can I get in touch?", a: `Email ${SITE.email}, in 日本語 or English. Businesses can start in the sandbox on sample data or describe the work they need done; reviewers can apply to review; developers can request publisher access. Security reports go to ${SITE.securityEmail}. Press and investor enquiries use the main address with the subject marked.` },
  ],
};

export const SEO_FAQ_SETS: readonly FaqSet[] = [PRODUCT_FAQ, TRUST_FAQ, DEVELOPERS_FAQ, WORK_FAQ, ABOUT_FAQ];
