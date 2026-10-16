"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { CATEGORIES, CONNECTORS, type Connector, type ConnectorCategory } from "../integrationCatalog";

type Filter = ConnectorCategory | "All";
const FILTERS: readonly Filter[] = ["All", ...CATEGORIES];
/** About four rows on desktop; the rest stays in the HTML (hidden) until "Show all". */
const COLLAPSED = 20;

/** Initials for brands without a Simple Icons mark: "Sigma Computing" → "SC", "Salesforce" → "S". */
export function monogram(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((word) => word[0]?.toUpperCase() ?? "").join("");
}

const matchesQuery = (connector: Connector, needle: string) => !needle || connector.name.toLowerCase().includes(needle) || connector.category.toLowerCase().includes(needle);

/** Every connector, searchable and filterable by category. All names are server-rendered; filtering only toggles `hidden`. */
export function IntegrationDirectory({ titleId }: { titleId: string }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const searchId = useId();
  const needle = query.trim().toLowerCase();
  const matches = CONNECTORS.filter((connector) => (filter === "All" || connector.category === filter) && matchesQuery(connector, needle));
  const narrowed = filter !== "All" || needle !== "";
  const collapsible = !narrowed && matches.length > COLLAPSED;
  const visible = new Set((collapsible && !expanded ? matches.slice(0, COLLAPSED) : matches).map((connector) => connector.name));
  return (
    <div className="connector-directory" data-component="integrationDirectory">
      <div className="connector-header">
        <div><span className="micro-label">All connectors</span><h3 id={titleId}>{CONNECTORS.length} business tools</h3></div>
        <label className="connector-search" htmlFor={searchId}>
          <span className="sr-only">Search connectors</span>
          <input id={searchId} type="search" placeholder="Search connectors" autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} data-component="integrationSearch" />
        </label>
      </div>
      <div className="connector-filters" role="group" aria-label="Filter connectors by category">
        {FILTERS.map((option) => <button type="button" key={option} aria-pressed={filter === option} onClick={() => setFilter(option)} data-component={"integrationCategory" + option.replace(/[^A-Za-z]/g, "")}>{option}</button>)}
      </div>
      <p className="sr-only" aria-live="polite">{matches.length === 1 ? "1 connector" : `${matches.length} connectors`}</p>
      <ul className="connector-grid">
        {CONNECTORS.map((connector) => <li key={connector.name} hidden={!visible.has(connector.name)}>
          <span className="connector-mark" aria-hidden="true">{/* Only visible tiles load a mark, so collapsed and filtered-out tiles never hold an unloaded image. */}
          {connector.icon && visible.has(connector.name) ? <Image src={`/brands/connectors/${connector.icon}.svg`} width={18} height={18} alt="" /> : connector.icon ? null : monogram(connector.name)}</span>
          <span><strong>{connector.name}</strong><small>{connector.category}</small></span>
        </li>)}
      </ul>
      {matches.length === 0 ? <p className="connector-empty">No connector matches “{query.trim()}”.</p> : null}
      <div className="connector-footer">
        <span>Connector availability varies by plan and region.</span>
        {collapsible ? <button type="button" className="text-link" aria-expanded={expanded} onClick={() => setExpanded(!expanded)} data-component="integrationShowAll">{expanded ? "Show fewer" : `Show all ${matches.length} connectors`}</button> : null}
      </div>
    </div>
  );
}
