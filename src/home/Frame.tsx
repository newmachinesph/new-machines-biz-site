import type { ReactNode } from "react";
import { MotionItem } from "@/design-system/motion/MotionItem";
import { cn } from "@/lib/cn";

export type SectionCellProps = {
  id?: string;
  labelledBy: string;
  dark?: boolean;
  className?: string;
  children: ReactNode;
};

/** One row of the boxed page: full-bleed background, 1392px inner column with the vertical hairlines. */
export function SectionCell({ id, labelledBy, dark = false, className, children }: SectionCellProps) {
  return (
    <section id={id ?? (labelledBy.endsWith("-title") ? labelledBy.slice(0, -6) : `${labelledBy}-section`)} aria-labelledby={labelledBy} className={cn("page-section", dark ? "bg-ink text-paper section-dark" : "bg-paper text-ink", className)}>
      <div className={cn("section-inner mx-auto w-full max-w-frame border-x border-b", dark ? "border-grey-900" : "border-grey-200")}>
        {children}
      </div>
    </section>
  );
}

export type SplitCellProps = {
  text: ReactNode;
  visual: ReactNode;
  textSide?: "left" | "right";
  dark?: boolean;
};

/** Narrow text column (380px) beside a wide visual column; sides alternate per section. */
export function SplitCell({ text, visual, textSide = "left", dark = false }: SplitCellProps) {
  const line = dark ? "border-grey-900" : "border-grey-200";
  return (
    <div className={cn("split-section grid grid-cols-1", textSide === "left" ? "lg:grid-cols-[420px_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_420px]")}>
      <div
        className={cn(
          "split-copy flex flex-col justify-center px-6 py-12 md:px-10 md:py-16",
          textSide === "left" ? "lg:order-1" : "lg:order-2",
          line,
        )}
      >
        {text}
      </div>
      <div className={cn("split-visual min-w-0", textSide === "left" ? "lg:order-2" : "lg:order-1")}>
        <MotionItem delay={0.1}>{visual}</MotionItem>
      </div>
    </div>
  );
}
