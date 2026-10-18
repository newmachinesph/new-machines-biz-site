# New Machines - marketing site

The public website for New Machines, a marketplace where businesses choose AI agents and workflow packs
for defined work, bring in qualified human reviewers for judgment calls, and accept each outcome with
evidence attached. Initial focus: Japan and Asia-Pacific.

This repo is the marketing site only. It explains the product, lists the marketplace catalogue, and
documents the trust model. The working product (workspaces, runs, approvals, billing) is a separate demo
application; this site describes it and links to it conceptually but does not contain or call it. All
figures, listings and customer examples here are labelled demo or synthetic data.

**Related repository:** the working product (the demo application this site describes) is
[newmachinesph/new-machines-prototype](https://github.com/newmachinesph/new-machines-prototype).

Status: pre-launch. The site is deployed but hidden from search engines (see "Pre-launch noindex" below).

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 with design tokens in CSS, Base UI primitives, Motion for animation, three.js for the regional globe
- Vitest + Testing Library (unit), Playwright + axe (e2e, visual, accessibility)
- pnpm

No API routes, server actions or request-time rendering: every page is statically renderable, which is
what makes the static export described below possible.

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Free port 3000 before running the e2e suite; Playwright starts its own server there.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Next dev server on port 3000 |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint (flat config, `eslint.config.mjs`) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest unit and component tests (reduced motion is emulated so mockups render their final state) |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm test:e2e` | Playwright screenshots and axe checks at 390, 1024 and 1440 px, reduced motion, fixed clock |
| `pnpm sync-logo` | Regenerate `src/design-system/logo/*.data.ts` from the logo source SVGs. Maintainer-only: the source folder is not part of this repo |

After an intentional visual change, accept new baselines with `pnpm test:e2e --update-snapshots`.

## Page map

All routes live in `src/app/`.

| Route | Purpose |
|---|---|
| `/` | Home: hero, how it works, work explorer, marketplace and connector directory, human review, controls, trust, sandbox, customer stories, FAQ |
| `/product` | What the product does end to end: packs, sandbox, trust statuses, approvals, caps, receipts |
| `/marketplace` | Filterable catalogue of agents, workflow packs and human talent (demo listings) |
| `/marketplace/[slug]` | Listing detail: outcome, publisher, access requested, risk class, Trust Passport, sample run. Statically generated for every listing (`dynamicParams = false`) |
| `/pricing` | Pricing model (pre-launch, no charges) |
| `/developers` | Publishing agents and packs: scope, versions, sandbox tests |
| `/trust` | The trust model: judgment, policy, approval, execution, verification, acceptance, settlement |
| `/work` | For reviewers: how human review work and pay per task work |
| `/about` | Company and mission |
| `/contact` | Contact routes |
| `/privacy`, `/terms` | Legal pages (shared `LegalPage` layout) |
| `/styleguide` | Internal: tokens, primitives and every home mockup. Never indexed, absent from the sitemap |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | Generated; see SEO below |
| `not-found` | 404 |

## How content is organized

```
src/
  app/            routes, layout, sitemap, robots, OG image
  site/           company-page copy, metadata helpers, legal layout, SEO (src/site/seo)
  home/           home page: sections/, mockups/, globe/, copy.ts, connector data, home CSS
  marketplace/    catalogue, listing detail, listing data, filters, interactive sample reports
  design-system/  tokens, fonts, primitives, logo, motion helpers
  lib/            small shared helpers (cn, hooks)
tests/e2e/        Playwright specs and screenshot baselines
public/           logos, editorial images, llms.txt, demo fixtures
scripts/          asset generators (globe, sync-logo)
```

- **Company-page copy** is in `src/site/copy.ts`: the `SITE` object (name, domain, url, tagline, contact
  emails) plus a copy object per page (`PRODUCT_COPY` and so on). Pages render from these objects, so wording
  changes rarely touch components. `copy.test.ts` guards the register.
- **Home copy** is in `src/home/copy.ts`; sections in `src/home/sections/` each consume a slice of it.
  Mockups (`src/home/mockups/`) are code-drawn product scenes, not screenshots, and all use synthetic data.
- **Marketplace data** is in `src/marketplace/listings.ts` (typed `MarketplaceListing` records);
  `kinds.ts` defines the three talent kinds (agent, workflow pack, human) and the filter set. The invoice
  matcher, support draft and lead qualifier reports are small deterministic samples
  (`invoiceMatcher.ts`, `supportDraft.ts`, `leadQualifierSample.ts`) with tests, so the sample runs shown on
  listing pages are reproducible.
- **Connector directory** is generated data in `src/home/connectors.data.ts` (slug, name, category,
  logo extension, availability flag), rendered by `IntegrationDirectory`. About 1,500 apps are listed; only a
  handful are marked available today and the rest are shown as the integration surface. Treat the file as
  generated: regenerate, do not hand-edit.
- **Real app logos** are in `public/brands/connectors/<slug>.<svg|webp>`, one per directory entry. Other
  logos in `public/brands/` (top-level SVGs, `examples/`, `fictional/`) are used for customer and tool
  strips; `sources.json` files record where each asset came from. Fictional companies in
  `src/home/fictionalCompanies.ts` are clearly invented examples.

Copy rules enforced by convention and tests: agents are chosen, assigned or deployed (only people are
hired), demo figures are labelled, no market outside Japan and Asia-Pacific is named, no model vendors are named.

## Design system

`src/design-system/`

- `tokens.css` (imported through the root `tokens.css`): colour, radius, shadow, spacing and frame-width tokens
- `fonts.ts`: font loaders; keep the CSS variable name if you swap a typeface
- `components/`: Button, Badge, Card, Dialog, Field, Input, Select, Table, Tabs, PreviewCard (Base UI based, each with tests)
- `logo/`: Mark and Lockup, generated from SVG source by `pnpm sync-logo`
- `motion/`: `MotionItem`, `useMotionAllowed` (SSR-safe reduced-motion hook; use it instead of raw `useReducedMotion`) and shared variants

Rules: components use tokens through Tailwind utilities, no raw hex values. Accent colours appear only inside
mockups and status chips under a matching `data-accent`. To review a token change, open `/styleguide`, then
update e2e baselines.

## SEO and answer-engine setup

All of it lives in `src/site/seo/`; the canonical host comes from `SITE.url` in `src/site/copy.ts`.

- **Metadata:** `rootMetadata.ts` sets `metadataBase`, title template (" · New Machines"), Open Graph and
  Twitter cards, and canonicals; each page exports its own title and description. Descriptions are written
  per route in `routes.ts` and unit-tested to 120-160 characters, titles to 60.
- **JSON-LD:** `SiteJsonLd` emits Organization, WebSite and SoftwareApplication; FAQ pages add FAQPage,
  inner pages add BreadcrumbList, and the marketplace adds an ItemList (`schema.ts`, `MarketplaceJsonLd.tsx`).
- **Answer content:** `answers.ts` and the `Definition` / `SiteFaq` blocks put short, quotable definitions
  on pages; `public/llms.txt` and `public/llms-full.txt` give language models a plain-text site summary.
- **Sitemap and robots:** `src/app/sitemap.ts` reads `SITEMAP_ROUTES` (pages plus every marketplace listing,
  with `updated` dates; bump a route's date when its copy changes). `src/app/robots.ts` reads
  `robotsRules()`. Both are `force-static` so they exist in the static export.
- **Open Graph image:** `src/app/opengraph-image.tsx`, 1200x630, rendered at build time.
- `/styleguide` is in `SEO.neverIndex` and stays out of results even after launch.

### Pre-launch noindex (two switches, flip both at launch)

The site is deliberately invisible to search engines until launch. Two independent controls enforce it, and
both must change in the same release:

1. `SEO.indexable` in `src/site/seo/config.ts` (currently `false`). It drives the per-page
   `<meta name="robots">` and `robots.txt`. Set it to `true` to emit `index, follow` and an allow-all
   `robots.txt` (minus `neverIndex`). A unit test pins the pre-launch value; update it with the flip.
2. The `X-Robots-Tag: noindex, nofollow, noarchive, noimageindex` response header on `**` in
   `../firebase-hosting/firebase.json` (the hosting config, outside this directory). Delete that header
   entry. `vercel.json` carries the same header for the Vercel deployment; remove it there too.

Flipping only one leaves the site noindexed, because a noindex header overrides the meta tag.

## Static export and deploy

The site is deployed as a static export on Firebase Hosting (project `newmachines`, site
`eroc4u6xawjrml`, `site` target). `next.config.ts` in this directory stays a plain config; the export is
produced by a wrapper in the sibling `firebase-hosting/` directory so that this project is never modified
by the build.

`firebase-hosting/scripts/build.mjs`:

1. Copies this project (tracked and untracked, minus ignored files) into `firebase-hosting/.build/site`,
   or `git archive HEAD` with `--committed`.
2. Wraps the Next config with `output: "export"` and unoptimized images.
3. Runs `pnpm install --frozen-lockfile` and `next build` there.
4. Copies `out/` into `firebase-hosting/public/`, which Firebase serves.

From `firebase-hosting/`:

```bash
npm run build             # export the working tree
npm run build:committed   # export git HEAD only
npm run preview           # Firebase Hosting emulator on http://127.0.0.1:5000
npm run deploy            # firebase deploy --only hosting (pinned firebase-tools)
```

`firebase.json` serves `public/` with clean URLs and no trailing slash, the noindex header above,
`image/png` for the OG route, one-year immutable caching for `/_next/static/**`, and one-day caching for
images and fonts. Deploys require Firebase login with access to the project; never deploy to the project's
default site (it is disabled on purpose).

Release checklist: `pnpm lint && pnpm typecheck && pnpm test`, run `pnpm test:e2e` for visual changes,
then build and deploy from `firebase-hosting/`.

## License

MIT. See [LICENSE](LICENSE).
