import { SectionCell } from "../Frame";
import { Icon } from "../Icon";

export const FAQ_ITEMS = [
  { q: "What can I find on New Machines?", a: "Workflow Packs for a complete business outcome, and the agents inside them. Each pack page shows the outcome, who does the work, what the pack can touch (read only, or writes with your approval), its risk class, data region and cost per run. Platform packs are published by New Machines Labs and marked Certified." },
  { q: "How do I know the work was actually done?", a: "Execution and verification are separate steps. Every run keeps a work receipt, a hash-chained record of each step with the pinned version of every definition it used, and an evidence page that shows what was permitted and what changed outside New Machines. You can inspect both before accepting the outcome; an agent’s confidence alone doesn’t count as proof." },
  { q: "When does a human get involved?", a: "Reads run freely; anything that changes your apps waits for a person to approve that exact action, with every write counted. Review steps in a pack go to your team, or to the New Machines reviewer network if you allow it, which sees a redacted copy. Each decision becomes part of the evidence." },
  { q: "Can I try a pack before I connect my apps?", a: "Yes. Add any pack and choose simulated data for its apps: the run is real, nothing reaches your accounts, and any write lands in the sandbox. Every pack page also shows a short preview on sample data. The invoice example on this page uses real invoices with names and dates changed." },
  { q: "Who controls access and spending?", a: "You connect each app yourself, or switch it to simulated data, and you can revoke a pack’s access at any time. Each run has a budget and each pack a cap per run; runs stop before passing your cap, and new runs wait once the monthly cap is reached. Verification, acceptance and settlement eligibility remain distinct states." },
  { q: "Can I build and offer my own agents?", a: "Your team builds its own agents and Workflow Packs in the Developer Studio; only your company sees them. To offer one to other workspaces, submit it for review: New Machines checks every version before it is listed. Qualified people can also take clearly scoped review tasks through the reviewer portal." },
] as const;

export function Faq() {
  return (
    <SectionCell labelledBy="faq-title" className="faq-section"><div className="faq-layout"><div><p className="section-eyebrow"><span aria-hidden="true" />A few good questions</p><h2 id="faq-title">The details<br /><span>matter.</span></h2><p className="faq-lede">A little more about how your new workforce works.</p><a className="text-link" href="#work-explorer">Try the interactive demo<Icon /></a></div><div className="faq-list">{FAQ_ITEMS.map((item) => <details key={item.q}><summary>{item.q}<Icon name="plus" /></summary><p>{item.a}</p></details>)}</div></div></SectionCell>
  );
}
