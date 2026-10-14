import NextLink from "next/link";
import type { ComponentProps } from "react";

const LANDING_DESTINATIONS: Partial<Record<string, string>> = {
  "/app": "#work-explorer",
  "/developers": "#integrations",
  "/work": "#human",
};

/** Same-page section links use the browser's anchor handling. Routes use Next.
 *  Off the homepage (`home={false}`) a section link becomes a route back to that section. */
export function HomepageLink({ href, home = true, ...props }: ComponentProps<"a"> & { href: string; home?: boolean }) {
  const fragment = LANDING_DESTINATIONS[href] ?? (href.startsWith("/#") ? href.slice(1) : href.startsWith("#") ? href : null);
  if (!fragment) return <NextLink href={href} {...props} />;
  return home ? <a href={fragment} {...props} /> : <NextLink href={`/${fragment}`} {...props} />;
}
