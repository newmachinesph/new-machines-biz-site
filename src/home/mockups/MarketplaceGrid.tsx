"use client";

import { useState } from "react";
import { HomepageLink as Link } from "../HomepageLink";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Icon } from "../Icon";
import { DEMO_LISTINGS, KIND_LABEL, type DemoListing } from "./data";
import { AgentPortrait } from "./AgentPortrait";
import { Check } from "./parts";

const PORTRAITS = ["invoice", "pack", "human", "leads", "receipt", "support"] as const;
const FILTERS = [
  { label: "All talent", kind: "all" },
  { label: "AI agents", kind: "agent" },
  { label: "Workflow packs", kind: "pack" },
  { label: "Human work", kind: "human" },
] as const;

export function MarketplaceGrid({ className }: { className?: string }) {
  const [filter, setFilter] = useState<"all" | DemoListing["kind"]>("all");
  const [selected, setSelected] = useState(1);
  const listing = DEMO_LISTINGS[selected];
  function changeFilter(kind: typeof filter) {
    setFilter(kind);
    if (kind !== "all" && listing.kind !== kind) {
      setSelected(DEMO_LISTINGS.findIndex((item) => item.kind === kind));
    }
  }
  return (
    <div className={cn("talent-directory", className)}>
      <div className="directory-heading">
        <div><span className="scene-kicker">The marketplace</span><h3>A specialist for every task.</h3></div>
        <Icon name="grid" />
      </div>
      <div className="directory-filters" role="group" aria-label="Filter marketplace talent">
        {FILTERS.map((item) => <button key={item.kind} type="button" aria-pressed={filter === item.kind} onClick={() => changeFilter(item.kind)}>{item.label}</button>)}
      </div>
      <div className="directory-body">
        <ul className="talent-list" aria-label="Example marketplace listings">
          {DEMO_LISTINGS.map((item, index) => filter === "all" || filter === item.kind ? (
            <li key={item.title}>
              <button type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className="talent-row">
                <AgentPortrait kind={PORTRAITS[index]} />
                <span className="talent-row-copy"><strong>{item.title}</strong><span>{KIND_LABEL[item.kind]}<i aria-hidden="true">·</i>{item.certified ? <span className="listing-passport"><Check />Trust Passport</span> : <span>Not yet certified</span>}</span></span>
                <Icon />
              </button>
            </li>
          ) : null)}
        </ul>
        <div className="talent-detail">
          <AgentPortrait kind={PORTRAITS[selected]} className="portrait-large" />
          <span className="scene-kicker">{KIND_LABEL[listing.kind]}</span>
          <h4>{listing.title}</h4>
          <p>{listing.body}</p>
          <div className="detail-divider" />
          {listing.kind === "pack" ? <><span className="scene-kicker">Your workforce</span><div className="pack-members"><span><AgentPortrait kind="invoice" />Invoice matcher</span><span><AgentPortrait kind="receipt" />Receipt reconciler</span><span><AgentPortrait kind="human" />Qualified reviewer</span></div></> : <div className="specialist-scope"><span className="scene-kicker">Scope of work</span><p>{listing.kind === "human" ? "Bilingual review, with a recorded decision and scoped access." : "A versioned specialist, with clear inputs and inspectable outputs."}</p></div>}
          <div className="detail-apps"><span className="scene-kicker">Works with</span><span><Image src="/brands/google-drive-official.svg" alt="Google Drive" width={16} height={16} /><Image src="/brands/google-sheets-official.svg" alt="Google Sheets" width={16} height={16} /><Image src="/brands/gmail-official.svg" alt="Gmail" width={16} height={16} /></span></div>
          <div className="detail-price"><span>{listing.price}</span><Link href="#work-explorer" aria-label={`Explore ${listing.title}`}><Icon /></Link></div>
        </div>
      </div>
      <div className="directory-footer"><span>Versioned talent. Clearly scoped work.</span><Link href="/marketplace">Explore all listings<Icon /></Link></div>
    </div>
  );
}
