import { HomepageLink as Link } from "../HomepageLink";
import { Button } from "@/design-system/components/Button";
import { MotionItem } from "@/design-system/motion/MotionItem";
import { HOME_COPY } from "../copy";
import { SectionCell } from "../Frame";
import { Mark } from "@/design-system/logo/Mark";
import { Icon } from "../Icon";
import { MotorsportAccent } from "../experiments/MotorsportAccent";
import { MOTORSPORT_EXPERIMENT } from "../experiments/motorsport-config";
import { cn } from "@/lib/cn";

export type CloseProps = {
  /** The secondary action; the homepage sends visitors to the marketplace. */
  secondary?: { href: string; label: string };
  /** Passed to the section links; false off the homepage. */
  home?: boolean;
};

export function Close({ secondary = HOME_COPY.hero.primary, home = true }: CloseProps) {
  const { lead, sub } = HOME_COPY.close;
  return (
    <SectionCell labelledBy="close-title" className="closing-section">
      <div className={cn("closing-content px-6 py-32 text-center", MOTORSPORT_EXPERIMENT.enabled && "motorsport-context")}>
        <Mark className="closing-mark h-8" title="" />
        <MotionItem>
          <h2 id="close-title" className="whitespace-pre-line text-balance font-sans font-medium text-3xl tracking-tight text-ink md:text-5xl">{lead}</h2>
        </MotionItem>
        <MotionItem delay={0.06}>
          <p className="mx-auto mt-5 max-w-xl text-base text-grey-500">{sub}</p>
        </MotionItem>
        <MotionItem delay={0.12}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link href={HOME_COPY.nav.appUrl}>{HOME_COPY.nav.getStarted}<Icon /></Link></Button>
            <Button asChild size="lg" variant="secondary"><Link href={secondary.href} home={home}>{secondary.label}</Link></Button>
          </div>
        </MotionItem>
        <MotorsportAccent />
      </div>
    </SectionCell>
  );
}
