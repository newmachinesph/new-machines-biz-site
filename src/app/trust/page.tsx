import { Card } from "@/design-system/components/Card";
import { SectionCell, SplitCell } from "@/home/Frame";
import { SectionHeader } from "@/home/SectionHeader";
import { DecisionRail } from "@/home/mockups/DecisionRail";
import { MockupStage } from "@/home/mockups/MockupStage";
import { Close } from "@/home/sections/Close";
import { PageShell } from "@/marketplace/PageShell";
import { clauses, FeatureGrid, Opener, PageIntro } from "@/site/blocks";
import { SITE, TRUST_COPY as C } from "@/site/copy";
import { pageMetadata } from "@/site/metadata";
import { TRUST_FAQ } from "@/site/seo/answers";
import { SiteFaq } from "@/site/seo/SiteFaq";

export const metadata = pageMetadata({ ...C.meta, path: "/trust" });

export default function Page() {
  return (
    <PageShell home={false} current="/trust" dataComponent="trustPage" className="site-page">
      <PageIntro id="trust-page-title" {...C.intro} />

      <SectionCell dark labelledBy="receipt-title">
        <SplitCell
          dark
          textSide="left"
          text={<SectionHeader id="receipt-title" ariaLabel={C.receipt.lead} eyebrow={C.receipt.eyebrow} lead={clauses(C.receipt.lead)} sub={C.receipt.sub} className="trust-heading" dark />}
          visual={<MockupStage dark presentation="scene"><DecisionRail /></MockupStage>}
        />
      </SectionCell>

      <SectionCell labelledBy="separation-title">
        <Opener id="separation-title" eyebrow={C.separation.eyebrow} lead={C.separation.lead} tail={C.separation.tail} sub={C.separation.sub} />
        <FeatureGrid items={C.separation.items} cols={4} numbered label="The seven responsibilities" />
      </SectionCell>

      <SectionCell labelledBy="controls-title">
        <Opener id="controls-title" eyebrow={C.controls.eyebrow} lead={C.controls.lead} tail={C.controls.tail} sub={C.controls.sub} />
        <FeatureGrid items={C.controls.items} />
      </SectionCell>

      <SectionCell labelledBy="data-title">
        <Opener id="data-title" eyebrow={C.data.eyebrow} lead={C.data.lead} tail={C.data.tail} />
        <FeatureGrid items={C.data.items} cols={4} />
      </SectionCell>

      <SectionCell labelledBy="status-title">
        <Opener id="status-title" eyebrow={C.status.eyebrow} lead={C.status.lead} tail={C.status.tail} />
        <Card className="status-note" data-component="trustStatus">
          <p>{C.status.body}</p>
          <div className="status-disclosure"><strong>{C.status.disclosure}</strong><span>{C.status.disclosureBody}</span><a href={`mailto:${SITE.securityEmail}`}>{SITE.securityEmail}</a></div>
        </Card>
      </SectionCell>

      <SiteFaq {...TRUST_FAQ} />
      <Close home={false} />
    </PageShell>
  );
}
