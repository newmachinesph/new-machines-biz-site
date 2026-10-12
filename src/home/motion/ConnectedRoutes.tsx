"use client";

import { useEffect, useState, type RefObject } from "react";

type Route = { id: string; d: string };
type Geometry = { width: number; height: number; routes: Route[] };

/** Measure only on layout changes. Every route stays in the space between cards. */
export function ConnectedRoutes({ root }: { root: RefObject<HTMLDivElement | null> }) {
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  useEffect(() => {
    const scene = root.current?.querySelector<HTMLElement>(".connected-scene");
    const agent = scene?.querySelector<HTMLElement>(".connected-agent");
    const output = scene?.querySelector<HTMLElement>(".connected-output");
    const sources = scene ? [...scene.querySelectorAll<HTMLElement>(".context-source")] : [];
    if (!scene || !agent || !output || sources.length === 0) return;
    let frame = 0;
    const measure = () => {
      const area = scene.getBoundingClientRect();
      const work = agent.getBoundingClientRect();
      const result = output.getBoundingClientRect();
      // Tablet and mobile use a stacked composition without diagram lines.
      if (sources[0].getBoundingClientRect().right >= work.left || result.left <= work.right) {
        setGeometry(null);
        return;
      }
      const targetX = work.left - area.left;
      const targetY = work.top + work.height / 2 - area.top;
      const routes = sources.map((source, index) => {
        const box = source.getBoundingClientRect();
        const x = box.right - area.left;
        const y = box.top + box.height / 2 - area.top;
        const middle = (x + targetX) / 2;
        return { id: "context-" + index, d: `M ${x} ${y} C ${middle} ${y}, ${middle} ${targetY}, ${targetX} ${targetY}` };
      });
      const x = work.right - area.left;
      const endX = result.left - area.left;
      const endY = result.top + result.height / 2 - area.top;
      const middle = (x + endX) / 2;
      routes.push({ id: "evidence", d: `M ${x} ${targetY} C ${middle} ${targetY}, ${middle} ${endY}, ${endX} ${endY}` });
      setGeometry({ width: area.width, height: area.height, routes });
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    [scene, agent, output, ...sources].forEach((element) => observer.observe(element));
    schedule();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [root]);

  if (!geometry) return null;
  return (
    <svg className="connected-routes" viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true">
      {geometry.routes.map((route, index) => (
        <g key={route.id} data-route={route.id}>
          <path className="route-track" d={route.d} />
          <path className={route.id === "evidence" ? "route-flow route-flow-output" : "route-flow route-flow-input"}
            d={route.d} pathLength="1" style={{ animationDelay: index * 180 + "ms" }} />
        </g>
      ))}
    </svg>
  );
}
