import { useId } from "react";
import { cn } from "@/lib/cn";

export type HatchLineProps = {
  className?: string;
  steps?: number;
  active?: number;
  orientation?: "horizontal" | "vertical";
  /** after (default): segments from `active` on are solid - the logo's hatch→solid reading.
   *  before: segments before `active` are solid - a progress fill. */
  fill?: "after" | "before";
};

// The logo's hatched-to-solid motif as a connector. Segments are plain rects so repeated instances never collide.
export function HatchLine({ className, steps = 5, active = 1, orientation = "horizontal", fill = "after" }: HatchLineProps) {
  const id = useId();
  const seg = 100 / steps;
  const vertical = orientation === "vertical";
  return (
    <svg
      aria-hidden="true"
      viewBox={vertical ? "0 0 6 100" : "0 0 100 6"}
      preserveAspectRatio="none"
      className={cn(vertical ? "h-full w-1.5" : "h-1.5 w-full", "text-ink", className)}
    >
      <defs>
        <pattern id={`${id}-hatch`} width="3" height="6" patternUnits="userSpaceOnUse" patternTransform={vertical ? "rotate(90) skewX(-36)" : "skewX(-36)"}>
          <rect width="1" height="6" fill="currentColor" />
        </pattern>
      </defs>
      {Array.from({ length: steps }, (_, i) => {
        const solid = fill === "after" ? i >= active : i < active;
        const along = i * seg + 0.5;
        return (
          <rect
            key={i}
            data-segment={solid ? "solid" : "hatch"}
            x={vertical ? 0 : along}
            y={vertical ? along : 0}
            width={vertical ? 6 : seg - 1}
            height={vertical ? seg - 1 : 6}
            fill={solid ? "currentColor" : `url(#${id}-hatch)`}
          />
        );
      })}
    </svg>
  );
}
