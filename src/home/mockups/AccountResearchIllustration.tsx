"use client";

import { ExampleBrand } from "../ExampleBrand";
import { Icon } from "../Icon";
import { useScenePlayback } from "../motion/useScenePlayback";
import { cn } from "@/lib/cn";

const DURATIONS = [900, 1400, 1700, 2000] as const;
const ACCOUNTS = [
  { name: "Aster Labs", brand: "aster-labs", signal: "Opening a Singapore office", score: 96 },
  { name: "Meridian", brand: "meridian", signal: "Hiring an operations lead", score: 91 },
  { name: "Kanso Studio", brand: "kanso-studio", signal: "Expanding into Japan", score: 88 },
] as const;

/** A four-second research story that holds the finished brief. */
export function AccountResearchIllustration() {
  const playback = useScenePlayback(DURATIONS, false);
  const phase = playback.phase;
  return (
    <div ref={playback.ref} className="account-research" data-research-phase={phase} data-playing={playback.playing}>
      <div className="research-window">
        <div className="research-toolbar"><span><Icon name="people" />Your next conversations</span><span>18 accounts</span></div>
        <div className="research-query"><span className={phase < 3 ? "scene-working-dot" : "query-complete"} /><span>{phase < 2 ? "Research these accounts against our criteria" : "A shortlist, with a reason for every match"}</span><Icon name={phase < 3 ? "arrow" : "check"} /></div>
        <div className="research-table-head"><span>Company</span><span>Fit</span></div>
        {ACCOUNTS.map((account, i) => <div key={account.brand} className={cn("research-account-row", phase >= 1 && "account-enriched")}>
          <ExampleBrand name={account.brand} />
          <span><strong>{account.name}</strong><small key={phase}>{phase === 0 ? "Gathering the context" : account.signal}</small></span>
          <span className={cn("account-fit", phase >= 2 && "fit-ready")} style={{ animationDelay: i * 100 + "ms" }}>{phase >= 2 ? account.score : <i />}</span>
        </div>)}
        <div className="research-bottom"><Icon name="shield" /><span>{phase < 3 ? "Every finding stays linked to its source" : "Research complete · Shortlist ready"}</span><span>03 / 18</span></div>
      </div>
      <div className={cn("account-outreach", phase === 3 && "outreach-ready")}>
        <div><ExampleBrand name="aster-labs" /><span>Conversation brief</span><Icon name="check" /></div>
        <p>A good reason to reach out.</p><span>Aster is building a Singapore team. Start with their new operations role.</span>
        <div className="outreach-foot"><span>Ready for your team</span><Icon name="arrow-up" /></div>
      </div>
    </div>
  );
}
