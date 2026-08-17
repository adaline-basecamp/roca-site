# Roca Fuels

Marketing site for Roca Fuels — a 24-hour fuel and convenience stop in
Pavangad, Kozhikode, and the fuel retail arm of ROCA Holdings.

Single-scroll homepage with an interactive 3D forecourt, a branded opening
sequence, and a WebGL liquid field drawn from the brand guidelines' "liquid
flowing" construction concept. Gallery, Rewards and Terms are separate routes.

## Stack

- **Next.js** (App Router) with `output: "export"` — a fully static build
- **TypeScript**, **Tailwind CSS v4**
- **GSAP** (+ ScrollTrigger) for choreography, **Lenis** for scroll
- **three.js** for the station model and the liquid shader

There is no server runtime. Forms POST to a webhook; everything else is static.

## Getting started

```bash
pnpm install
```

```bash
pnpm dev
```

Then open http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server with HMR |
| `pnpm build` | Static export to `out/` |
| `pnpm start` | Serves the production build |
| `pnpm lint` | ESLint |

`pnpm build` must pass before any commit that claims completion.

## Environment

Copy `.env.example` to `.env.local` and fill in:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_LEAD_WEBHOOK` | Endpoint the fleet and feedback forms POST to. Unset, both forms fail gracefully and point the visitor at the phone number and email instead. |

## Deploying

The build is a static export, so `out/` can be served by any static host
(Cloudflare Pages, Netlify, S3, nginx). No Node process is required in
production. Set the build command to `pnpm build` and the output directory to
`out`.

## Project layout

```
src/
  app/              routes — home, gallery, rewards, terms
  components/
    liquid/         WebGL liquid field (opener + hero backdrop)
    station3d/      procedural forecourt model, camera fit, drag control
    motion/         GSAP primitives — opener, reveals, hero choreography
    form/           fleet and feedback forms
    ui/             buttons, cards, section shells
  lib/
    constants.ts    site content, nav, amenities, stations, FAQs
```

Most copy and structure lives in `src/lib/constants.ts` rather than in the
pages, so content edits rarely require touching layout.

## Assets

Client asset originals (photography, logo source files, brand PDF) are **not**
in this repository — see `.gitignore`. Optimised derivatives that the site
actually loads live in `public/`. Regenerating them requires the originals.

## Accessibility and motion

- Every animation is skipped or simplified under `prefers-reduced-motion`,
  including the opener, the liquid field and the 3D model, each of which has a
  static equivalent.
- The opening sequence auto-exits, is skippable, and plays once per session.
- Colour choices are checked against WCAG AA; the hero's shader backdrop is
  scrimmed specifically so headline contrast holds.

## Further context

`BRIEF.md` carries the client brief and the approved copy.
