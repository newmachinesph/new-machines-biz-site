"use client";

import Image from "next/image";
import { useRef } from "react";
import { useInView } from "motion/react";
import { useMotionAllowed } from "@/design-system/motion/useMotionAllowed";
import { useDocumentVisible } from "./useScenePlayback";

export function LogoReel({ companies }: { companies: readonly { name: string; asset: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: .2 });
  const motion = useMotionAllowed();
  const documentVisible = useDocumentVisible();
  return (
    <div ref={ref} className="logo-reel" data-reel-playing={visible && motion && documentVisible}>
      <div className="roster-window" tabIndex={0} aria-label="Fictional company logos. Focus to pause and scroll to explore.">
        <div className="roster-track">
          {[false, true].map((duplicate) => (
            <ul key={String(duplicate)} className={"customer-roster japac-roster " + (duplicate ? "roster-duplicate" : "roster-primary")} aria-label={duplicate ? undefined : "Fictional companies imagined for Japan and Asia-Pacific"} aria-hidden={duplicate ? true : undefined}>
              {companies.map(({ name, asset }) => <li key={name}><Image className="japac-brand-logo fictional-brand-logo" src={"/brands/fictional/" + asset + ".svg"} width={150} height={40} alt={duplicate ? "" : name} loading="eager" /></li>)}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
