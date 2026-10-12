import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type Status = "running" | "waiting-for-human" | "verified" | "blocked";

export const STATUS_LABEL: Record<Status, string> = {
  running: "Running",
  "waiting-for-human": "Waiting for human",
  verified: "Verified",
  blocked: "Blocked",
};

const STATUS_CLASS: Record<Status, string> = {
  running: "bg-machine-soft text-machine",
  "waiting-for-human": "bg-human-soft text-human",
  verified: "bg-ink text-paper",
  blocked: "bg-blocked-soft text-blocked",
};

const STATUS_ACCENT: Record<Status, "machine" | "human" | "blocked" | undefined> = {
  running: "machine",
  "waiting-for-human": "human",
  verified: undefined,
  blocked: "blocked",
};

// Each status has its own shape so state is readable without colour.
function StatusIcon({ status }: { status: Status }) {
  const common = { "aria-hidden": true, className: "size-3", viewBox: "0 0 12 12" } as const;
  switch (status) {
    case "running":
      return <svg {...common}><circle cx="6" cy="6" r="4" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" /></svg>;
    case "waiting-for-human":
      return <svg {...common}><circle cx="6" cy="4" r="2.2" fill="currentColor" /><path d="M1.5 11a4.5 4.5 0 0 1 9 0Z" fill="currentColor" /></svg>;
    case "verified":
      return <svg {...common}><path d="M2 6.5 4.8 9.3 10 3.6" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
    case "blocked":
      return <svg {...common}><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="2" /></svg>;
  }
}

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & { status?: Status };

export function Badge({ status, className, children, ...rest }: BadgeProps) {
  return (
    <span
      data-status={status}
      data-accent={status ? STATUS_ACCENT[status] : undefined}
      className={cn(
        "inline-flex items-center whitespace-nowrap gap-1.5 rounded-sm px-2 py-0.5 text-xs font-medium",
        status ? STATUS_CLASS[status] : "bg-grey-100 text-grey-700",
        className,
      )}
      {...rest}
    >
      {status ? <StatusIcon status={status} /> : null}
      {children ?? (status ? STATUS_LABEL[status] : null)}
    </span>
  );
}
