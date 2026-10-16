/** Every connector shown in the Integrations directory. `icon` is a Simple Icons slug, synced into
 *  public/brands/connectors/ by scripts/sync-integration-icons.mjs; entries without one render as a monogram.
 *  Only add a slug after checking its source domain is the same company (e.g. Simple Icons' "Fathom" is Fathom Analytics).
 *  Microsoft products are left out: the home page must not name Microsoft, AWS or GitHub (tests/e2e/home.spec.ts). */

export const CATEGORIES = [
  "CRM & sales",
  "Marketing & content",
  "Finance & commerce",
  "Productivity & docs",
  "Communication & meetings",
  "Customer support",
  "Data & analytics",
  "People & HR",
] as const;

export type ConnectorCategory = (typeof CATEGORIES)[number];
export type Connector = Readonly<{ name: string; category: ConnectorCategory; icon?: string }>;

const group = (category: ConnectorCategory, entries: readonly (readonly [name: string, icon?: string])[]): Connector[] =>
  entries.map(([name, icon]) => ({ name, category, icon }));

export const CONNECTORS: readonly Connector[] = [
  ...group("CRM & sales", [["Salesforce"], ["HubSpot", "hubspot"], ["Pipedrive"], ["Attio"], ["Affinity"], ["Close"], ["Freshsales"], ["Apollo"], ["Clay"], ["Findymail"], ["Outreach"], ["Salesloft"], ["Gong"], ["Chorus"], ["Seismic"]]),
  ...group("Marketing & content", [["Google Ads", "googleads"], ["Google Analytics", "googleanalytics"], ["Google Search Console", "googlesearchconsole"], ["Google DV360", "googledisplayandvideo360"], ["Google PageSpeed", "pagespeedinsights"], ["Semrush", "semrush"], ["Ahrefs"], ["Klaviyo"], ["Brevo", "brevo"], ["Loops", "loops"], ["beehiiv"], ["Webflow", "webflow"], ["Gamma"], ["Descript"], ["Foreplay"], ["Adobe Marketing Agent"], ["Instagram", "instagram"], ["TikTok", "tiktok"], ["YouTube", "youtube"], ["X", "x"], ["Reddit", "reddit"]]),
  ...group("Finance & commerce", [["freee"], ["QuickBooks", "quickbooks"], ["NetSuite"], ["Stripe", "stripe"], ["PayPal", "paypal"], ["Expensify", "expensify"], ["Carta"], ["Shopify", "shopify"], ["DocuSign"]]),
  ...group("Productivity & docs", [["Google Drive", "googledrive"], ["Google Docs", "googledocs"], ["Google Sheets", "googlesheets"], ["Google Slides", "googleslides"], ["Google Tasks", "googletasks"], ["Google AppSheet"], ["Notion", "notion"], ["Airtable", "airtable"], ["Confluence", "confluence"], ["Jira", "jira"], ["Linear", "linear"], ["Asana", "asana"], ["ClickUp", "clickup"], ["Monday.com"], ["Trello", "trello"], ["Todoist", "todoist"], ["Miro", "miro"], ["Box", "box"], ["Dropbox", "dropbox"], ["Kintone"]]),
  ...group("Communication & meetings", [["Gmail", "gmail"], ["Slack"], ["LINE WORKS"], ["Google Calendar", "googlecalendar"], ["Google Meet", "googlemeet"], ["Zoom", "zoom"], ["Cal.com", "caldotcom"], ["Fathom"], ["Fellow"], ["Luma"]]),
  ...group("Customer support", [["Zendesk", "zendesk"], ["Intercom", "intercom"], ["Freshdesk"], ["Sprig"]]),
  ...group("Data & analytics", [["BigQuery", "googlebigquery"], ["Snowflake", "snowflake"], ["Databricks", "databricks"], ["PostgreSQL", "postgresql"], ["ClickHouse", "clickhouse"], ["Looker", "looker"], ["Tableau"], ["Hex"], ["Sigma Computing"], ["Google Cloud Storage", "googlecloudstorage"], ["Google Maps", "googlemaps"]]),
  ...group("People & HR", [["SmartHR"], ["Workday"], ["Greenhouse", "greenhouse"], ["Ashby"]]),
];

/** The custom MCP server mark, also synced from Simple Icons. */
export const MCP_ICON = "modelcontextprotocol";
