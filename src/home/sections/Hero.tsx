import { HomepageLink as Link } from "../HomepageLink";
import { Button } from "@/design-system/components/Button";
import { MotionItem } from "@/design-system/motion/MotionItem";
import { HOME_COPY } from "../copy";
import { SectionCell } from "../Frame";
import { HeroProduct } from "../mockups/HeroProduct";
import { Icon } from "../Icon";

export function Hero() {
  const { lead, tail, sub, primary, secondary } = HOME_COPY.hero;
  return (
    <SectionCell labelledBy="hero-title" className="hero-section">
      <div className="hero-intro">
        <div>
          <MotionItem><Link className="hero-announcement" href="#trust"><span className="announcement-label">Meet New Machines</span><span>Intelligent work. Verified.</span><Icon /></Link></MotionItem>
          <MotionItem delay={0.06}>
            <h1 id="hero-title" className="hero-title font-sans"><span>{lead}</span>{" "}<span className="hero-title-tail">{tail}</span></h1>
          </MotionItem>
        </div>
        <MotionItem delay={0.12} className="hero-lede">
          <p>{sub}</p>
          <div className="hero-actions">
            <Button asChild size="lg"><Link href={primary.href}>{primary.label}<Icon /></Link></Button>
            <Link href={secondary.href} className="text-link">{secondary.label}<Icon name="arrow-up" /></Link>
          </div>
          <div className="hero-assurances"><span><Icon name="shield" />Evidence with every outcome</span><span><Icon name="people" />Human judgment, built in</span></div>
        </MotionItem>
      </div>
      <MotionItem rise delay={0.2}>
        <HeroProduct />
      </MotionItem>
      <div className="hero-baseline"><span>The global marketplace for verified intelligent work.</span><a href="#work-explorer">See your workforce in action<Icon name="play" /></a></div>
    </SectionCell>
  );
}
