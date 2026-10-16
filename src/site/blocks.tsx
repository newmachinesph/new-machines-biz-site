import type { ReactNode } from "react";
import { HomepageLink as Link } from "@/home/HomepageLink";
import { Button } from "@/design-system/components/Button";
import { MotionItem } from "@/design-system/motion/MotionItem";
import { SectionCell } from "@/home/Frame";
import { Icon } from "@/home/Icon";
import { SectionHeader } from "@/home/SectionHeader";

export type Action = { href: string; label: string };

/** The home's Trust heading: "Judgment recommends. Policy authorizes. Verification checks.", one clause per line. */
export function clauses(lead: string) {
  return lead.split(". ").map((clause, i) => <span className="trust-clause" key={clause}>{clause.endsWith(".") ? clause : clause + "."}{i < 2 ? " " : null}</span>);
}

export type PageIntroProps = {
  /** The h1's id; the section is labelled by it. */
  id: string;
  eyebrow: string;
  lead: string;
  tail?: string;
  sub: string;
  primary?: Action;
  secondary?: Action;
  note?: string;
  className?: string;
};

/** The first cell of a company page: eyebrow, two-tone h1, lede and up to two actions. */
export function PageIntro({ id, eyebrow, lead, tail, sub, primary, secondary, note, className }: PageIntroProps) {
  return (
    <SectionCell labelledBy={id} className={className}>
      <div className="page-intro">
        <div>
          <MotionItem><p className="section-eyebrow"><span aria-hidden="true" />{eyebrow}</p></MotionItem>
          <MotionItem delay={0.06}><h1 id={id}>{lead}{tail ? <><br /><span>{tail}</span></> : null}</h1></MotionItem>
        </div>
        <MotionItem delay={0.12} className="page-intro-lede">
          <p>{sub}</p>
          {primary || secondary ? (
            <div className="page-intro-actions">
              {primary ? <Button asChild size="lg"><Link href={primary.href} home={false}>{primary.label}<Icon /></Link></Button> : null}
              {secondary ? <Link href={secondary.href} home={false} className="text-link">{secondary.label}<Icon name="arrow-up" /></Link> : null}
            </div>
          ) : null}
          {note ? <p className="page-intro-note">{note}</p> : null}
        </MotionItem>
      </div>
    </SectionCell>
  );
}

export type OpenerProps = { id: string; eyebrow: string; lead: ReactNode; tail?: string; sub?: string; link?: Action };

/** The home's section opener: SectionHeader on the left, the sub-line (and an optional link) on the right. */
export function Opener({ id, eyebrow, lead, tail, sub, link }: OpenerProps) {
  return (
    <div className="section-opener">
      <SectionHeader id={id} eyebrow={eyebrow} lead={lead} tail={tail} />
      {sub || link ? (
        <div>
          {sub ? <p>{sub}</p> : null}
          {link ? <Link href={link.href} home={false} className="text-link">{link.label}<Icon /></Link> : null}
        </div>
      ) : null}
    </div>
  );
}

export type Feature = Readonly<{ title: string; body: string; note?: string; href?: string; link?: string }>;

export type FeatureGridProps = { items: readonly Feature[]; cols?: 2 | 3 | 4; numbered?: boolean; label?: string };

/** Short hairline cells, three across on desktop. Numbered for ordered principles. */
export function FeatureGrid({ items, cols = 3, numbered = false, label }: FeatureGridProps) {
  return (
    <ul className="feature-grid" data-cols={cols} aria-label={label}>
      {items.map((item, i) => (
        <li key={item.title}>
          {numbered ? <span className="feature-index">{String(i + 1).padStart(2, "0")}</span> : null}
          <h3>{item.title}</h3>
          <p>{item.body}</p>
          {item.note ? <span className="feature-note">{item.note}</span> : null}
          {item.href && item.link ? <Link href={item.href} home={false} className="text-link">{item.link}<Icon /></Link> : null}
        </li>
      ))}
    </ul>
  );
}

export type Step = Readonly<{ title: string; body: string }>;

/** The home's five-column guide (quality-pass.css .work-guide), without links. */
export function StepGuide({ steps, dataComponent }: { steps: readonly Step[]; dataComponent?: string }) {
  return (
    <ol className="work-guide" data-component={dataComponent}>
      {steps.map((step, i) => (
        <li key={step.title}>
          <div className="guide-step">
            <span className="guide-number font-mono font-light">{String(i + 1).padStart(2, "0")}</span>
            <div><h3>{step.title}</h3><p>{step.body}</p></div>
          </div>
        </li>
      ))}
    </ol>
  );
}
