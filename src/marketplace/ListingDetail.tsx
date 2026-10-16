import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/design-system/components/Badge";
import { Button } from "@/design-system/components/Button";
import { Card } from "@/design-system/components/Card";
import { SectionCell, SplitCell } from "@/home/Frame";
import { HomepageLink } from "@/home/HomepageLink";
import { Icon } from "@/home/Icon";
import { SectionHeader } from "@/home/SectionHeader";
import { AgentPortrait } from "@/home/mockups/AgentPortrait";
import { Check } from "@/home/mockups/parts";
import { Close } from "@/home/sections/Close";
import { MARKETPLACE_COPY } from "./copy";
import { DraftReview } from "./DraftReview";
import { KIND_LABEL } from "./kinds";
import { ListingCard } from "./ListingCard";
import { appHref, previewHref } from "./listingLinks";
import { DATA_REGION, factsFor, PUBLISHER, type ListingFacts } from "./listingFacts";
import { relatedListings, reviewPriceOf, type MarketplaceListing } from "./listings";
import { O2C_SAMPLE } from "./o2cSample";
import { O2CReport } from "./O2CReport";
import { sampleRunFor } from "./supportDraft";

const L = MARKETPLACE_COPY.listing;
const F = L.facts;

/** The listing's facts as label and value pairs: who does the work, where a person comes in, cost, risk and region. */
function factRows(facts: ListingFacts, price: string): readonly { label: string; value: string }[] {
  if (facts.kind === "agent") {
    return [
      { label: F.usedIn, value: facts.usedIn.length ? facts.usedIn.join(", ") : F.usedInNone },
      { label: F.personInLoop, value: F.agentReview },
      { label: F.price, value: `${price}. ${F.agentPrice}` },
      { label: F.model, value: facts.model },
      { label: F.region, value: DATA_REGION },
    ];
  }
  return [
    { label: F.whoWorks, value: facts.agents.join(", ") },
    { label: F.personInLoop, value: facts.humanReview },
    { label: F.whoReviews, value: facts.reviewStep ? F.reviewers : F.noReviewer },
    { label: F.price, value: facts.priceNote },
    { label: F.risk, value: facts.risk },
    { label: F.category, value: facts.functionName },
    { label: F.industries, value: facts.industries.join(", ") },
    { label: F.region, value: DATA_REGION },
  ];
}

