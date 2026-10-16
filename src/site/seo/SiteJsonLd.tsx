import { JsonLd } from "./JsonLd";
import { organizationSchema, webSiteSchema } from "./schema";

/** Organization + WebSite, rendered once from the root layout so every page carries the entity. */
export function SiteJsonLd() {
  return <JsonLd data={[organizationSchema(), webSiteSchema()]} />;
}
