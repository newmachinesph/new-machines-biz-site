"use client";

import { useEffect, useState } from "react";

const COLOUR_TOKENS = [
  "ink", "paper", "grey-50", "grey-100", "grey-200", "grey-300", "grey-500", "grey-700", "grey-900",
  "machine", "machine-soft", "human", "human-soft", "blocked", "blocked-soft",
];

/** Accepts #rgb or #rrggbb (the production build minifies #111111 to #111); returns #rrggbb or null. */
export function normaliseHex(value: string): string | null {
  const m = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1];
  return `#${h.toLowerCase()}`;
}

function luminance(hex: string): number {
  const n = hex.slice(1);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastOnWhite(hex: string): number {
  return (1.05) / (luminance(hex) + 0.05);
}

export function TokenChips() {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    setValues(Object.fromEntries(COLOUR_TOKENS.map((t) => [t, style.getPropertyValue(`--color-${t}`)])));
  }, []);
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {COLOUR_TOKENS.map((t) => {
        const hex = values[t] ? normaliseHex(values[t]) : null;
        const ratio = hex ? contrastOnWhite(hex) : null;
        return (
          <li key={t} data-token={t} data-ratio={ratio ?? undefined} className="rounded-md border border-grey-200 p-3">
            <div className="h-10 rounded-sm border border-grey-200" style={{ background: `var(--color-${t})` }} />
            <p className="mt-2 font-mono text-xs">{t}</p>
            <p className="font-mono text-xs text-grey-500">
              {hex ?? "…"}
              {ratio ? ` · ${ratio.toFixed(1)}:1` : ""}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
