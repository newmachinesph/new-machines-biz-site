import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/design-system/components/Badge";
import { Button } from "@/design-system/components/Button";
import { Card } from "@/design-system/components/Card";
import { Table, type Column } from "@/design-system/components/Table";
import { SectionCell, SplitCell } from "@/home/Frame";
import { Icon } from "@/home/Icon";
import { SectionHeader } from "@/home/SectionHeader";
import { AgentPortrait } from "@/home/mockups/AgentPortrait";
import { DEMO_EVIDENCE, DEMO_LOG, DEMO_STEPS } from "@/home/mockups/data";
import { Check } from "@/home/mockups/parts";
import { Close } from "@/home/sections/Close";
import { MARKETPLACE_COPY } from "./copy";
import { KIND_LABEL } from "./kinds";
import { ListingCard } from "./ListingCard";
import { relatedListings, type ListingReviewer, type MarketplaceListing } from "./listings";

const L = MARKETPLACE_COPY.listing;

const LOG_COLUMNS: readonly Column<(typeof DEMO_LOG)[number]>[] = [
  { key: "id", header: "Record", mono: true },
  { key: "who", header: "Who" },
  { key: "what", header: "Decision" },
  { key: "at", header: "Time", align: "right" },
];

/** The one reviewer with a photograph (`/reviewer.jpg`); everyone else gets initials, as on the homepage explorer. */
const PHOTOGRAPHED_REVIEWER = "M. Tanaka";

function initials(name: string) {
  return name.split(/[\s.]+/).filter(Boolean).map((part) => part[0]).join("");
}

function ReviewerAvatar({ reviewer }: { reviewer: ListingReviewer }) {
  if (reviewer.name === PHOTOGRAPHED_REVIEWER) return <AgentPortrait kind="human" />;
  return <span className="review-avatar" data-accent="human">{initials(reviewer.name)}</span>;
}

export function ListingDetail({ listing }: { listing: MarketplaceListing }) {
  const { title, kind, summary, price, certified, portrait, scope, reviewer, tools } = listing;
  const related = relatedListings(listing, 3);
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
            <div className="listing-meta"><span className="listing-price">{price}</span>{certified ? <Badge status="verified">{L.certified}</Badge> : <Badge>{L.notCertified}</Badge>}</div>
            <div className="listing-actions">
              <Button asChild size="lg" data-component="listingTryWorkflow"><Link href="/#work-explorer">{L.cta[kind]}</Link></Button>
              <Link href="/#sandbox" className="text-link" data-component="listingSeeSandbox">{L.sandbox}<Icon name="arrow-up" /></Link>
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
              {reviewer ? (
                <div className="listing-reviewer"><ReviewerAvatar reviewer={reviewer} /><div><span className="scene-kicker">{L.scope.reviewer}</span><strong>{reviewer.name}</strong><span>{`${reviewer.role} · ${reviewer.city}`}</span></div></div>
              ) : null}
            </Card>
          }
        />
      </SectionCell>

      <SectionCell labelledBy="listing-steps-title" className="listing-steps-section">
        <div className="section-opener">
          <SectionHeader id="listing-steps-title" eyebrow={L.steps.eyebrow} lead={L.steps.lead} tail={L.steps.tail} />
          <p>{L.steps.sub}</p>
        </div>
        <ol className="work-guide" data-component="listingSteps">
          {DEMO_STEPS.map((step, i) => (
            <li key={step}>
              <div className="guide-step">
                <span className="guide-number font-mono font-light">{String(i + 1).padStart(2, "0")}</span>
                <div><h3>{step}</h3><p>{L.steps.bodies[step]}</p></div>
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
        <div className="listing-evidence" data-component="listingEvidence">
          <Table caption={L.evidence.caption} columns={LOG_COLUMNS} rows={DEMO_LOG} rowKey={(row) => row.id} />
          <div className="listing-evidence-files">
            {DEMO_EVIDENCE.map((item) => <Card key={item.title} className="listing-evidence-file"><Icon name="file" /><div><strong>{item.title}</strong><span>{item.meta}</span></div><Icon name="check" /></Card>)}
          </div>
        </div>
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
