# New Machines - web

Next.js 15 · Tailwind v4 · Base UI · Motion · pnpm

- `pnpm dev` - app at http://localhost:3000, styleguide at /styleguide (tokens, primitives, every home mockup)
- `pnpm test` - unit (Vitest; reduced motion is emulated so mockups render their final state)
- `pnpm test:e2e` - Playwright screenshots + axe at 390/1024/1440 with `reducedMotion: reduce` and a fixed clock
- `pnpm sync-logo` - regenerate logo components after editing `../design/logo/`

## Switching a design decision
- UI typeface: edit the loader in `src/design-system/fonts.ts`; keep the CSS variable name.
- Colours / radius / shadow / frame width: edit `src/design-system/tokens.css`. Check `/styleguide`, then `pnpm test:e2e --update-snapshots` to accept the new look.
- Rules: components use tokens only via Tailwind utilities (no raw hex); accent colours appear only inside mockups and status chips under a matching `data-accent`; home copy lives in `src/home/copy.ts` and never names a market outside Japan and Asia-Pacific.
