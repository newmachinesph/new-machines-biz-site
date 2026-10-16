import { ImageResponse } from "next/og";
import { SITE } from "@/site/copy";

export const alt = `${SITE.name} - ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// The site ships as a static export too, which needs the card rendered at build time.
export const dynamic = "force-static";

/** The site-wide share card: wordmark, the two-tone tagline and the domain, in the site's neutrals. */
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#ffffff", color: "#111111", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[0, 1, 2].map((bar) => <div key={bar} style={{ width: 14, height: 44, background: "#111111", transform: "skewX(-18deg)" }} />)}
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -1 }}>{SITE.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 76, fontWeight: 500, letterSpacing: -4, lineHeight: 1.02 }}>A new kind of workforce.</div>
          <div style={{ fontSize: 76, fontWeight: 500, letterSpacing: -4, lineHeight: 1.02, color: "#6f6f78" }}>Agents execute. Humans decide.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#6f6f78" }}>
          <div>{SITE.tagline}</div>
          <div>{SITE.domain}</div>
        </div>
      </div>
    ),
    size,
  );
}
