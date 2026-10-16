import { SectionCell } from "../Frame";
import { Icon } from "../Icon";
import Image from "next/image";
import { ConnectedWork } from "../mockups/ConnectedWork";
import { MotionItem } from "@/design-system/motion/MotionItem";
import { MCP_ICON } from "../integrationCatalog";
import { IntegrationDirectory } from "./IntegrationDirectory";

/** The six apps that connect today, each to a real account or to simulated data. Logos from public/brands/connectors. */
const TOOLS = [
  { name: "Gmail", icon: "gmail", detail: "Enquiries, requests & drafts" },
  { name: "Google Calendar", icon: "googlecalendar", detail: "Meetings & guests" },
  { name: "Google Docs", icon: "googledocs", detail: "Documents" },
  { name: "Google Sheets", icon: "googlesheets", detail: "Logs, leads & ledgers" },
  { name: "Shopify", icon: "shopify", detail: "Orders & refunds" },
  { name: "Stripe", icon: "stripe", detail: "Payments & invoices" },
] as const;

export function Integrations() {
  return (
    <>
    <SectionCell labelledBy="integrations-title" className="integrations-section">
      <div className="section-opener"><div><p className="section-eyebrow"><span aria-hidden="true" />Connected work</p><h2 id="integrations-title">Your tools.<br /><span>A shared workforce.</span></h2></div><div><p>Six apps connect today. Sign in at each app’s own page, or switch it to simulated data, one app at a time. Reads run freely; writes wait for your approval; tools that delete records or move money are never offered.</p><a href="#work-explorer" className="text-link">See connected work in action<Icon /></a></div></div>
      <MotionItem className="connected-work-frame"><ConnectedWork /></MotionItem>
      <div className="integration-system"><div className="integration-grid">{TOOLS.map((tool) => <div className="integration-tool" key={tool.name}><span className="tool-mark" aria-hidden="true"><Image src={`/brands/connectors/${tool.icon}.svg`} width={24} height={24} alt="" /></span><div><h3>{tool.name}</h3><p>{tool.detail}</p></div></div>)}</div><div className="integration-custom" data-component="integrationCustomMcp"><span className="tool-mark" aria-hidden="true"><Image src={`/brands/connectors/${MCP_ICON}.svg`} width={22} height={22} alt="" /></span><div><h3>Your own MCP server</h3><p>Your own tools and data</p></div><p>Add an https address and a token. Its tools sort themselves: reads run freely, writes ask first, and anything that deletes data or moves money is blocked. Packs that use it stay private to your workspace.</p></div></div>
      <div className="integration-footnote"><span>Available today · Any other app: on request</span><span>New Machines never sees your passwords. Revoke a pack’s access at any time.</span></div>
    </SectionCell>
    {/* The full directory continues Integrations in the same frame (its heading is an h3 under it), kept outside that
        section so the section itself stays about a screen tall. A region with its own anchor, not a new page section. */}
    <div id="connectors" role="region" aria-labelledby="connectors-title" className="page-section bg-paper text-ink connectors-section">
      <div className="section-inner mx-auto w-full max-w-frame border-x border-b border-grey-200">
        <div className="integration-system connector-system"><IntegrationDirectory titleId="connectors-title" /></div>
      </div>
    </div>
    </>
  );
}
