"use client";

import { useEffect } from "react";
import { useMotionAllowed } from "@/design-system/motion/useMotionAllowed";

/** One observer for the editorial blocks that do not use MotionItem. */
export function PageEntrances() {
  const allowed = useMotionAllowed();
  useEffect(() => {
    if (!allowed) return;
    const active = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        observer.unobserve(element);
        const siblingIndex = element.parentElement ? [...element.parentElement.children].indexOf(element) : 0;
        const delay = element.matches(".receipt-checks > div, .work-guide > li") ? siblingIndex * 55 : 0;
        const animation = element.animate(
          [{ opacity: .3, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 460, delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" },
        );
        active.add(animation);
        animation.finished.then(() => active.delete(animation), () => active.delete(animation));
      }
    }, { threshold: .15 });
    document.querySelectorAll(".marketing-home .section-opener > div:first-child, .marketing-home .section-opener > p, .marketing-home .story-card, .marketing-home .receipt-checks > div, .marketing-home .work-guide > li").forEach((element) => observer.observe(element));
    return () => { observer.disconnect(); active.forEach((animation) => animation.cancel()); };
  }, [allowed]);
  return null;
}
