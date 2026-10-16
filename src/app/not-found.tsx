import type { Metadata } from "next";
import NextLink from "next/link";
import { Button } from "@/design-system/components/Button";
import { SectionCell } from "@/home/Frame";
import { Icon } from "@/home/Icon";
import { PageShell } from "@/marketplace/PageShell";
import { NOT_FOUND_COPY as C } from "@/site/copy";

export const metadata: Metadata = { title: C.meta.title, description: C.meta.description, robots: { index: false, follow: false } };

export default function NotFound() {
  const [home, ...rest] = C.links;
  return (
    <PageShell home={false} dataComponent="notFoundPage" className="site-page">
      <SectionCell labelledBy="not-found-title">
        <div className="not-found">
          <p className="section-eyebrow"><span aria-hidden="true" />{C.eyebrow}</p>
          <h1 id="not-found-title">{C.lead} <span>{C.tail}</span></h1>
          <p>{C.sub}</p>
          <Button asChild size="lg"><NextLink href={home.href}>{home.label}<Icon /></NextLink></Button>
          <ul aria-label="Other pages">{rest.map((link) => <li key={link.href}><NextLink href={link.href} className="text-link">{link.label}<Icon /></NextLink></li>)}</ul>
        </div>
      </SectionCell>
    </PageShell>
  );
}
