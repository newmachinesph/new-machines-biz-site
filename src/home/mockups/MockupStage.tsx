import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type MockupStageProps = {
  children: ReactNode;
  /** Height and any overrides, e.g. "h-[520px]". */
  className?: string;
  /** bleed: overflows the right edge on desktop (split cells). center: centred, full width (hero). */
  align?: "bleed" | "center";
  dark?: boolean;
  caption?: string;
  /** Content-fit product scene without cropping, nesting, or a bottom fade. */
  presentation?: "preview" | "scene";
};

/** Grey stage + white window, cropped by the cell and faded into the section background. */
export function MockupStage({ children, className, align = "bleed", dark = false, caption, presentation = "preview" }: MockupStageProps) {
  if (presentation === "scene") {
    return (
      <figure className={cn("product-scene", dark && "scene-dark", className)}>
        <div className="scene-content">{children}</div>
        {caption ? <figcaption className="scene-caption">{caption}</figcaption> : null}
      </figure>
    );
  }
  return (
    <figure className={cn("relative h-[520px] overflow-hidden", dark ? "bg-grey-900" : "bg-grey-50", className)}>
      <div
        className={cn(
          "absolute top-8 md:top-12",
          align === "bleed" ? "left-6 w-[calc(100%-1.5rem)] md:left-10 md:w-[112%]" : "left-1/2 w-[calc(100%-3rem)] max-w-[1180px] -translate-x-1/2",
        )}
      >
        {children}
      </div>
      <div data-fade aria-hidden="true" className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-[120px] bg-linear-to-t to-transparent", dark ? "from-ink" : "from-paper")} />
      {caption ? <figcaption className={cn("absolute bottom-3 right-4 rounded-sm px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wide", dark ? "bg-ink text-grey-300" : "bg-paper text-grey-500")}>
        {caption}
      </figcaption> : null}
    </figure>
  );
}
