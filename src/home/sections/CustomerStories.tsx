import { ExampleBrand } from "../ExampleBrand";
import { SectionCell } from "../Frame";
import { Icon } from "../Icon";
import { AgentPortrait } from "../mockups/AgentPortrait";
import Link from "next/link";
import Image from "next/image";
import { AccountResearchIllustration } from "../mockups/AccountResearchIllustration";

export function CustomerStories() {
  return (
    <SectionCell id="customer-stories" labelledBy="stories-title" className="stories-section">
      <div className="section-opener">
        <div><p className="section-eyebrow"><span aria-hidden="true" />Work worth talking about</p><h2 id="stories-title">Big ambitions.<br /><span>Better ways to work.</span></h2></div>
        <p>Follow an invoice through the close, or an account through the research. See where agents help and people decide.</p>
      </div>
      <div className="story-grid">
        <Link className="story-card story-finance" href="/?workflow=finance#work-explorer">
          <div className="story-art finance-art" aria-hidden="true">
            <Image src="/editorial/tokyo-light-trails.jpg" fill sizes="(min-width: 1280px) 600px, (min-width: 768px) 45vw, 90vw" alt="" className="story-photograph" />
            <div className="story-sheet">
              <div className="sheet-letterhead"><ExampleBrand name="aster-supply" /><strong>Aster Supply</strong><span>OCT / 2026</span></div>
              <div className="sheet-heading">All accounted for.<Icon name="check" /></div>
              {["Supplier invoices", "Purchase orders", "Tax exceptions", "Approval record"].map((label) => <div className="sheet-row" key={label}><Icon name="file" /><span>{label}</span><Icon name="check" /></div>)}
              <div className="sheet-proof"><AgentPortrait kind="human" /><span>M. Tanaka<small>Reviewed with evidence</small></span><Icon name="shield" /></div>
            </div>
          </div>
          <div className="story-content"><span className="micro-label">Finance & operations / Workflow story</span><h3>A calmer close.<br />A clearer audit trail.</h3><p>Match invoices, resolve exceptions, and keep the evidence together from the first input to the final approval.</p><span className="text-link">Explore the finance workflow<Icon /></span></div>
        </Link>
        <Link className="story-card story-sales" href="/?workflow=sales#work-explorer">
          <div className="story-art sales-art" aria-hidden="true">
            <AccountResearchIllustration />
            <span className="sales-art-label">RESEARCH → REVIEW → CONVERSATION</span>
          </div>
          <div className="story-content"><span className="micro-label">Sales & growth / Workflow story</span><h3>Let your team<br />get back to selling.</h3><p>Bring the account context and qualified shortlist to your team. Give them a better place to start the conversation.</p><span className="text-link">Explore the sales workflow<Icon /></span></div>
        </Link>
      </div>
      <p className="story-note">Workflow examples · Fictional organisations and synthetic data</p>
    </SectionCell>
  );
}
