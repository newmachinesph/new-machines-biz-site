"use client";

import { useState } from "react";
import { HomepageLink as Link } from "../HomepageLink";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Icon } from "../Icon";
import { DEMO_LISTINGS, PACK_FUNCTIONS, type PackFunction } from "./data";
import { AgentPortrait } from "./AgentPortrait";
import { Check } from "./parts";

type Filter = "all" | PackFunction;
const FILTERS: readonly { label: string; value: Filter }[] = [{ label: "All packs", value: "all" }, ...PACK_FUNCTIONS.map((value) => ({ label: value, value }))];

export function MarketplaceGrid({ className }: { className?: string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState(1);
  const listing = DEMO_LISTINGS[selected];
  function changeFilter(value: Filter) {
    setFilter(value);
    if (value !== "all" && listing.function !== value) {
      setSelected(DEMO_LISTINGS.findIndex((item) => item.function === value));
    }
  }
  return (
    <div className={cn("talent-directory", className)}>
      <div className="directory-heading">
        <div><span className="scene-kicker">The marketplace</span><h3>A pack for every outcome.</h3></div>
        <Icon name="grid" />
      </div>
      <div className="directory-filters" role="group" aria-label="Filter Workflow Packs by function">
        {FILTERS.map((item) => <button key={item.value} type="button" aria-pressed={filter === item.value} onClick={() => changeFilter(item.value)}>{item.label}</button>)}
      </div>
      <div className="directory-body">
        <ul className="talent-list" aria-label="Platform Workflow Packs">
          {DEMO_LISTINGS.map((item, index) => filter === "all" || filter === item.function ? (
            <li key={item.slug}>
              <button type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className="talent-row">
                <AgentPortrait kind={item.portrait} />
                <span className="talent-row-copy"><strong>{item.title}</strong><span>{item.function}<i aria-hidden="true">·</i>{item.certified ? <span className="listing-passport"><Check />Certified</span> : <span>Not yet certified</span>}</span></span>
                <Icon />
              </button>
            </li>
          ) : null)}
        </ul>
        <div className="talent-detail">
          <AgentPortrait kind={listing.portrait} className="portrait-large" />
          <span className="scene-kicker">Workflow Pack · {listing.function}</span>
          <h4>{listing.title}</h4>
          <p>{listing.body}</p>
          <div className="detail-divider" />
          <span className="scene-kicker">Who does the work</span>
          <div className="pack-members">{listing.members.map((member) => <span key={member.name}><AgentPortrait kind={member.portrait} />{member.name}</span>)}</div>
          <div className="detail-apps"><span className="scene-kicker">Works with</span><span>{listing.apps.map((app) => <Image key={app.name} src={app.src} alt={app.name} title={app.name} width={16} height={16} />)}</span></div>
          <div className="detail-price"><span>{listing.price}</span><Link href="/marketplace" aria-label={`Explore ${listing.title} in the marketplace`}><Icon /></Link></div>
        </div>
      </div>
      <div className="directory-footer"><span>Pinned versions. Writes wait for your approval.</span><Link href="/marketplace">Explore all packs<Icon /></Link></div>
    </div>
  );
}
