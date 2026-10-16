import type { Metadata } from "next";
import "../../tokens.css";
import "@/home/home.css";
import "@/home/product-scenes.css";
import "@/home/experiments/motorsport.css";
import "@/home/quality-pass.css";
import "@/home/globe/globe.css";
import "@/home/mockups/hero-product.css";
import "@/home/motion/home-motion.css";
import "@/home/scroll-polish.css";
import "@/marketplace/marketplace.css";
import "@/site/site.css";
import { fontClassNames } from "@/design-system/fonts";
import { SITE } from "@/site/copy";

const DEFAULT_TITLE = `${SITE.name} - ${SITE.tagline}`;
const DEFAULT_DESCRIPTION = "Assign AI agents that work in your business tools, hire qualified reviewers when judgment is needed, and see evidence that the work was done.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: DEFAULT_TITLE, template: `%s · ${SITE.name}` },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE.name,
  openGraph: { type: "website", siteName: SITE.name, locale: "en", url: "/", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  // Pre-launch: keep every page out of search engines. robots.ts and the host headers say the same.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontClassNames} data-scroll-behavior="smooth">
      <body className="min-h-dvh bg-paper font-sans text-ink">
        <div className="isolate">{children}</div>
      </body>
    </html>
  );
}
