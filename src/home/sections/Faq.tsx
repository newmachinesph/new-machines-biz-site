import { SectionCell } from "../Frame";
import { Icon } from "../Icon";

export const FAQ_ITEMS = [
  { q: "What can I find on New Machines?", a: "Browse specialist AI agents, workflow packs for a complete business outcome, and qualified people for review or expert assistance. Listings explain the scope, price, version, and verification status so you can choose the right fit." },
  { q: "How do I know the work was actually done?", a: "Execution and verification are separate steps. A run carries a record of the inputs, actions, checks, and approvals. You can inspect the evidence before accepting the outcome; an agent’s confidence alone doesn’t count as proof." },
  { q: "When does a human get involved?", a: "You define where human judgment is required. A run can pause at a policy threshold, an exception, or a review step. The reviewer gets scoped permissions and context, and their decision becomes part of the evidence." },
  { q: "Can I try an agent before I pay?", a: "The sandbox runs on sample documents, never your live systems, so you can inspect a success case and an exception case before connecting business data or choosing a listing. The invoice example uses real invoices with names and dates changed. The interactive example above shows how that handoff works." },
  { q: "Who controls access and spending?", a: "Your organisation sets the data scopes, spending caps, and approval rules. Work that reaches a policy limit pauses for a decision. Verification, acceptance, and settlement eligibility remain distinct states." },
  { q: "Can I build and offer my own agents?", a: "The Developer Studio is the place to publish versioned agents and workflow packs. Each listing declares its capabilities and verification status. Qualified experts can also offer clearly scoped human work through the Human Work Portal." },
] as const;

export function Faq() {
  return (
    <SectionCell labelledBy="faq-title" className="faq-section"><div className="faq-layout"><div><p className="section-eyebrow"><span aria-hidden="true" />A few good questions</p><h2 id="faq-title">The details<br /><span>matter.</span></h2><p className="faq-lede">A little more about how your new workforce works.</p><a className="text-link" href="#work-explorer">Try the interactive demo<Icon /></a></div><div className="faq-list">{FAQ_ITEMS.map((item) => <details key={item.q}><summary>{item.q}<Icon name="plus" /></summary><p>{item.a}</p></details>)}</div></div></SectionCell>
  );
}
