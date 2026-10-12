"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/** True only after mount and only when the user has not asked for reduced motion.
 *  useReducedMotion() is null on the server, so gating on mount keeps the first client render identical to the server HTML. */
export function useMotionAllowed(): boolean {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted && reduce === false;
}
