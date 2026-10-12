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
import { fontClassNames } from "@/design-system/fonts";

export const metadata: Metadata = {
  title: "New Machines - The global marketplace for verified intelligent work",
  description:
    "Hire an AI workforce that can use your business tools, bring in qualified humans when judgment is needed, and show you evidence that the work was done.",
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
