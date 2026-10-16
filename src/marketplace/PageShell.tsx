import type { ReactNode } from "react";
import { Nav } from "@/home/sections/Nav";
import { Footer } from "@/home/sections/Footer";
import { PageEntrances } from "@/home/motion/PageEntrances";
import { cn } from "@/lib/cn";

export type PageShellProps = {
  children: ReactNode;
  /** On the homepage section links stay plain anchors; elsewhere they route back to `/#section`. */
  home: boolean;
  /** The nav link that matches this page (`aria-current="page"`). */
  current?: string;
  dataComponent?: string;
  /** Extra class on <main>; the company pages pass `site-page`, the root every rule in src/site/site.css is scoped to. */
  className?: string;
};

/** Nav, the editorial entrance observer, the boxed `.marketing-home` main and the footer, shared by every marketing page. */
export function PageShell({ children, home, current, dataComponent = "pageShell", className }: PageShellProps) {
  return (
    <>
      <Nav home={home} current={current} />
      <PageEntrances />
      <main id="main-content" className={cn("marketing-home", className)} data-component={dataComponent}>{children}</main>
      <Footer home={home} />
    </>
  );
}
