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
import "@/site/seo/seo.css";
import { fontClassNames } from "@/design-system/fonts";
import { SEO } from "@/site/seo/config";
import { rootMetadata } from "@/site/seo/rootMetadata";
import { SiteJsonLd } from "@/site/seo/SiteJsonLd";

// Title, description, metadataBase and the pre-launch robots switch live in src/site/seo (config.ts, rootMetadata.ts).
export const metadata: Metadata = rootMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SEO.language} className={fontClassNames} data-scroll-behavior="smooth">
      <body className="min-h-dvh bg-paper font-sans text-ink">
        <div className="isolate">{children}</div>
        <SiteJsonLd />
      </body>
    </html>
  );
}
