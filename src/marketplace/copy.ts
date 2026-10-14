import { HOME_COPY } from "@/home/copy";
import type { DEMO_STEPS } from "@/home/mockups/data";
import type { Kind } from "./kinds";

/** Every string on /marketplace and /marketplace/[slug]. Same register as HOME_COPY: Japan and Asia-Pacific only. */
export const MARKETPLACE_COPY = {
  meta: {
    title: "Marketplace · New Machines",
    description: "Browse AI agents, workflow packs and qualified human work for Japan and Asia-Pacific. Every listing shows its scope, price and verification status.",
  },
  catalogue: {
    eyebrow: HOME_COPY.hire.eyebrow,
    lead: HOME_COPY.hire.lead,
    tail: HOME_COPY.hire.tail,
    sub: HOME_COPY.hire.sub,
    certifiedOnly: "Trust Passport only",
    searchLabel: "Search listings",
    searchPlaceholder: "Invoice, review, 日本語…",
    listingsLabel: "Marketplace listings",
    clearInline: "Clear",
    empty: "No listings match.",
    clear: "Clear filters",
    view: "View listing",
    closeSecondary: { href: "/#sandbox", label: "See the sandbox" },
  },
  listing: {
    back: "All listings",
    certified: "Trust Passport",
    notCertified: "Not yet certified",
    cta: { agent: "Try this agent", pack: "Try this pack", human: "Request this reviewer" } satisfies Record<Kind, string>,
    sandbox: "See it in the sandbox",
    scope: {
      eyebrow: "Scope",
      lead: "Clear inputs.",
      tail: "Inspectable outputs.",
      sub: "A versioned specialist with a written scope. What it reads, what it produces and where a person decides.",
      heading: "Scope of work",
      worksWith: "Works with",
      reviewer: "Assigned reviewer",
    },
    steps: {
      eyebrow: "How a run works",
      lead: HOME_COPY.how.lead,
      tail: HOME_COPY.how.tail,
      sub: "Each run follows the same path, and each step leaves a record you can inspect.",
      bodies: {
        "Read inputs": "The specialist reads only the files and records in its scope.",
        "Draft output": "It drafts the output and separates anything that needs a decision.",
        "Check policy": "Your spending cap and review rules are checked before anything moves.",
        "Human review": "A qualified person approves, edits or rejects, with a reason.",
        "Verify evidence": "The outcome, the approval and the files are kept together as evidence.",
      } satisfies Record<(typeof DEMO_STEPS)[number], string>,
    },
    evidence: {
      eyebrow: "Evidence",
      lead: "Every outcome.",
      tail: "With a record.",
      sub: "Approvals are logged as they happen, and the files follow the work. This is what a finished run looks like.",
      caption: "Sample approval log · synthetic data",
      note: "Synthetic data · No real actions or charges",
    },
    related: {
      eyebrow: "More like this",
      lead: "Related listings.",
      tail: "The same kind of work.",
      label: "Related listings",
    },
  },
} as const;
