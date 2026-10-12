import { cn } from "@/lib/cn";
import Image from "next/image";

/** A small visual identity based on each specialist's actual work. */
export function AgentPortrait({ kind = "invoice", className }: { kind?: "invoice" | "pack" | "human" | "leads" | "receipt" | "support"; className?: string }) {
  if (kind === "human") return <span data-accent="human" className={cn("agent-portrait portrait-human", className)}><Image src="/reviewer.jpg" alt="" width={80} height={80} className="portrait-image" /></span>;
  return (
    <span data-accent={kind === "pack" ? undefined : "machine"} className={cn("agent-portrait", `portrait-${kind}`, className)}>
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        {kind === "invoice" ? <><path d="M14 7h20v31H14zM8 15v26h19" /><path d="M19 16h10M19 22h10M19 28h6" /><path d="m28 33 3 3 7-8" /></> : null}
        {kind === "pack" ? <><path d="m24 5 17 10-17 10L7 15 24 5Z" /><path d="m7 24 17 10 17-10M7 33l17 10 17-10M24 25v18" /></> : null}
        {kind === "leads" ? <><circle cx="24" cy="17" r="7" /><path d="M11 39c0-10 26-10 26 0M5 10h8M9 6v8M37 24h7M40.5 20.5v7" /><path d="M10 28v-7M38 10h-7" /></> : null}
        {kind === "receipt" ? <><path d="M14 7h20v34l-5-3-5 3-5-3-5 3V7Z" /><path d="M19 15h10M19 21h10M19 27h6" /></> : null}
        {kind === "support" ? <><path d="M7 10h34v24H22L12 42v-8H7V10Z" /><path d="M15 18h18M15 25h12" /></> : null}
      </svg>
    </span>
  );
}
