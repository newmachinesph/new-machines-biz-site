import { HOME_COPY } from "../copy";
import { SectionCell } from "../Frame";
import { RegionalGlobe } from "../globe/RegionalGlobe";
import { Icon } from "../Icon";

/** Replaces the logo wall: the launch market and the hubs that follow (src/site/hubs.ts) on the regional globe. */
export function JapacStrip() {
  const { languages, eyebrow } = HOME_COPY.japac;
  return (
    <SectionCell labelledBy="japac-title">
      <div className="regional-layout">
        <div className="regional-copy">
          <p className="section-eyebrow"><span aria-hidden="true" />{eyebrow}</p>
          <h2 id="japac-title">Built for Japan.<br />{" "}<span>Ready for everywhere.</span></h2>
          <p>Local context matters. The workspace is in 日本語 and English, from the marketplace to the work receipt. Bring in qualified judgment, and keep the evidence with you across borders.</p>
          <div className="regional-details"><span><Icon name="people" />Human judgment, close to the work</span><span><Icon name="shield" />One record, wherever work happens</span></div>
          <span className="regional-language">{languages}</span>
          <a className="text-link" href="#work-explorer">See a workforce in action<Icon /></a>
        </div>
        <RegionalGlobe />
      </div>
    </SectionCell>
  );
}
