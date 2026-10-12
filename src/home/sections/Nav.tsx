import { HomepageLink as Link } from "../HomepageLink";
import { Button } from "@/design-system/components/Button";
import { Dialog } from "@/design-system/components/Dialog";
import { Mark } from "@/design-system/logo/Mark";
import { HOME_COPY } from "../copy";
import { Icon } from "../Icon";

export function Nav() {
  const { links, secondaryAction, getStarted, appUrl, menu } = HOME_COPY.nav;
  return (
    <header className="site-header sticky top-0 z-30 border-b border-grey-200 bg-paper">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="announcement-bar"><Link href="/#sandbox"><span>Try before you hire.</span> Meet your next workforce in the sandbox<Icon /></Link></div>
      <nav aria-label="Primary" className="site-nav mx-auto flex max-w-frame items-center gap-8 border-x border-grey-200 px-6">
        <Link href="/" aria-label="New Machines" className="nav-brand text-ink"><Mark className="h-4" title="" trim /></Link>
        <ul className="hidden items-center gap-6 text-sm text-grey-700 lg:flex">
          {links.map((l) => (
            <li key={l.href}><Link href={l.href} className="transition-colors duration-150 hover:text-ink">{l.label}</Link></li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex"><Link href="/app">{secondaryAction}</Link></Button>
          <Button asChild size="sm" className="nav-start"><Link href={appUrl}>{getStarted}<Icon /></Link></Button>
          <Dialog trigger={<Button variant="ghost" size="sm" className="lg:hidden">{menu}</Button>} title={menu}>
            <nav aria-label="Menu">
              <ul className="flex flex-col gap-3 text-base">
                {links.map((l) => (
                  <li key={l.href}><Link href={l.href} className="text-ink">{l.label}</Link></li>
                ))}
                <li><Link href="/app" className="text-ink">{secondaryAction}</Link></li>
              </ul>
            </nav>
          </Dialog>
        </div>
      </nav>
    </header>
  );
}
