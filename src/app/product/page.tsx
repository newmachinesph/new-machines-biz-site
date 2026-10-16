import { Card } from "@/design-system/components/Card";
import { Table, type Column } from "@/design-system/components/Table";
import { MotionItem } from "@/design-system/motion/MotionItem";
import { HOME_COPY } from "@/home/copy";
import { SectionCell, SplitCell } from "@/home/Frame";
import { HomepageLink as Link } from "@/home/HomepageLink";
import { Icon } from "@/home/Icon";
import { SectionHeader } from "@/home/SectionHeader";
import { DEMO_EVIDENCE, DEMO_LOG } from "@/home/mockups/data";
import { DecisionRail } from "@/home/mockups/DecisionRail";
import { ReviewerTask } from "@/home/mockups/HumanWork";
import { MarketplaceGrid } from "@/home/mockups/MarketplaceGrid";
import { MockupStage } from "@/home/mockups/MockupStage";
import { ReviewContext } from "@/home/mockups/ReviewContext";
import { SandboxRun } from "@/home/mockups/SandboxRun";
import { SpendControl } from "@/home/mockups/SpendControl";
import { Close } from "@/home/sections/Close";
import { PageShell } from "@/marketplace/PageShell";
import { clauses, FeatureGrid, Opener, PageIntro, StepGuide } from "@/site/blocks";
import { PRODUCT_COPY as C } from "@/site/copy";
import { pageMetadata } from "@/site/metadata";
import { PRODUCT_FAQ } from "@/site/seo/answers";
import { Definition } from "@/site/seo/Definition";
import { SiteFaq } from "@/site/seo/SiteFaq";

export const metadata = pageMetadata({ ...C.meta, path: "/product" });

const LOG_COLUMNS: readonly Column<(typeof DEMO_LOG)[number]>[] = [
  { key: "id", header: "Record", mono: true },
  { key: "who", header: "Who" },
  { key: "what", header: "Decision" },
  { key: "at", header: "Time", align: "right" },
];

export default function Page() {
  return (
    <PageShell home={false} current="/product" dataComponent="productPage" className="site-page">
      <PageIntro id="product-title" {...C.intro} />
      <Definition id="product-definition-title" />

      <SectionCell labelledBy="product-marketplace-title">
        <SplitCell
          textSide="left"
          text={<><SectionHeader id="product-marketplace-title" eyebrow={C.marketplace.eyebrow} lead={C.marketplace.lead} sub={C.marketplace.sub} /><Link href={C.marketplace.link.href} home={false} className="text-link mt-6">{C.marketplace.link.label}<Icon /></Link></>}
          visual={<MockupStage presentation="scene" caption={C.marketplace.note}><MarketplaceGrid /></MockupStage>}
        />
      </SectionCell>

      <SectionCell labelledBy="product-packs-title">
        <Opener id="product-packs-title" eyebrow={C.packs.eyebrow} lead={C.packs.lead} tail={C.packs.tail} sub={C.packs.sub} />
        <FeatureGrid items={C.packs.items} cols={4} label="Packs in the demo workspace" />
        <p className="story-note">{C.packs.note}</p>
      </SectionCell>

      <SectionCell labelledBy="product-sandbox-title">
        <SplitCell
          textSide="right"
          text={<SectionHeader id="product-sandbox-title" eyebrow={C.sandbox.eyebrow} lead={C.sandbox.lead} sub={C.sandbox.sub} />}
          visual={<MockupStage presentation="scene"><SandboxRun /></MockupStage>}
        />
      </SectionCell>

      <SectionCell dark labelledBy="product-trust-title">
        <SplitCell
          dark
          textSide="left"
          text={<><SectionHeader id="product-trust-title" ariaLabel={C.trust.lead} eyebrow={C.trust.eyebrow} lead={clauses(C.trust.lead)} sub={C.trust.sub} className="trust-heading" dark /><Link href={C.trust.link.href} home={false} className="text-link mt-6">{C.trust.link.label}<Icon /></Link></>}
          visual={<MockupStage dark presentation="scene"><DecisionRail /></MockupStage>}
        />
      </SectionCell>

      <SectionCell labelledBy="product-human-title">
        <Opener id="product-human-title" eyebrow={C.human.eyebrow} lead={C.human.lead} sub={C.human.sub} link={C.human.link} />
        <div className="human-work-layout">
          <MotionItem><ReviewerTask /></MotionItem>
          <ReviewContext />
        </div>
      </SectionCell>

      <SectionCell labelledBy="product-control-title" className="control-section">
        <Opener id="product-control-title" eyebrow={C.control.eyebrow} lead={C.control.lead} tail={C.control.tail} sub={C.control.sub} />
        <MotionItem className="control-board"><SpendControl /></MotionItem>
        <p className="story-note">{C.control.note}</p>
      </SectionCell>

      <SectionCell labelledBy="product-evidence-title">
        <Opener id="product-evidence-title" eyebrow={C.evidence.eyebrow} lead={C.evidence.lead} tail={C.evidence.tail} sub={C.evidence.sub} />
        <div className="listing-evidence" data-component="productEvidence">
          <Table caption={C.evidence.caption} columns={LOG_COLUMNS} rows={DEMO_LOG} rowKey={(row) => row.id} />
          <div className="listing-evidence-files">
            {DEMO_EVIDENCE.map((item) => <Card key={item.title} className="listing-evidence-file"><Icon name="file" /><div><strong>{item.title}</strong><span>{item.meta}</span></div><Icon name="check" /></Card>)}
          </div>
        </div>
        <p className="story-note">{C.evidence.note}</p>
      </SectionCell>

      <SectionCell labelledBy="product-connected-title">
        <Opener id="product-connected-title" eyebrow={C.connected.eyebrow} lead={C.connected.lead} tail={C.connected.tail} sub={C.connected.sub} link={C.connected.link} />
        <FeatureGrid items={C.connected.items} />
      </SectionCell>

      <SectionCell labelledBy="product-build-title">
        <Opener id="product-build-title" eyebrow={C.build.eyebrow} lead={C.build.lead} tail={C.build.tail} sub={C.build.sub} />
        <FeatureGrid items={C.build.items} />
      </SectionCell>

      <SectionCell labelledBy="product-how-title">
        <Opener id="product-how-title" eyebrow={C.how.eyebrow} lead={C.how.lead} tail={C.how.tail} sub={C.how.sub} />
        <StepGuide steps={HOME_COPY.how.steps} dataComponent="productSteps" />
      </SectionCell>

      <SiteFaq {...PRODUCT_FAQ} />
      <Close home={false} />
    </PageShell>
  );
}
