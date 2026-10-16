import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { REGIONAL_MARKETS } from "@/home/globe/markets";
import { ABOUT_COPY } from "./copy";
import { FOLLOWING_HUBS_TEXT, HUB_NAMES } from "./hubs";
import { ABOUT_FAQ, PRODUCT_FAQ } from "./seo/answers";

describe("hub list", () => {
  it("is the launch market and five hubs, used by the globe and /about", () => {
    expect(HUB_NAMES).toEqual(["Tokyo", "Seoul", "Singapore", "Manila", "Sydney", "Bengaluru"]);
    expect(REGIONAL_MARKETS.map((market) => market.city)).toEqual(HUB_NAMES);
    expect(ABOUT_COPY.market.hubs).toEqual(HUB_NAMES);
    expect(FOLLOWING_HUBS_TEXT).toBe("Seoul, Singapore, Manila, Sydney and Bengaluru");
  });

  it("is the list the FAQs and llms-full.txt name, with no other hub cities", () => {
    const faq = JSON.stringify([PRODUCT_FAQ, ABOUT_FAQ]);
    expect(faq).toContain(FOLLOWING_HUBS_TEXT);
    const llms = readFileSync(join(process.cwd(), "public/llms-full.txt"), "utf8");
    expect(llms).toContain(`hubs that follow: ${HUB_NAMES.slice(1).join(", ")}`);
    for (const text of [faq, llms, readFileSync(join(process.cwd(), "public/llms.txt"), "utf8")]) expect(text).not.toMatch(/Beijing|New Clark City|Melbourne/);
  });
});
