import type { ReactNode } from "react";
import { Nav } from "@/home/sections/Nav";
import { Footer } from "@/home/sections/Footer";
import { PageEntrances } from "@/home/motion/PageEntrances";

export type PageShellProps = {
  children: ReactNode;
  /** On the homepage section links stay plain anchors; elsewhere they route back to `/#section`. */
  home: boolean;
  /** The nav link that matches this page (`aria-current="page"`). */
  current?: string;
  dataComponent?: string;
};

/** Nav, the editorial entrance observer, the boxed `.marketing-home` main and the footer, shared by every marketing page. */
export function PageShell({ children, home, current, dataComponent = "pageShell" }: PageShellProps) {
  return (
    <>
      <Nav home={home} current={current} />
      <PageEntrances />
      <main id="main-content" className="marketing-home" data-component={dataComponent}>{children}</main>
      <Footer home={home} />
    </>
  );
}
