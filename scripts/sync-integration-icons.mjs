// Downloads the Simple Icons used by the Integrations directory into public/brands/connectors/.
// Slugs are read from src/home/integrationCatalog.ts, so the catalogue stays the single source.
// Re-run after adding a slug: `node scripts/sync-integration-icons.mjs`.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const VERSION = "16.35.0";
const here = dirname(fileURLToPath(import.meta.url));
const catalog = readFileSync(resolve(here, "../src/home/integrationCatalog.ts"), "utf8");
const slugs = [...new Set([...catalog.matchAll(/\[\s*"[^"]+",\s*"([a-z0-9]+)"\s*\]/g), ...catalog.matchAll(/MCP_ICON = "([a-z0-9]+)"/g)].map((match) => match[1]))].sort();
const out = resolve(here, "../public/brands/connectors");
mkdirSync(out, { recursive: true });

const missing = [];
for (const slug of slugs) {
  const response = await fetch(`https://cdn.jsdelivr.net/npm/simple-icons@${VERSION}/icons/${slug}.svg`);
  if (!response.ok) { missing.push(slug); continue; }
  const svg = await response.text();
  if (!svg.startsWith("<svg")) throw new Error(`${slug}: not an SVG`);
  writeFileSync(resolve(out, `${slug}.svg`), svg);
}
const sources = resolve(here, "../public/brands/sources.json");
const record = JSON.parse(readFileSync(sources, "utf8"));
record.connectors = { collection: "Simple Icons", version: VERSION, delivery: `https://cdn.jsdelivr.net/npm/simple-icons@${VERSION}/icons/`, path: "public/brands/connectors/", usage: "Monochrome marks in the illustrative Integrations connector directory.", downloaded: new Date().toISOString().slice(0, 10), slugs };
writeFileSync(sources, JSON.stringify(record, null, 2) + "\n");
if (missing.length) { process.exitCode = 1; process.stderr.write(`Missing in simple-icons@${VERSION}: ${missing.join(", ")}\n`); }
process.stdout.write(`Synced ${slugs.length - missing.length} of ${slugs.length} icons.\n`);
