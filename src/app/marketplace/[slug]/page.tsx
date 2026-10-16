import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MARKETPLACE_COPY } from "@/marketplace/copy";
import { findListing, MARKETPLACE_LISTINGS } from "@/marketplace/listings";
import { ListingDetail } from "@/marketplace/ListingDetail";
import { PageShell } from "@/marketplace/PageShell";
import { pageMetadata } from "@/site/metadata";
import { ListingJsonLd } from "@/site/seo/MarketplaceJsonLd";

type Props = { params: Promise<{ slug: string }> };

// Fully static: every listing is prerendered and unknown slugs 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return MARKETPLACE_LISTINGS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = findListing((await params).slug);
  if (!listing) return { title: MARKETPLACE_COPY.meta.title };
  return pageMetadata({ title: `${listing.title} · ${MARKETPLACE_COPY.meta.title}`, description: listing.summary, path: `/marketplace/${listing.slug}` });
}

export default async function Page({ params }: Props) {
  const listing = findListing((await params).slug);
  if (!listing) notFound();
  return (
    <PageShell home={false} current="/marketplace" dataComponent="listingPage">
      <ListingDetail listing={listing} />
      <ListingJsonLd listing={listing} />
    </PageShell>
  );
}
