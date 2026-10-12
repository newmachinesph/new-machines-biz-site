"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Badge, STATUS_LABEL, type Status } from "@/design-system/components/Badge";
import { useMotionAllowed } from "@/design-system/motion/useMotionAllowed";
import { cn } from "@/lib/cn";
import { DEMO_EVIDENCE, DEMO_RUNS } from "./data";
import { Check, Mono, Window } from "./parts";

export const CYCLE_MS = 2400;
const CYCLE: readonly Status[] = ["running", "waiting-for-human", "verified"];
const COUNTERS: readonly Status[] = ["running", "waiting-for-human", "verified", "blocked"];
const NAV = ["Home", "Marketplace", "Runs", "Approvals", "Evidence", "Billing"];

/** Org home: sidebar · 4 counters · recent runs · evidence. The first run's chip cycles through the three statuses. */
export function HeroDashboard({ className, phase }: { className?: string; phase?: number }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const animated = useMotionAllowed();
  useEffect(() => {
    if (reduce !== false || phase !== undefined) return;
    const t = setInterval(() => setStep((s) => (s + 1) % CYCLE.length), CYCLE_MS);
    return () => clearInterval(t);
  }, [reduce, phase]);

  const rows = DEMO_RUNS.map((r, i) => (i === 0 ? { ...r, status: CYCLE[phase ?? step] } : r));

  return (
    <Window className={cn("grid grid-cols-1 md:grid-cols-[176px_minmax(0,1fr)] lg:grid-cols-[176px_minmax(0,1fr)_232px]", className)}>
      <div className="hidden border-r border-grey-200 bg-grey-50 p-3 md:block">
        <ul className="flex flex-col gap-0.5">
          {NAV.map((item, i) => (
            <li key={item} className={cn("flex items-center gap-2 rounded-md px-2.5 py-1.5", i === 0 ? "bg-grey-100 font-medium text-ink" : "text-grey-700")}>
              <span className={cn("size-1.5 rounded-full", i === 0 ? "bg-ink" : "bg-grey-300")} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-5 md:p-6">
        <p className="text-xl font-semibold tracking-tight">Good morning</p>
        <p className="text-grey-500">Your AI workforce is on it.</p>

        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COUNTERS.map((s) => (
            <li key={s} className="rounded-md border border-grey-200 p-3">
              <Mono>{STATUS_LABEL[s]}</Mono>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{rows.filter((r) => r.status === s).length}</p>
            </li>
          ))}
        </ul>

        <div className="mt-5 overflow-hidden rounded-md border border-grey-200">
          <div className="flex items-center justify-between border-b border-grey-200 px-4 py-2.5">
            <p className="font-semibold">Recent runs</p>
            <Mono>View all →</Mono>
          </div>
          <table className="w-full">
            <thead className="bg-grey-50">
              <tr>
                {["Run", "Agent", "Status", "Cost"].map((h) => (
                  <th key={h} scope="col" className={cn("px-4 py-2 text-left", (h === "Cost" || h === "Run") && "hidden sm:table-cell", h === "Cost" && "text-right")}>
                    <Mono>{h}</Mono>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-grey-200 transition-colors duration-150 hover:bg-grey-50">
                  <td className="hidden px-4 py-2.5 sm:table-cell font-mono text-xs text-grey-700">{r.id}</td>
                  <td className="px-4 py-2.5">{r.agent}</td>
                  <td className="px-4 py-2.5">
                    {r.id === DEMO_RUNS[0].id ? (
                      <motion.span
                        key={r.status}
                        className="inline-block"
                        initial={animated ? { opacity: 0, y: 4 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Badge status={r.status} />
                      </motion.span>
                    ) : (
                      <Badge status={r.status} />
                    )}
                  </td>
                  <td className="hidden px-4 py-2.5 text-right sm:table-cell font-mono text-xs tabular-nums">{r.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="hidden border-l border-grey-200 p-5 lg:block">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Evidence</p>
          <Mono>View all →</Mono>
        </div>
        <ul className="mt-4 flex flex-col divide-y divide-grey-200">
          {DEMO_EVIDENCE.map((e) => (
            <li key={e.title} className="flex gap-3 py-3">
              <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-ink text-paper"><Check /></span>
              <div>
                <p className="font-medium">{e.title}</p>
                <Mono>{e.meta}</Mono>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </Window>
  );
}
