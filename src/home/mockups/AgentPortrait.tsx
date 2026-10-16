import { cn } from "@/lib/cn";
import Image from "next/image";

/** A small visual identity based on each specialist's actual work. */
export function AgentPortrait({ kind = "invoice", className }: { kind?: "invoice" | "pack" | "human" | "leads" | "receipt" | "support" | "contract" | "brief" | "vendor" | "reminder" | "calendar"; className?: string }) {
  if (kind === "human") return <span data-accent="human" className={cn("agent-portrait portrait-human", className)}><Image src="/reviewer.jpg" alt="" width={80} height={80} className="portrait-image" /></span>;
  return (
    <span data-accent={kind === "pack" ? undefined : "machine"} className={cn("agent-portrait", `portrait-${kind}`, className)}>
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        {kind === "invoice" ? <><path d="M14 7h20v31H14zM8 15v26h19" /><path d="M19 16h10M19 22h10M19 28h6" /><path d="m28 33 3 3 7-8" /></> : null}
        {kind === "pack" ? <><path d="m24 5 17 10-17 10L7 15 24 5Z" /><path d="m7 24 17 10 17-10M7 33l17 10 17-10M24 25v18" /></> : null}
        {kind === "leads" ? <><circle cx="24" cy="17" r="7" /><path d="M11 39c0-10 26-10 26 0M5 10h8M9 6v8M37 24h7M40.5 20.5v7" /><path d="M10 28v-7M38 10h-7" /></> : null}
        {kind === "receipt" ? <><path d="M14 7h20v34l-5-3-5 3-5-3-5 3V7Z" /><path d="M19 15h10M19 21h10M19 27h6" /></> : null}
        {kind === "support" ? <><path d="M7 10h34v24H22L12 42v-8H7V10Z" /><path d="M15 18h18M15 25h12" /></> : null}
        {kind === "contract" ? <><path d="M12 6h17l7 7v29H12V6Z" /><path d="M29 6v7h7" /><path d="M18 20h12M18 26h12M18 32h6" /><circle cx="33" cy="34" r="4.5" /><path d="m31 34 1.5 1.5L35 33" /></> : null}
        {kind === "brief" ? <><path d="M8 8h32v32H8V8Z" /><path d="M14 14h12" /><path d="M15 33v-8M23 33V19M31 33v-5" /><path d="M14 33h20" /></> : null}
        {kind === "vendor" ? <><path d="m8 18 4-10h24l4 10H8Z" /><path d="M8 18c0 3 2.7 5 6 5s6-2 6-5c0 3 2.7 5 6 5s6-2 6-5c0 3 2.7 5 6 5s6-2 6-5" /><path d="M12 23v18h24V23M21 41V30h6v11" /></> : null}
        {kind === "reminder" ? <><path d="M5 11h30v21H5V11Z" /><path d="m5 11 15 11 15-11" /><circle cx="36" cy="35" r="7" /><path d="M36 31v4l3 2" /></> : null}
        {kind === "calendar" ? <><path d="M8 11h32v29H8V11Z" /><path d="M8 19h32M16 6v9M32 6v9" /><path d="M15 26h5M22 26h5M29 26h4M15 33h5M22 33h5" /></> : null}
      </svg>
    </span>
  );
}
