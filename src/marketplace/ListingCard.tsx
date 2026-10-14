import Link from "next/link";
import { Icon } from "@/home/Icon";
import { AgentPortrait } from "@/home/mockups/AgentPortrait";
import { MARKETPLACE_COPY } from "./copy";
import { KIND_LABEL } from "./kinds";
import type { MarketplaceListing } from "./listings";

export type ListingCardProps = {
  listing: MarketplaceListing;
  /** h2 under the catalogue's h1; h3 under a section's h2 (related listings). */
  headingLevel?: "h2" | "h3";
  dataComponent?: string;
};

/** One catalogue card: a `.story-card` (border, radius, hover lift, entrance) linking to the listing page. */
export function ListingCard({ listing, headingLevel: Heading = "h3", dataComponent = "listingCard" }: ListingCardProps) {
  const { slug, title, kind, body, price, certified, portrait } = listing;
  return (
    <Link className="story-card listing-card" href={`/marketplace/${slug}`} data-component={dataComponent}>
      <div className="listing-card-art" aria-hidden="true"><AgentPortrait kind={portrait} className="portrait-large" /></div>
      <div className="listing-card-body">
        <span className="micro-label">{KIND_LABEL[kind]}{certified ? ` / ${MARKETPLACE_COPY.listing.certified}` : ""}</span>
        <Heading>{title}</Heading>
        <p>{body}</p>
        <div className="listing-card-foot"><span className="listing-price">{price}</span><span className="text-link">{MARKETPLACE_COPY.catalogue.view}<Icon /></span></div>
      </div>
    </Link>
  );
}
