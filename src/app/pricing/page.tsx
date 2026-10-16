import { Card } from "@/design-system/components/Card";
import { Table, type Column } from "@/design-system/components/Table";
import { SectionCell } from "@/home/Frame";
import { HomepageLink as Link } from "@/home/HomepageLink";
import { Icon } from "@/home/Icon";
import { Close } from "@/home/sections/Close";
import { KIND_LABEL } from "@/marketplace/kinds";
import { MARKETPLACE_LISTINGS } from "@/marketplace/listings";
import { PageShell } from "@/marketplace/PageShell";
import { FeatureGrid, Opener, PageIntro } from "@/site/blocks";
import { PRICING_COPY as C } from "@/site/copy";
import { pageMetadata } from "@/site/metadata";

export const metadata = pageMetadata({ ...C.meta, path: "/pricing" });

type PriceRow = { listing: string; kind: string; price: string; certified: string };

const PRICE_COLUMNS: readonly Column<PriceRow>[] = [
  { key: "listing", header: C.examples.columns.listing },
  { key: "kind", header: C.examples.columns.kind },
  { key: "certified", header: C.examples.columns.certified },
  { key: "price", header: C.examples.columns.price, align: "right" },
];

const PRICE_ROWS: readonly PriceRow[] = MARKETPLACE_LISTINGS.map(({ title, kind, price, certified }) => ({
  listing: title, kind: KIND_LABEL[kind], price, certified: certified ? C.examples.yes : C.examples.no,
}));

export default function Page() {
  return (
    <PageShell home={false} current="/pricing" dataComponent="pricingPage" className="site-page">
      <PageIntro id="pricing-title" {...C.intro} />

      <SectionCell labelledBy="plans-title">
        <h2 id="plans-title" className="sr-only">Plans</h2>
        <ul className="plan-grid" data-component="pricingPlans">
          {C.plans.map((plan) => (
            <li key={plan.name}>
              <Card className="plan-card h-full">
                <h3>{plan.name}</h3>
                <div className="plan-price"><strong>{plan.price}</strong>{plan.unit ? <span>{plan.unit}</span> : null}</div>
                <p>{plan.body}</p>
                <Link href={plan.cta.href} home={false} className="text-link">{plan.cta.label}<Icon /></Link>
              </Card>
            </li>
          ))}
        </ul>
        <p className="story-note">{C.note}</p>
      </SectionCell>

      <SectionCell labelledBy="included-title">
        <Opener id="included-title" eyebrow={C.included.eyebrow} lead={C.included.lead} tail={C.included.tail} sub={C.included.sub} />
        <FeatureGrid items={C.included.items} />
      </SectionCell>

      <SectionCell labelledBy="examples-title">
        <Opener id="examples-title" eyebrow={C.examples.eyebrow} lead={C.examples.lead} tail={C.examples.tail} sub={C.examples.sub} />
        <div className="site-block" data-component="pricingExamples">
          <Table caption={C.examples.caption} columns={PRICE_COLUMNS} rows={PRICE_ROWS} rowKey={(row) => row.listing} />
          <p className="story-note">{C.examples.note}</p>
        </div>
      </SectionCell>

      <SectionCell labelledBy="pricing-faq-title" className="faq-section">
        <div className="faq-layout">
          <div><p className="section-eyebrow"><span aria-hidden="true" />{C.faq.eyebrow}</p><h2 id="pricing-faq-title">{C.faq.lead}<br /><span>{C.faq.tail}</span></h2></div>
          <div className="faq-list">{C.faq.items.map((item) => <details key={item.q}><summary>{item.q}<Icon name="plus" /></summary><p>{item.a}</p></details>)}</div>
        </div>
      </SectionCell>

      <Close home={false} />
    </PageShell>
  );
}
