import type { Variants } from "motion/react";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const DURATION = { fade: 0.5, rise: 0.7 } as const;
/** Fade-up on first view: every section's children. */
export const FADE_UP: Variants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
/** Rise on mount: the hero mockup. */
export const RISE: Variants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
export const VIEWPORT = { once: true, amount: 0.25 } as const;
