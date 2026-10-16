import { Button } from "@/design-system/components/Button";
import { Card } from "@/design-system/components/Card";
import { HOME_COPY } from "@/home/copy";
import { SectionCell } from "@/home/Frame";
import { HomepageLink as Link } from "@/home/HomepageLink";
import { Icon } from "@/home/Icon";
import { PageShell } from "@/marketplace/PageShell";
import { PageIntro } from "@/site/blocks";
import { CONTACT_COPY as C } from "@/site/copy";
import { pageMetadata } from "@/site/metadata";

export const metadata = pageMetadata({ ...C.meta, path: "/contact" });

export default function Page() {
  return (
    <PageShell home={false} dataComponent="contactPage" className="site-page">
      <PageIntro id="contact-title" {...C.intro} />

      <SectionCell labelledBy="paths-title">
        <h2 id="paths-title" className="sr-only">Who are you?</h2>
        <ul className="contact-grid" data-component="contactPaths">
          {C.paths.map((path) => {
            const primaryHref = "href" in path.primary ? path.primary.href : HOME_COPY.nav.appUrl;
            return (
              <li key={path.title}>
                <Card className="contact-card h-full">
                  <h3 className="contact-card-title">{path.title}</h3>
                  <p>{path.body}</p>
                  <div className="listing-actions">
                    <Button asChild size="md"><Link href={primaryHref} home={false}>{path.primary.label}<Icon /></Link></Button>
                    <a href={path.secondary.href} className="text-link">{path.secondary.label}</a>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
        <Card className="contact-general" data-component="contactGeneral">
          <dl>
            <div><dt>{C.general.eyebrow}</dt><dd><a href={`mailto:${C.general.email}`}>{C.general.email}</a></dd></div>
            <div><dt>{C.general.securityLabel}</dt><dd><a href={`mailto:${C.general.security}`}>{C.general.security}</a></dd></div>
            <div><dt>Region</dt><dd>{C.general.region}</dd></div>
          </dl>
          <p>{C.general.press}</p>
        </Card>
      </SectionCell>
    </PageShell>
  );
}
