"use client";

import Image from "next/image";
import { Icon } from "../Icon";
import { Mark } from "@/design-system/logo/Mark";
import { AgentPortrait } from "./AgentPortrait";
import { useScenePlayback } from "../motion/useScenePlayback";
import { SceneControls } from "../motion/SceneControls";
import { ConnectedRoutes } from "../motion/ConnectedRoutes";
import { cn } from "@/lib/cn";

const DURATIONS = [2600, 2800, 3000, 4000] as const;
const LABELS = ["Context", "Agent work", "Approval", "Evidence"] as const;
const SOURCES = [
  { app: "Gmail", icon: "gmail-official", file: "Customer conversations", detail: "Recent feedback · Read access" },
  { app: "Google Drive", icon: "google-drive-official", file: "Your product strategy", detail: "One folder · Read access" },
  { app: "Google Sheets", icon: "google-sheets-official", file: "Your market watchlist", detail: "One sheet · Read access" },
] as const;

export function ConnectedWork() {
  const playback = useScenePlayback(DURATIONS);
  const phase = playback.phase;
  return (
    <div ref={playback.ref} className="connected-work" data-phase={phase} data-playing={playback.playing}>
      <div className="connected-toolbar"><span><Mark title="" trim />One task. All the context.</span><span><Icon name="shield" />Permissioned access</span></div>
      <div className="connected-scene">
        <ConnectedRoutes root={playback.ref} />
        <div className="context-sources">
          <span className="scene-kicker">Already in your tools</span>
          {SOURCES.map((source, index) => <div className={cn("context-source", phase > 0 && "context-source-read")} key={source.app} style={{ animationDelay: index * 90 + "ms" }}>
            <Image src={"/brands/" + source.icon + ".svg"} width={24} height={24} alt={source.app} />
            <div><span>{source.app}</span><strong>{source.file}</strong><small>{source.detail}</small></div>
            <span className="source-read-state"><Icon name={phase > 0 ? "check" : "file"} /></span>
          </div>)}
        </div>
        <div className="connected-agent">
          <div className="connected-agent-heading"><AgentPortrait kind="pack" /><div><strong>Market brief</strong><span>New Machines / Research</span></div><i className={phase === 1 ? "scene-working-dot" : ""} /></div>
          <div className="connected-action" key={phase}>
            <span className="scene-kicker">{LABELS[phase]}</span>
            <p>{["The right context, together.", "Finding the useful signals.", "One insight needs your view.", "Work done. Proof included."][phase]}</p>
            <div className="connected-fields">
              <span><span>Read the source material<small>Conversations, strategy, watchlist</small></span><span className="work-step-state"><Icon name={phase > 0 ? "check" : "file"} /></span></span>
              <span><span>Find the common signal<small>Japan launch interest</small></span><span className="work-step-state"><Icon name={phase > 0 ? "check" : "file"} /></span></span>
              <span className={phase === 2 ? "field-needs-review" : ""}><span>Review the next step<small>Human decision required</small></span><strong>{phase < 2 ? "Checking" : phase === 2 ? "Needs review" : "Confirmed"}</strong></span>
            </div>
          </div>
          <div className={cn("connected-approval", phase >= 2 && "approval-present")}>
            <AgentPortrait kind="human" /><div><strong>M. Tanaka</strong><span>{phase === 3 ? "Approval preserved" : "Qualified reviewer · Tokyo"}</span></div><span className="approval-indicator">{phase === 3 ? <Icon name="check" /> : "Review"}</span>
          </div>
        </div>
        <div className={cn("connected-output", phase === 3 && "output-ready")}>
          <div className="brief-file-header"><Icon name="file" /><span>market_brief.pdf</span><span>01 / 01</span></div>
          <div className="brief-document">
            <span className="scene-kicker">Your weekly market brief</span>
            <strong>A signal worth<br />acting on.</strong>
            <div className="brief-content" data-ready={phase > 0}>
              <span className="brief-topic">Japan launch interest <sup>[1]</sup></span>
              <p>Start with five discovery calls. Test demand before committing a team.</p>
              <div className="brief-citations"><span>[1] Customer conversations</span><span>[2] Product strategy</span><span>[3] Market watchlist</span></div>
            </div>
            <div className="brief-placeholder" aria-hidden="true"><i /><i /><i /><i /></div>
          </div>
          <div className="brief-proof"><span className="output-status"><Icon name={phase === 3 ? "shield" : "file"} />{phase === 3 ? "Verified" : phase === 2 ? "Awaiting approval" : phase === 1 ? "Building the brief" : "Awaiting the work"}</span><span>{phase === 3 ? "3 sources · Human approved" : "Sources stay attached"}</span></div>
        </div>
      </div>
      <SceneControls playback={playback} labels={LABELS} durations={DURATIONS} name="connected work" />
    </div>
  );
}
