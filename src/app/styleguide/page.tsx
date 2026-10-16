import { Lockup } from "@/design-system/logo/Lockup";
import { Mark } from "@/design-system/logo/Mark";
import { Demos } from "./Demos";
import { Mockups } from "./Mockups";
import { TokenChips } from "./TokenChips";
import type { Metadata } from "next";

// An internal page: never indexed (SEO.neverIndex), not in the sitemap.
export const metadata: Metadata = { title: "Styleguide", robots: { index: false, follow: false }, alternates: { canonical: "/styleguide" } };

const FONT_SAMPLES = [
  { name: "font-display (Michroma)", cls: "font-display", text: "Verified intelligent work" },
  { name: "font-sans (Geist)", cls: "font-sans", text: "Hire an AI workforce that can use your business tools." },
  { name: "font-mono (Geist Mono)", cls: "font-mono", text: "run_01HX4… · policy_v1 · REVIEW_REQUIRED" },
];

export default function Styleguide() {
  return (
    <main className="mx-auto flex max-w-page flex-col gap-16 px-6 py-12">
      <header><h1 className="font-display text-3xl">Styleguide</h1><p className="mt-2 text-grey-500">Every token and primitive, rendered live. Change tokens.css and check here.</p></header>

      <section id="fonts" aria-labelledby="h-fonts" className="flex flex-col gap-6">
        <h2 id="h-fonts" className="text-xl font-semibold">Fonts</h2>
        {FONT_SAMPLES.map((f) => (
          <div key={f.name}>
            <p className="font-mono text-xs text-grey-500">{f.name}</p>
            <p className={`${f.cls} text-3xl`}>{f.text}</p>
            <p className={`${f.cls} text-base`}>{f.text}</p>
            <p className={`${f.cls} text-xs`}>{f.text}</p>
          </div>
        ))}
        <div><p className="font-mono text-xs text-grey-500">lang=ja → Noto Sans JP</p><p lang="ja" className="text-2xl">検証済みのインテリジェントワークのためのグローバルマーケットプレイス。</p></div>
      </section>

      <section id="colours" aria-labelledby="h-colours"><h2 id="h-colours" className="mb-4 text-xl font-semibold">Colours</h2><TokenChips /></section>

      <section id="shape" aria-labelledby="h-shape"><h2 id="h-shape" className="mb-4 text-xl font-semibold">Radius · Shadow</h2>
        <div className="flex flex-wrap gap-4">
          <div className="h-16 w-24 rounded-sm border border-grey-300 p-2 font-mono text-xs">rounded-sm</div>
          <div className="h-16 w-24 rounded-md border border-grey-300 p-2 font-mono text-xs">rounded-md</div>
          <div className="h-16 w-24 rounded-lg border border-grey-300 p-2 font-mono text-xs">rounded-lg</div>
          <div className="h-16 w-24 rounded-md bg-paper p-2 font-mono text-xs shadow-sm">shadow-sm</div>
          <div className="h-16 w-24 rounded-md bg-paper p-2 font-mono text-xs shadow-md">shadow-md</div>
        </div>
      </section>

      <section id="logo" aria-labelledby="h-logo"><h2 id="h-logo" className="mb-4 text-xl font-semibold">Logo</h2>
        <div className="flex flex-wrap items-end gap-10"><Mark className="h-4" /><Mark className="h-8" /><Mark className="h-14" /><Lockup className="h-24" /></div>
      </section>

      <section id="components" aria-labelledby="h-components"><h2 id="h-components" className="mb-6 text-xl font-semibold">Components</h2><Demos /></section>
      <section id="mockups" aria-labelledby="h-mockups"><h2 id="h-mockups" className="mb-6 text-xl font-semibold">Mockups</h2><Mockups /></section>
    </main>
  );
}
