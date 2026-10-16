"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { AVAILABLE_LABEL, CATEGORIES, CONNECTORS, ON_REQUEST_LABEL, ON_REQUEST_NOTE, availableSummary, type Connector, type ConnectorCategory } from "../integrationCatalog";

type Filter = ConnectorCategory | "All" | typeof AVAILABLE_LABEL;
const FILTERS: readonly Filter[] = ["All", AVAILABLE_LABEL, ...CATEGORIES];
/** About four rows on desktop. Any longer result renders on "Show all", so a one-letter search never puts a thousand tiles on the page. */
const COLLAPSED = 20;
const MARK_SIZE = 20;

/** "1,537" — the heading and the Show all button share the formatting. */
export const formatCount = (count: number): string => count.toLocaleString("en-US");

const matchesFilter = (connector: Connector, filter: Filter) => filter === "All" || (filter === AVAILABLE_LABEL ? connector.available : connector.category === filter);
const matchesQuery = (connector: Connector, needle: string) => !needle || connector.name.toLowerCase().includes(needle) || connector.category.toLowerCase().includes(needle);

/** Every connector, searchable and filterable by category or availability. Only the tiles in view are rendered,
 *  and each loads its own logo lazily at a fixed size. */
export function IntegrationDirectory({ titleId }: { titleId: string }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const searchId = useId();
  const needle = query.trim().toLowerCase();
  const matches = CONNECTORS.filter((connector) => matchesFilter(connector, filter) && matchesQuery(connector, needle));
  const collapsible = matches.length > COLLAPSED;
  const shown = collapsible && !expanded ? matches.slice(0, COLLAPSED) : matches;
  return (
    <div className="connector-directory" data-component="integrationDirectory">
      <div className="connector-header">
        <div><span className="micro-label">All connectors</span><h3 id={titleId}>{formatCount(CONNECTORS.length)} business tools</h3></div>
        <label className="connector-search" htmlFor={searchId}>
          <span className="sr-only">Search connectors</span>
          <input id={searchId} type="search" placeholder="Search connectors" autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} data-component="integrationSearch" />
        </label>
      </div>
      <div className="connector-filters" role="group" aria-label="Filter connectors by category">
        {FILTERS.map((option) => <button type="button" key={option} aria-pressed={filter === option} onClick={() => setFilter(option)} data-component={"integrationCategory" + option.replace(/[^A-Za-z]/g, "")}>{option}</button>)}
      </div>
      <p className="sr-only" aria-live="polite">{matches.length === 1 ? "1 connector" : `${formatCount(matches.length)} connectors`}</p>
      <ul className="connector-grid">
        {shown.map((connector) => <li key={connector.slug} data-available={connector.available || undefined}>
          <span className="connector-mark" aria-hidden="true"><Image src={connector.logo} width={MARK_SIZE} height={MARK_SIZE} alt="" loading="lazy" unoptimized /></span>
          <span><strong>{connector.name}</strong><small><span>{connector.category}</span><span className="connector-status" title={connector.available ? undefined : ON_REQUEST_NOTE}>{connector.available ? AVAILABLE_LABEL : ON_REQUEST_LABEL}</span></small></span>
        </li>)}
      </ul>
      {matches.length === 0 ? <p className="connector-empty">No connector matches “{query.trim()}”.</p> : null}
      <div className="connector-footer">
        <span>{AVAILABLE_LABEL}: {availableSummary()}. The rest connect through our integration layer on request.</span>
        {collapsible ? <button type="button" className="text-link" aria-expanded={expanded} onClick={() => setExpanded(!expanded)} data-component="integrationShowAll">{expanded ? "Show fewer" : `Show all ${formatCount(matches.length)} connectors`}</button> : null}
      </div>
    </div>
  );
}
