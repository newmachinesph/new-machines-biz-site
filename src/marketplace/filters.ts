import { isKind, KIND_LABEL, type KindFilter } from "./kinds";
import { factsSearchText } from "./listingFacts";
import type { MarketplaceListing } from "./listings";

export type CatalogueFilters = { kind: KindFilter; certified: boolean; q: string };

export const DEFAULT_FILTERS: CatalogueFilters = { kind: "all", certified: false, q: "" };

/** `?kind=agent&certified=1&q=invoice`; defaults and blank queries are left out. Empty string when nothing is set. */
export function filtersToQuery(filters: CatalogueFilters): string {
  const params = new URLSearchParams();
  if (filters.kind !== "all") params.set("kind", filters.kind);
  if (filters.certified) params.set("certified", "1");
  const q = filters.q.trim();
  if (q) params.set("q", q);
  const query = params.toString();
  return query ? `?${query}` : "";
}

/** Unknown kinds fall back to "all"; a blank query is treated as absent. */
export function filtersFromParams(params: Pick<URLSearchParams, "get"> | null): CatalogueFilters {
  const kind = params?.get("kind");
  return {
    kind: isKind(kind) ? kind : "all",
    certified: params?.get("certified") === "1",
    q: params?.get("q")?.trim() ?? "",
  };
}

export function hasActiveFilters(filters: CatalogueFilters): boolean {
  return filters.kind !== "all" || filters.certified || filters.q.trim() !== "";
}

/** Kind and certification are AND-ed; the query is a case-insensitive substring over the listing's words, its apps,
 *  and its function, industries and agents (or, for an agent, the packs it works in). */
export function matchListings(listings: readonly MarketplaceListing[], filters: CatalogueFilters): MarketplaceListing[] {
  const needle = filters.q.trim().toLowerCase();
  return listings.filter((listing) => {
    if (filters.kind !== "all" && listing.kind !== filters.kind) return false;
    if (filters.certified && !listing.certified) return false;
    if (!needle) return true;
    const tools = listing.tools.map((tool) => tool.name).join(" ");
    return `${listing.title} ${listing.body} ${listing.summary} ${KIND_LABEL[listing.kind]} ${tools} ${factsSearchText(listing.slug)}`.toLowerCase().includes(needle);
  });
}
