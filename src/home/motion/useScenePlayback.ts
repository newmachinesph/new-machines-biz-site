"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
const notifyVisibility = () => listeners.forEach((listener) => listener());
function subscribeVisibility(listener: () => void) {
  if (listeners.size === 0) document.addEventListener("visibilitychange", notifyVisibility);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) document.removeEventListener("visibilitychange", notifyVisibility);
  };
}
const getVisibility = () => !document.hidden;
const getServerVisibility = () => true;

export function useDocumentVisible() {
  return useSyncExternalStore(subscribeVisibility, getVisibility, getServerVisibility);
}

/** Scene clocks run only while their work can actually be seen. */
export function useScenePlayback(durations: readonly number[], loop = true) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: .25 });
  const preference = useReducedMotion();
  const documentVisible = useDocumentVisible();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  // Open previews hold the clock without touching `paused`, so closing the last one resumes only what was playing.
  const [holds, setHolds] = useState(0);
  useEffect(() => setMounted(true), []);
  const reduced = mounted && preference === true;
  const playing = mounted && preference === false && inView && documentVisible && !paused && holds === 0 && (loop || step < durations.length - 1);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setStep((current) => (current + 1) % durations.length), durations[step]);
    return () => window.clearTimeout(timer);
  }, [durations, playing, step]);
  const select = (index: number) => { setStep(index); setPaused(true); };
  return {
    ref, phase: reduced && !paused ? durations.length - 1 : step,
    playing, paused, reduced, select,
    toggle: () => setPaused((value) => !value),
    hold: (on: boolean) => setHolds((count) => Math.max(0, count + (on ? 1 : -1))),
  };
}
