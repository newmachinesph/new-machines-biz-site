"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { useMotionAllowed } from "./useMotionAllowed";

export type MotionItemProps = {
  children: ReactNode;
  className?: string;
  /** Seconds; stagger siblings by 0.06 each. */
  delay?: number;
  /** Animate on mount (hero) instead of on first scroll into view. */
  rise?: boolean;
};

/** The one shared motion wrapper. Server components can use it; it snaps to the visible final state under reduced motion. */
export function MotionItem({ children, className, delay = 0, rise = false }: MotionItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const entered = useInView(ref, { once: true, amount: .15 });
  const allowed = useMotionAllowed();
  const played = useRef(false);
  // Server content stays visible. Establish an entrance origin only in view.
  useEffect(() => {
    if (!allowed || !entered || played.current || !ref.current?.animate) return;
    played.current = true;
    const animation = ref.current.animate(
      [{ opacity: .25, transform: "translateY(" + (rise ? 22 : 14) + "px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: rise ? 650 : 480, delay: delay * 1000, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" },
    );
    return () => animation.cancel();
  }, [allowed, entered, delay, rise]);
  return <div ref={ref} className={className}>{children}</div>;
}
