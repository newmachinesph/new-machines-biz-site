import NextLink from "next/link";
import type { ComponentProps } from "react";

/** The app's own routes land on the homepage section that demonstrates them. */
const LANDING_DESTINATIONS: Partial<Record<string, string>> = {
  "/app": "#work-explorer",
};

/** Same-page section links use the browser's anchor handling. Routes use Next.
 *  Off the homepage (`home={false}`) a section link becomes a route back to that section. */
export function HomepageLink({ href, home = true, ...props }: ComponentProps<"a"> & { href: string; home?: boolean }) {
  // Off-site and mailto links gain nothing from NextLink, and in dev a NextLink child crashes <Button asChild>.
  if (/^(https?:\/\/|mailto:)/.test(href)) return <a href={href} {...props} />;
  const fragment = LANDING_DESTINATIONS[href] ?? (href.startsWith("/#") ? href.slice(1) : href.startsWith("#") ? href : null);
  if (!fragment) return <NextLink href={href} {...props} />;
  return home ? <a href={fragment} {...props} /> : <NextLink href={`/${fragment}`} {...props} />;
}
