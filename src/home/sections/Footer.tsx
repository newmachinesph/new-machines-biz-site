import { HomepageLink as Link } from "../HomepageLink";
import { Lockup } from "@/design-system/logo/Lockup";
import { HOME_COPY } from "../copy";
import { Icon } from "../Icon";

export function Footer({ home = true }: { home?: boolean }) {
  const { columns, legal } = HOME_COPY.footer;
  return (
    <footer className="site-footer bg-paper">
      <div className="footer-top mx-auto grid max-w-frame gap-10 border-x border-grey-200 px-6 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:px-10">
        <div className="text-ink">
          <Lockup className="h-14 footer-lockup" trim />
          <p className="footer-tagline">Intelligent work.<br />Human judgment.<br />Evidence you can inspect.</p>
        </div>
        <nav aria-label="Footer" className="contents">
          {columns.map((c) => (
            <div key={c.title}>
              <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-grey-500">{c.title}</h3>
              <ul className="mt-3 flex flex-col gap-2 text-sm">
                {c.links.map((l) => (
                  <li key={l.label}><Link href={l.href} home={home} className="text-grey-700 transition-colors duration-150 hover:text-ink">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© 2026 New Machines</span>
        <nav aria-label="Legal" className="footer-legal">{legal.map((l) => <Link key={l.href} href={l.href} home={home}>{l.label}</Link>)}</nav>
        <span className="footer-locale"><Icon name="globe" />Support in Japanese and English · Japan & Asia-Pacific</span>
        <a href="#main-content">Back to top ↑</a>
      </div>
    </footer>
  );
}
