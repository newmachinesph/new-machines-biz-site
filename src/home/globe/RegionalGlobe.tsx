"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "../Icon";
import { REGIONAL_MARKETS } from "./markets";
import type { GlobeController } from "./createGlobe";

export function RegionalGlobe() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const controller = useRef<GlobeController | null>(null);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    let disposed = false;
    let loading = false;
    let visible = false;
    const abort = new AbortController();
    const observer = new IntersectionObserver(async ([entry]) => {
      visible = entry.isIntersecting;
      controller.current?.setVisible(visible);
      if (!visible || loading) return;
      loading = true;
      try {
        const { createGlobe } = await import("./createGlobe");
        const globe = await createGlobe(canvas.current!, labels.current, abort.signal);
        if (disposed) { globe.dispose(); return; }
        controller.current = globe;
        globe.setVisible(visible);
        setReady(true);
      } catch {
        // The matching SVG stays visible if the device cannot create a WebGL context.
      }
    }, { rootMargin: "180px" });
    observer.observe(element);
    return () => {
      disposed = true;
      abort.abort();
      observer.disconnect();
      controller.current?.dispose();
      controller.current = null;
    };
  }, []);

  return (
    <div className="regional-globe" data-ready={ready}>
      <div ref={host} className="globe-stage" aria-hidden="true">
        <Image className="globe-fallback" src="/globe/japac-fallback.svg" width={600} height={600} alt="" />
        <canvas ref={canvas} className="globe-canvas" />
        <div className="globe-labels">{REGIONAL_MARKETS.map((market, i) => <span key={market.city} ref={(el) => { labels.current[i] = el; }} className="globe-city-label">{market.city}</span>)}</div>
        <span className="globe-overline">Leading JAPAC tech hubs</span>
      </div>
      <div className="globe-controls" role="group" aria-label="Explore a JAPAC market">
        {REGIONAL_MARKETS.map((market, i) => <button key={market.city} type="button" aria-label={`Focus ${market.city}, ${market.country}`} aria-pressed={active === i} onClick={() => { setActive(i); controller.current?.focus(i); }}><span>{market.city}</span><span>{market.country}</span><Icon name="arrow-up" /></button>)}
      </div>
      <p className="globe-caption"><Icon name="globe" />{ready ? "Drag to explore. Select a market to focus." : "Japan and Asia-Pacific, in view."}</p>
    </div>
  );
}
