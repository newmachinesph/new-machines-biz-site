import { LogoReel } from "../motion/LogoReel";
import { SectionCell } from "../Frame";
import { Icon } from "../Icon";
import { FICTIONAL_COMPANIES } from "../fictionalCompanies";

export function Customers() {
  return (
    <SectionCell labelledBy="customers-title" className="customers-section">
      <div className="customers-heading"><h2 id="customers-title">A new workforce for Japan and Asia-Pacific.</h2><a href="#work-explorer" className="text-link">See the work<Icon /></a></div>
      <LogoReel companies={FICTIONAL_COMPANIES} />
      <p className="roster-note">Fictional companies, imagined for the work ahead.</p>
    </SectionCell>
  );
}
