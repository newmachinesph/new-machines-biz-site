import type { Metadata } from "next";
import { HomePage } from "@/home/HomePage";
import { FAQ_ITEMS } from "@/home/sections/Faq";
import { FaqJsonLd } from "@/site/seo/SiteFaq";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Page() {
  return (
    <>
      <HomePage />
      <FaqJsonLd items={FAQ_ITEMS} />
    </>
  );
}
