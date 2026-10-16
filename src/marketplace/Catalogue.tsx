"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/design-system/components/Button";
import { Input } from "@/design-system/components/Input";
import { Check } from "@/home/mockups/parts";
import { MARKETPLACE_COPY } from "./copy";
import { DEFAULT_FILTERS, filtersFromParams, filtersToQuery, hasActiveFilters, matchListings, type CatalogueFilters } from "./filters";
import { KIND_FILTER_GROUP_LABEL, KIND_FILTERS } from "./kinds";
import { ListingCard } from "./ListingCard";
import { MARKETPLACE_LISTINGS } from "./listings";

const C = MARKETPLACE_COPY.catalogue;

function capitalise(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export type CatalogueProps = {
  /** Filters read from the URL; absent during the static render. */
  initial?: CatalogueFilters;
};

/** Filters, search and the card grid. Every change is mirrored to the URL so the view survives a reload or a shared link,
 *  and a navigation that changes the URL from outside (nav link, back/forward) is mirrored back into the controls. */
export function Catalogue({ initial }: CatalogueProps) {
  const [filters, setFilters] = useState<CatalogueFilters>(() => initial ?? DEFAULT_FILTERS);
  // Queries this component wrote itself, oldest first. When the URL catches up with one of them the
  // state is already right; anything else is an outside navigation and the controls follow the URL.
  const pushed = useRef<string[]>([]);
  const fromUrl = filtersToQuery(initial ?? DEFAULT_FILTERS);

  useEffect(() => {
    const own = pushed.current.indexOf(fromUrl);
    if (own >= 0) {
      pushed.current.splice(0, own + 1);
      return;
    }
    pushed.current = [];
    setFilters((current) => (filtersToQuery(current) === fromUrl ? current : filtersFromParams(new URLSearchParams(fromUrl))));
  }, [fromUrl]);

  function update(patch: Partial<CatalogueFilters>) {
    const next = { ...filters, ...patch };
    const query = filtersToQuery(next);
    setFilters(next);
    pushed.current.push(query);
    // Next patches the History API, so useSearchParams follows without a router transition.
    window.history.replaceState(null, "", `/marketplace${query}`);
  }

  const results = matchListings(MARKETPLACE_LISTINGS, filters);
  // The empty state has its own "Clear filters" button; only one clear control at a time.
  const active = hasActiveFilters(filters) && results.length > 0;
  return (
    <>
      <div className="catalogue-toolbar" data-component="marketplaceToolbar">
        <div className="directory-filters" role="group" aria-label={KIND_FILTER_GROUP_LABEL}>
          {KIND_FILTERS.map((item) => (
            <button key={item.kind} type="button" aria-pressed={filters.kind === item.kind} onClick={() => update({ kind: item.kind })} data-component={`marketplaceKind${capitalise(item.kind)}`}>{item.label}</button>
          ))}
        </div>
        <div className="catalogue-controls">
          <button type="button" className="catalogue-certified" aria-pressed={filters.certified} onClick={() => update({ certified: !filters.certified })} data-component="marketplaceCertifiedOnly"><Check />{C.certifiedOnly}</button>
          <Input className="catalogue-search" label={C.searchLabel} type="search" placeholder={C.searchPlaceholder} value={filters.q} onChange={(event) => update({ q: event.target.value })} data-component="marketplaceSearch" />
          <p className="micro-label catalogue-count" aria-live="polite">{results.length} {results.length === 1 ? "listing" : "listings"}</p>
          {active ? <button type="button" className="text-link catalogue-clear" onClick={() => update(DEFAULT_FILTERS)} data-component="marketplaceClearFilters">{C.clearInline}</button> : null}
        </div>
      </div>
      {results.length ? (
        <ul className="catalogue-grid" aria-label={C.listingsLabel} data-component="marketplaceGrid">
          {results.map((listing) => <li key={listing.slug}><ListingCard listing={listing} headingLevel="h2" dataComponent="marketplaceListingCard" /></li>)}
        </ul>
      ) : (
        <div className="catalogue-empty" data-component="marketplaceEmpty">
          <p>{C.empty}</p>
          <Button variant="secondary" size="md" onClick={() => update(DEFAULT_FILTERS)} data-component="marketplaceEmptyClearFilters">{C.clear}</Button>
        </div>
      )}
      <div className="catalogue-sources" data-component="marketplaceSources">
        <h2 className="scene-kicker">{C.sources.heading}</h2>
        <ul>{C.sources.items.map((item) => <li key={item.title}><strong>{item.title}</strong><p>{item.body}</p></li>)}</ul>
        <p className="catalogue-sources-note">{C.sources.priceNote}</p>
      </div>
    </>
  );
}

/** Reads the URL. Kept apart so `useSearchParams` sits inside the page's Suspense boundary. */
export function CatalogueFromUrl() {
  const params = useSearchParams();
  return <Catalogue initial={filtersFromParams(params)} />;
}
