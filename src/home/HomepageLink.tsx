import NextLink from "next/link";
import type { ComponentProps } from "react";

const LANDING_DESTINATIONS: Record<string, string> = {
  "/marketplace": "#hire",
  "/app": "#work-explorer",
  "/developers": "#integrations",
  "/work": "#human",
};

/** Same-page section links use the browser's anchor handling. Routes use Next. */
export function HomepageLink({ href, ...props }: ComponentProps<"a"> & { href: string }) {
  const fragment = LANDING_DESTINATIONS[href] ?? (href.startsWith("/#") ? href.slice(1) : href.startsWith("#") ? href : null);
  return fragment ? <a href={fragment} {...props} /> : <NextLink href={href} {...props} />;
}
