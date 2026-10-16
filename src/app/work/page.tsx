import { SectionCell } from "@/home/Frame";
import { Close } from "@/home/sections/Close";
import { PageShell } from "@/marketplace/PageShell";
import { FeatureGrid, Opener, PageIntro, StepGuide } from "@/site/blocks";
import { WORK_COPY as C } from "@/site/copy";
import { pageMetadata } from "@/site/metadata";
import { WORK_FAQ } from "@/site/seo/answers";
import { SiteFaq } from "@/site/seo/SiteFaq";

export const metadata = pageMetadata({ ...C.meta, path: "/work" });

export default function Page() {
  return (
    <PageShell home={false} dataComponent="workPage" className="site-page">
      <PageIntro id="work-title" {...C.intro} />

      <SectionCell labelledBy="modes-title">
        <Opener id="modes-title" eyebrow={C.modes.eyebrow} lead={C.modes.lead} tail={C.modes.tail} sub={C.modes.sub} />
        <FeatureGrid items={C.modes.items} cols={4} />
      </SectionCell>

      <SectionCell labelledBy="reviewer-steps-title">
        <Opener id="reviewer-steps-title" eyebrow={C.steps.eyebrow} lead={C.steps.lead} tail={C.steps.tail} sub={C.steps.sub} />
        <StepGuide steps={C.steps.items} dataComponent="reviewerSteps" />
      </SectionCell>

      <SectionCell labelledBy="protections-title">
        <Opener id="protections-title" eyebrow={C.protections.eyebrow} lead={C.protections.lead} tail={C.protections.tail} sub={C.protections.sub} />
        <FeatureGrid items={C.protections.items} />
      </SectionCell>

      <SiteFaq {...WORK_FAQ} />
      <Close home={false} secondary={C.intro.primary} />
    </PageShell>
  );
}
