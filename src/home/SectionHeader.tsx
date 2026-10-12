import { MotionItem } from "@/design-system/motion/MotionItem";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SectionHeaderProps = {
  id: string;
  ariaLabel?: string;
  eyebrow: string;
  /** Black (or paper) lead clause of the two-tone headline. */
  lead: ReactNode;
  /** Grey tail of the headline. */
  tail?: string;
  sub?: string;
  /** Larger editorial heading, using the same sans-serif as the rest of the page. */
  display?: boolean;
  dark?: boolean;
  className?: string;
};

/** Gumloop's opener: eyebrow → two-tone H2 → one grey sub-line, each fading up in turn. */
export function SectionHeader({ id, ariaLabel, eyebrow, lead, tail, sub, display = false, dark = false, className }: SectionHeaderProps) {
  const leadColor = dark ? "text-paper" : "text-ink";
  const tailColor = dark ? "text-grey-300" : "text-grey-500";
  return (
    <div className={cn("section-heading flex max-w-md flex-col", className)}>
      <MotionItem>
        <p className={cn("section-eyebrow font-mono text-xs uppercase tracking-[0.12em]", tailColor)}><span aria-hidden="true" />{eyebrow}</p>
      </MotionItem>
      <MotionItem delay={0.06}>
        <h2
          id={id}
          aria-label={ariaLabel}
          className={cn(
            "mt-3 text-balance tracking-tight font-sans font-medium",
            display ? "section-heading-display text-[2rem] leading-[1.12] md:text-[2.25rem]" : "text-[2rem] leading-[1.12] md:text-[2.25rem]",
          )}
        >
          <span className={leadColor}>{lead}</span>
          {tail ? <> <span className={cn("font-medium", tailColor)}>{tail}</span></> : null}
        </h2>
      </MotionItem>
      {sub ? (
        <MotionItem delay={0.12}>
          <p className={cn("mt-4 text-base leading-relaxed", tailColor)}>{sub}</p>
        </MotionItem>
      ) : null}
    </div>
  );
}
