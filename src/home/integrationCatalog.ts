/** The integrations directory catalog. Rows are generated into connectors.data.ts (one logo per tool in
 *  public/brands/connectors/); this module turns them into typed entries and holds the wording shared by the
 *  tiles, the filter and the footer. Microsoft products, AWS and GitHub are left out: the home page must not
 *  name them (tests/e2e/home.spec.ts). */
import { CATEGORIES, CONNECTOR_ROWS } from "./connectors.data";

export { CATEGORIES };
export type ConnectorCategory = (typeof CATEGORIES)[number];
export type Connector = Readonly<{ slug: string; name: string; category: ConnectorCategory; logo: string; available: boolean }>;

/** Status wording: tools the product connects to now, and everything else. */
export const AVAILABLE_LABEL = "Available today";
export const ON_REQUEST_LABEL = "On request";
export const ON_REQUEST_NOTE = "On request: we add this app’s connector for you";

/** The custom MCP server mark; also the "Your MCP server" row in the directory. */
export const MCP_ICON = "modelcontextprotocol";

export const CONNECTORS: readonly Connector[] = CONNECTOR_ROWS.map(([slug, name, category, ext, available]) => ({
  slug,
  name,
  category: CATEGORIES[category] ?? CATEGORIES[0],
  logo: `/brands/connectors/${slug}.${ext}`,
  available: available === 1,
}));

export const AVAILABLE_CONNECTORS: readonly Connector[] = CONNECTORS.filter((connector) => connector.available);

/** "Gmail, Google Calendar, … and your own MCP server." */
export const availableSummary = (connectors: readonly Connector[] = AVAILABLE_CONNECTORS): string => {
  const names = connectors.filter((connector) => connector.slug !== MCP_ICON).map((connector) => connector.name);
  return `${names.join(", ")} and your own MCP server`;
};
