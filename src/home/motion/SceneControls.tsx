"use client";

import type { CSSProperties } from "react";
import type { useScenePlayback } from "./useScenePlayback";

type Playback = ReturnType<typeof useScenePlayback>;
export function SceneControls({ playback, labels, durations, name }: {
  playback: Playback; labels: readonly string[]; durations: readonly number[]; name: string;
}) {
  return (
    <div className="scene-controls">
      <div role="group" aria-label={name + " stages"}>
        {labels.map((label, index) => (
          <button key={label} type="button" aria-label={"0" + (index + 1) + " " + label} aria-pressed={playback.phase === index}
            onClick={() => playback.select(index)} style={{ "--stage-duration": durations[index] + "ms" } as CSSProperties}>
            <span className="stage-index">{"0" + (index + 1)}</span>{label}
            {playback.phase === index && playback.playing ? <i key={playback.phase} className="stage-progress" aria-hidden="true" /> : null}
          </button>
        ))}
      </div>
      {!playback.reduced ? <button type="button" className="scene-play-toggle" onClick={playback.toggle}
        aria-label={(playback.paused ? "Play " : "Pause ") + name}><span className="play-toggle-label">{playback.paused ? "Play" : "Pause"}</span><span aria-hidden="true">{playback.paused ? "▷" : "Ⅱ"}</span></button> : null}
    </div>
  );
}
