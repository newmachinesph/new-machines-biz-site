import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** The white product window every mockup lives in (dark variant for the trust band). */
export function Window({ children, className, title, dark = false }: { children: ReactNode; className?: string; title?: ReactNode; dark?: boolean }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border text-sm shadow-sm", dark ? "border-grey-700 bg-ink text-paper" : "border-grey-200 bg-paper text-ink", className)}>
      {title ? <div className={cn("flex h-11 items-center gap-3 border-b px-4 font-medium", dark ? "border-grey-700" : "border-grey-200")}>{title}</div> : null}
      {children}
    </div>
  );
}

/** 11px mono caps metadata. */
export function Mono({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("font-mono text-[11px] uppercase tracking-wide text-grey-500", className)} {...rest} />;
}

/** Looks like a Button but is inert: mockups must not expose fake controls. */
export function FakeButton({ children, variant = "primary", className }: { children: ReactNode; variant?: "primary" | "secondary"; className?: string }) {
  return (
    <span className={cn("inline-flex h-8 items-center rounded-md px-3 text-sm font-medium", variant === "primary" ? "bg-ink text-paper" : "border border-ink text-ink", className)}>
      {children}
    </span>
  );
}

export function Avatar({ initials, tone }: { initials: string; tone?: "human" | "machine" }) {
  return (
    <span
      data-accent={tone}
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-medium",
        tone === "human" ? "bg-human-soft text-human" : tone === "machine" ? "bg-machine-soft text-machine" : "bg-grey-100 text-grey-700",
      )}
    >
      {initials}
    </span>
  );
}

export function Check({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className={cn("size-3", className)}>
      <path d="M2 6.5 4.8 9.3 10 3.6" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/** A switch drawn in black; state is announced as text for assistive tech. */
export function Toggle({ label, on = true, className }: { label: string; on?: boolean; className?: string }) {
  return (
    <span className={cn("flex items-center justify-between gap-3 text-sm", className)}>
      <span>{label}</span>
      <span aria-hidden="true" className={cn("relative inline-block h-5 w-9 shrink-0 rounded-full", on ? "bg-ink" : "bg-grey-300")}>
        <span className={cn("absolute top-0.5 size-4 rounded-full bg-paper", on ? "left-4" : "left-0.5")} />
      </span>
      <span className="sr-only">{on ? "on" : "off"}</span>
    </span>
  );
}

/** Abstract listing glyph: a black square with one accent dot naming who does the work. */
export function Glyph({ tone }: { tone?: "human" | "machine" }) {
  return (
    <span className="relative inline-block size-8 rounded-sm bg-ink">
      {tone ? (
        <span data-accent={tone} className={cn("absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-paper", tone === "human" ? "bg-human" : "bg-machine")} />
      ) : null}
    </span>
  );
}
