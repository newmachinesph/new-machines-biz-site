import { SectionCell } from "../Frame";
import { Icon } from "../Icon";
import Image from "next/image";
import { ConnectedWork } from "../mockups/ConnectedWork";
import { MotionItem } from "@/design-system/motion/MotionItem";

const TOOLS = [
  { name: "Google Drive", icon: "google-drive-official", detail: "Files & documents" },
  { name: "Google Sheets", icon: "google-sheets-official", detail: "Structured work data" },
  { name: "Gmail", icon: "gmail-official", detail: "Business conversations" },
  { name: "Google Calendar", icon: "google-calendar-official", detail: "Scheduling & meetings" },
  { name: "LINE WORKS", icon: "lineworks-official", detail: "Team communication" },
  { name: "Kintone", icon: "kintone-official", detail: "Business applications" },
  { name: "freee", icon: "freee-official", detail: "Accounting & finance" },
  { name: "SmartHR", icon: "smarthr-official", detail: "People & operations" },
] as const;

export function Integrations() {
  return (
    <SectionCell labelledBy="integrations-title" className="integrations-section">
      <div className="section-opener"><div><p className="section-eyebrow"><span aria-hidden="true" />Connected work</p><h2 id="integrations-title">Your tools.<br /><span>A shared workforce.</span></h2></div><div><p>Work starts where your business already lives. Connect the context your agents need, with permissions you control.</p><a href="#work-explorer" className="text-link">See connected work in action<Icon /></a></div></div>
      <MotionItem className="connected-work-frame"><ConnectedWork /></MotionItem>
      <div className="integration-system"><div className="integration-grid">{TOOLS.map((tool) => <div className="integration-tool" key={tool.name}><span className="tool-mark" aria-hidden="true"><Image src={`/brands/${tool.icon}.svg`} width={24} height={24} alt="" /></span><div><h3>{tool.name}</h3><p>{tool.detail}</p></div></div>)}</div></div>
      <div className="integration-footnote"><span>Illustrative integration ecosystem</span><span>Built for permissioned access. Designed to keep a record.</span></div>
    </SectionCell>
  );
}
