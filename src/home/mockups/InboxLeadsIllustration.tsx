"use client";

import { ExampleBrand } from "../ExampleBrand";
import { Icon } from "../Icon";
import { useScenePlayback } from "../motion/useScenePlayback";
import { cn } from "@/lib/cn";

const DURATIONS = [900, 1400, 1700, 2000] as const;
/** The Inbox Lead Tracker's output: who asked, what for and how soon. Same fictional enquiries as the home
 *  WorkExplorer's Sales chapter; the newsletter signup is sorted out and never becomes a row. */
const ENQUIRIES = [
  { name: "Aster Labs", brand: "aster-labs", what: "Bulk order", when: "This month" },
  { name: "Meridian", brand: "meridian", what: "Price list", when: "Next week" },
  { name: "Newsletter signup", brand: null, what: "Not an enquiry, left out", when: "—" },
] as const;

/** A four-second Inbox Lead Tracker story: enquiry emails become leads-sheet rows that wait for your approval.
 *  Reuses the account-research scene classes for its frame and playback styling. */
export function InboxLeadsIllustration() {
  const playback = useScenePlayback(DURATIONS, false);
  const phase = playback.phase;
  return (
    <div ref={playback.ref} className="account-research inbox-leads" data-research-phase={phase} data-playing={playback.playing}>
      <div className="research-window">
        <div className="research-toolbar"><span><Icon name="file" />Gmail · Enquiries</span><span>This week · 3 emails</span></div>
        <div className="research-query"><span className={phase < 3 ? "scene-working-dot" : "query-complete"} /><span>{phase < 2 ? "Sorting real enquiries from the rest" : "2 real enquiries for your leads sheet"}</span><Icon name={phase < 3 ? "arrow" : "check"} /></div>
        <div className="research-table-head"><span>Who asked · What for</span><span>How soon</span></div>
        {ENQUIRIES.map((enquiry, i) => <div key={enquiry.name} className={cn("research-account-row", phase >= 1 && "account-enriched", !enquiry.brand && "lead-left-out")}>
          {enquiry.brand ? <ExampleBrand name={enquiry.brand} /> : <span className="lead-mail" aria-hidden="true"><Icon name="file" /></span>}
          <span><strong>{enquiry.name}</strong><small key={phase}>{phase === 0 ? "Reading the email" : enquiry.what}</small></span>
          <span className={cn("account-fit", phase >= 2 && "fit-ready")} style={{ animationDelay: i * 100 + "ms" }}>{phase >= 2 ? enquiry.when : <i />}</span>
        </div>)}
        <div className="research-bottom"><Icon name="shield" /><span>{phase < 3 ? "Nothing is written before you approve" : "2 rows ready for your approval"}</span><span>02 / 03</span></div>
      </div>
      <div className={cn("account-outreach", phase === 3 && "outreach-ready")}>
        <div><Icon name="grid" className="lead-sheet-icon" /><span>Leads sheet · 2 new rows</span><Icon name="check" /></div>
        <p>You approve the rows.</p><span>Aster Labs, bulk order, this month. Meridian, price list, next week.</span>
        <div className="outreach-foot"><span>Waiting for your approval</span><Icon name="arrow-up" /></div>
      </div>
    </div>
  );
}
