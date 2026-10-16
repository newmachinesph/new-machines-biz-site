import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionCell } from "@/home/Frame";
import { Close } from "@/home/sections/Close";
import { Catalogue, CatalogueFromUrl } from "@/marketplace/Catalogue";
import { MARKETPLACE_COPY } from "@/marketplace/copy";
import { PageShell } from "@/marketplace/PageShell";
import { pageMetadata } from "@/site/metadata";
import { MarketplaceJsonLd } from "@/site/seo/MarketplaceJsonLd";

export const metadata: Metadata = pageMetadata({ title: MARKETPLACE_COPY.meta.title, description: MARKETPLACE_COPY.meta.description, path: "/marketplace" });

export default function Page() {
  const { eyebrow, lead, tail, sub, closeSecondary } = MARKETPLACE_COPY.catalogue;
  return (
    <PageShell home={false} current="/marketplace" dataComponent="marketplacePage">
      <SectionCell labelledBy="marketplace-title" className="catalogue-section">
        <div className="section-opener">
          <div><p className="section-eyebrow"><span aria-hidden="true" />{eyebrow}</p><h1 id="marketplace-title">{lead}<br /><span>{tail}</span></h1></div>
          <p>{sub}</p>
        </div>
        {/* The fallback is the same catalogue with the URL ignored; useSearchParams must stay inside this boundary for the static render. */}
        <Suspense fallback={<Catalogue />}>
          <CatalogueFromUrl />
        </Suspense>
      </SectionCell>
      <MarketplaceJsonLd />
      <Close secondary={closeSecondary} home={false} />
    </PageShell>
  );
}
