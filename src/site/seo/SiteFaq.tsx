import { SectionCell } from "@/home/Frame";
import { Icon } from "@/home/Icon";
import type { FaqSet } from "./answers";
import { JsonLd } from "./JsonLd";
import { faqPageSchema, type FaqItem } from "./schema";

/** FAQPage JSON-LD for a list of questions that is visible on the same page. The text must match what is rendered. */
export function FaqJsonLd({ items }: { items: readonly FaqItem[] }) {
  return <JsonLd data={faqPageSchema(items)} />;
}

/** A FAQ cell for the company pages: the home's `.faq-layout` / `.faq-list` (home.css), `<details>` per question so
 *  every answer is in the static HTML, plus the matching FAQPage JSON-LD. */
export function SiteFaq({ id, eyebrow, lead, tail, items }: FaqSet) {
  return (
    <SectionCell labelledBy={id} className="faq-section">
      <div className="faq-layout" data-component="siteFaq">
        <div>
          <p className="section-eyebrow"><span aria-hidden="true" />{eyebrow}</p>
          <h2 id={id}>{lead} <br /><span>{tail}</span></h2>
        </div>
        <div className="faq-list">
          {items.map((item) => <details key={item.q}><summary>{item.q}<Icon name="plus" /></summary><p>{item.a}</p></details>)}
        </div>
      </div>
      <FaqJsonLd items={items} />
    </SectionCell>
  );
}