export function ListingDetail({ listing }: { listing: MarketplaceListing }) {
  const { slug, title, kind, summary, price, certified, contributor, portrait, scope, tools } = listing;
  const facts = factsFor(slug);
  const related = relatedListings(listing, 3);
  const draftRun = sampleRunFor(slug);
  return (
    <>
      <SectionCell labelledBy="listing-title" className="listing-hero-section">
        <div className="listing-hero" data-component="listingHero">
          <div>
            <Link href="/marketplace" className="text-link listing-back" data-component="listingBackToMarketplace"><Icon />{L.back}</Link>
            <AgentPortrait kind={portrait} className="portrait-large listing-hero-portrait" />
            <span className="scene-kicker">{KIND_LABEL[kind]}</span>
            <h1 id="listing-title">{title}</h1>
            <p>{summary}</p>
          </div>
          <div className="listing-hero-aside">
            <div className="listing-meta"><span className="listing-price">{price}{reviewPriceOf(listing) ? <small>{reviewPriceOf(listing)}</small> : null}</span>{certified ? <Badge status="verified">{L.certified}</Badge> : <Badge>{L.notCertified}</Badge>}</div>
            {facts ? <p className="listing-publisher" data-component="listingPublisher">{contributor ? L.contributedBy(contributor, PUBLISHER, facts.version) : L.publisherVersion(PUBLISHER, facts.version)}</p> : null}
            <div className="listing-actions">
              <Button asChild size="lg" data-component="listingAddInApp"><HomepageLink href={appHref(listing)} home={false}>{L.cta[kind]}<Icon /></HomepageLink></Button>
              <HomepageLink href={previewHref(slug)} home={false} className="text-link" data-component="listingSeePreview">{L.preview.label}<Icon name="arrow-up" /></HomepageLink>
            </div>
          </div>
        </div>
      </SectionCell>

      <SectionCell labelledBy="scope-title" className="listing-scope-section">
        <SplitCell
          textSide="left"
          text={<SectionHeader id="scope-title" eyebrow={L.scope.eyebrow} lead={L.scope.lead} tail={L.scope.tail} sub={L.scope.sub} />}
          visual={
            <Card className="listing-scope" data-component="listingScope">
              <span className="scene-kicker">{L.scope.heading}</span>
              <ul className="listing-scope-list">{scope.map((item) => <li key={item}><Check />{item}</li>)}</ul>
              <div className="detail-apps"><span className="scene-kicker">{L.scope.worksWith}</span><span>{tools.map((tool) => <Image key={tool.name} src={tool.src} alt={tool.name} width={16} height={16} />)}</span></div>
              {facts ? (
                <dl className="listing-facts" aria-label={F.label} data-component="listingFacts">
                  {factRows(facts, price).map((row) => <div key={row.label}><dt className="scene-kicker">{row.label}</dt><dd>{row.value}</dd></div>)}
                </dl>
              ) : null}
            </Card>
          }
        />
      </SectionCell>

      {slug === "order-to-cash-exception-desk" ? (
        <SectionCell labelledBy="o2c-title" className="listing-o2c-section">
          <div className="section-opener">
            <SectionHeader id="o2c-title" eyebrow={L.o2c.eyebrow} lead={L.o2c.lead} tail={L.o2c.tail} />
            <p>{L.o2c.sub}</p>
          </div>
          <O2CReport report={O2C_SAMPLE} />
          <p className="story-note">{L.o2c.note}</p>
        </SectionCell>
      ) : null}
      {draftRun ? <DraftReview run={draftRun} /> : null}

      <SectionCell labelledBy="listing-steps-title" className="listing-steps-section">
        <div className="section-opener">
          <SectionHeader id="listing-steps-title" eyebrow={L.steps.eyebrow} lead={L.steps.lead} tail={L.steps.tail} />
          <p>{L.steps.sub}</p>
        </div>
        <ol className="work-guide" data-component="listingSteps">
          {L.steps.items.map((step, i) => (
            <li key={step.title}>
              <div className="guide-step">
                <span className="guide-number font-mono font-light">{String(i + 1).padStart(2, "0")}</span>
                <div><h3>{step.title}</h3><p>{step.body}</p></div>
              </div>
            </li>
          ))}
        </ol>
      </SectionCell>

      <SectionCell labelledBy="evidence-title" className="listing-evidence-section">
        <div className="section-opener">
          <SectionHeader id="evidence-title" eyebrow={L.evidence.eyebrow} lead={L.evidence.lead} tail={L.evidence.tail} />
          <p>{L.evidence.sub}</p>
        </div>
        <ul className="listing-evidence" aria-label={L.evidence.label} data-component="listingEvidence">
          {L.evidence.items.map((item) => <li key={item.title}><Card className="listing-evidence-item"><Icon name="file" /><div><strong>{item.title}</strong><p>{item.body}</p></div></Card></li>)}
        </ul>
        <p className="story-note">{L.evidence.note}</p>
      </SectionCell>

      <SectionCell labelledBy="related-title" className="related-section">
        <div className="section-opener">
          <SectionHeader id="related-title" eyebrow={L.related.eyebrow} lead={L.related.lead} tail={L.related.tail} />
        </div>
        <ul className="catalogue-grid" aria-label={L.related.label} data-component="listingRelated">
          {related.map((item) => <li key={item.slug}><ListingCard listing={item} dataComponent="relatedListingCard" /></li>)}
        </ul>
      </SectionCell>

      <Close home={false} />
    </>
  );
}
