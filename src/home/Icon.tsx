import type { CSSProperties } from "react";

type IconName = "arrow" | "arrow-up" | "check" | "grid" | "shield" | "file" | "people" | "globe" | "play" | "spark" | "connect" | "plus";
const paths: Record<IconName, string[]> = {
  arrow: ["M4 12h15", "m13 6 6 6-6 6"],
  "arrow-up": ["M5 19 19 5", "M5 5h14v14"],
  check: ["m5 12 4 4L19 6"],
  grid: ["M4 4h6v6H4z", "M14 4h6v6h-6z", "M4 14h6v6H4z", "M14 14h6v6h-6z"],
  shield: ["M12 3 4 6v6c0 4 8 9 8 9s8-5 8-9V6l-8-3Z", "m8 12 3 3 5-6"],
  file: ["M13 3H5v18h14V9l-6-6Z", "M13 3v6h6", "M8 13h8M8 17h5"],
  people: ["M16 21v-3a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v3", "M9.5 4a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z", "M17 5a3.5 3.5 0 0 1 0 7M21 21v-3a4 4 0 0 0-3-4"],
  globe: ["M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z", "M3 12h18", "M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"],
  play: ["m9 5 10 7-10 7V5Z"],
  spark: ["m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"],
  connect: ["M8 3v5h8V3M12 8v5M5 21v-5h14v5M12 13v3"],
  plus: ["M12 5v14M5 12h14"],
};

export function Icon({ name = "arrow", className, style }: { name?: IconName; className?: string; style?: CSSProperties }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className ?? "nm-icon"} style={style}>{paths[name].map((d) => <path key={d} d={d} />)}</svg>;
}
