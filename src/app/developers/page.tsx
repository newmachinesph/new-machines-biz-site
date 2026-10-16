import { HOME_COPY } from "@/home/copy";
import { SectionCell } from "@/home/Frame";
import { SectionHeader } from "@/home/SectionHeader";
import { Close } from "@/home/sections/Close";
import { PageShell } from "@/marketplace/PageShell";
import { FeatureGrid, Opener, PageIntro, StepGuide } from "@/site/blocks";
import { DEVELOPERS_COPY as C } from "@/site/copy";
import { pageMetadata } from "@/site/metadata";
import { DEVELOPERS_FAQ } from "@/site/seo/answers";
import { SiteFaq } from "@/site/seo/SiteFaq";

export const metadata = pageMetadata({ ...C.meta, path: "/developers" });

const { primary, ...intro } = C.intro;

export default function Page() {
  return (
    <PageShell home={false} current="/developers" dataComponent="developersPage" className="site-page">
      <PageIntro id="developers-title" {...intro} primary={{ href: `${HOME_COPY.nav.appUrl}/studio`, label: primary.label }} />

      <SectionCell labelledBy="publish-title">
        <Opener id="publish-title" eyebrow={C.publish.eyebrow} lead={C.publish.lead} tail={C.publish.tail} sub={C.publish.sub} />
        <FeatureGrid items={C.publish.items} cols={2} />
        <p className="story-note">{C.publish.note}</p>
      </SectionCell>

      <SectionCell labelledBy="studio-title">
        <Opener id="studio-title" eyebrow={C.studio.eyebrow} lead={C.studio.lead} tail={C.studio.tail} sub={C.studio.sub} />
        <FeatureGrid items={C.studio.items} />
      </SectionCell>

      <SectionCell labelledBy="lifecycle-title">
        <Opener id="lifecycle-title" eyebrow={C.lifecycle.eyebrow} lead={C.lifecycle.lead} tail={C.lifecycle.tail} sub={C.lifecycle.sub} />
        <StepGuide steps={C.lifecycle.steps} dataComponent="developerLifecycle" />
      </SectionCell>

      <SectionCell labelledBy="platform-title">
        <Opener id="platform-title" eyebrow={C.platform.eyebrow} lead={C.platform.lead} tail={C.platform.tail} sub={C.platform.sub} />
        <FeatureGrid items={C.platform.items} />
      </SectionCell>

      <SectionCell labelledBy="stack-title">
        <div className="section-opener">
          <SectionHeader id="stack-title" eyebrow={C.stack.eyebrow} lead={C.stack.lead} tail={C.stack.tail} />
          <p>{C.stack.sub}</p>
        </div>
      </SectionCell>

      <SiteFaq {...DEVELOPERS_FAQ} />
      <Close home={false} secondary={C.intro.secondary} />
    </PageShell>
  );
}
