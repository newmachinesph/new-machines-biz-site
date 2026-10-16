import { Button } from "@/design-system/components/Button";
import { MotionItem } from "@/design-system/motion/MotionItem";
import { SectionCell } from "@/home/Frame";
import { HomepageLink as Link } from "@/home/HomepageLink";
import { Icon } from "@/home/Icon";
import { SectionHeader } from "@/home/SectionHeader";
import { Close } from "@/home/sections/Close";
import { PageShell } from "@/marketplace/PageShell";
import { FeatureGrid, Opener, PageIntro } from "@/site/blocks";
import { ABOUT_COPY as C } from "@/site/copy";
import { pageMetadata } from "@/site/metadata";
import { ABOUT_FAQ } from "@/site/seo/answers";
import { SiteFaq } from "@/site/seo/SiteFaq";

export const metadata = pageMetadata({ ...C.meta, path: "/about" });

export default function Page() {
  return (
    <PageShell home={false} dataComponent="aboutPage" className="site-page">
      <PageIntro id="about-title" {...C.intro} />

      <SectionCell labelledBy="problem-title">
        <Opener id="problem-title" eyebrow={C.problem.eyebrow} lead={C.problem.lead} tail={C.problem.tail} sub={C.problem.sub} />
        <MotionItem className="pull-quote"><span className="micro-label">{C.problem.quoteLabel}</span><blockquote>{C.problem.quote}</blockquote><p>{C.problem.closing}</p></MotionItem>
        <FeatureGrid items={C.problem.items} numbered />
      </SectionCell>

      <SectionCell labelledBy="principles-title">
        <Opener id="principles-title" eyebrow={C.principles.eyebrow} lead={C.principles.lead} tail={C.principles.tail} />
        <FeatureGrid items={C.principles.items} cols={4} numbered label="Principles in priority order" />
      </SectionCell>

      <SectionCell labelledBy="stage-title">
        <Opener id="stage-title" eyebrow={C.stage.eyebrow} lead={C.stage.lead} tail={C.stage.tail} sub={C.stage.sub} />
        <ol className="stage-list" data-component="aboutStages">
          {C.stage.items.map((item) => <li key={item.label}><span className="stage-label">{item.label}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></li>)}
        </ol>
      </SectionCell>

      <SectionCell labelledBy="market-title">
        <Opener id="market-title" eyebrow={C.market.eyebrow} lead={C.market.lead} tail={C.market.tail} sub={C.market.sub} />
        <ul className="hub-row" aria-label={C.market.hubsLabel}>{C.market.hubs.map((hub) => <li key={hub}>{hub}</li>)}</ul>
        <p className="hub-caption">{C.market.hubsLabel} · {C.market.languages}</p>
      </SectionCell>

      <SectionCell labelledBy="about-contact-title">
        <div className="section-opener">
          <SectionHeader id="about-contact-title" eyebrow="Contact" lead={C.contact.lead} />
          <div><p>{C.contact.sub}</p><Button asChild size="lg" className="mt-5"><Link href={C.contact.link.href} home={false}>{C.contact.link.label}<Icon /></Link></Button></div>
        </div>
      </SectionCell>

      <SiteFaq {...ABOUT_FAQ} />
      <Close home={false} />
    </PageShell>
  );
}
