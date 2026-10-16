import { MotionItem } from "@/design-system/motion/MotionItem";
import { SectionCell } from "@/home/Frame";
import NextLink from "next/link";
import { PageShell } from "@/marketplace/PageShell";
import { LEGAL_COPY } from "@/site/copy";

type LegalKind = "privacy" | "terms";
type LegalDocument = (typeof LEGAL_COPY)[LegalKind];

const OTHER: Record<LegalKind, { href: string; label: string }> = {
  privacy: { href: "/terms", label: "Terms of service" },
  terms: { href: "/privacy", label: "Privacy policy" },
};

/** One legal page: intro cell, then plain prose with a heading per section. */
export function LegalPage({ document, kind }: { document: LegalDocument; kind: LegalKind }) {
  return (
    <PageShell home={false} dataComponent={`${kind}Page`} className="site-page">
      <SectionCell labelledBy="legal-title">
        <div className="legal-intro">
          <div>
            <MotionItem><p className="section-eyebrow"><span aria-hidden="true" />{document.eyebrow}</p></MotionItem>
            <MotionItem delay={0.06}><h1 id="legal-title">{document.lead}</h1></MotionItem>
          </div>
          <MotionItem delay={0.12}><p className="legal-updated">{document.updated}</p><p>{document.intro} {LEGAL_COPY.counsel}</p></MotionItem>
        </div>
        <div className="legal-prose">
          {document.sections.map((section) => (
            <section key={section.h} aria-labelledby={`legal-${slug(section.h)}`}>
              <h2 id={`legal-${slug(section.h)}`}>{section.h}</h2>
              {section.p.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          <nav aria-label="Legal pages"><NextLink href={OTHER[kind].href}>{OTHER[kind].label}</NextLink><NextLink href="/contact">Contact</NextLink></nav>
        </div>
      </SectionCell>
    </PageShell>
  );
}

function slug(heading: string) {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
