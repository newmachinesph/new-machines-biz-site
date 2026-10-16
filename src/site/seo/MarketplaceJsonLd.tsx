import { MARKETPLACE_LISTINGS, type MarketplaceListing } from "@/marketplace/listings";
import { JsonLd } from "./JsonLd";
import { breadcrumbSchema, marketplaceItemListSchema, type Crumb } from "./schema";

const HOME: Crumb = { name: "New Machines", path: "/" };
const MARKETPLACE: Crumb = { name: "Marketplace", path: "/marketplace" };

/** /marketplace: the catalogue as an ItemList plus its breadcrumb. */
export function MarketplaceJsonLd() {
  return <JsonLd data={[breadcrumbSchema([HOME, MARKETPLACE]), marketplaceItemListSchema(MARKETPLACE_LISTINGS)]} />;
}

/** /marketplace/[slug]: Home › Marketplace › listing. */
export function ListingJsonLd({ listing }: { listing: MarketplaceListing }) {
  return <JsonLd data={breadcrumbSchema([HOME, MARKETPLACE, { name: listing.title, path: `/marketplace/${listing.slug}` }])} />;
}
