# Study Bee Pro — Static Landing Page

A single-page React + TypeScript landing page for the **Study Bee** education platform. It showcases the platform cards, an admin notification/inbox panel, and a like/message interaction, styled with Tailwind CSS v4 and a dark amber theme.

Built with Vite and `vite-plugin-singlefile`, so `npm run build` produces a **self-contained `dist/index.html`** (JS and CSS inlined) that can be hosted on any static host or opened directly from disk.

## Tech stack

| Part | Version |
| --- | --- |
| React / React DOM | 19.2.6 |
| Vite | 7.3.2 |
| TypeScript | 5.9.3 |
| Tailwind CSS (`@tailwindcss/vite`) | 4.1.17 |
| lucide-react | 1.68.0 |
| clsx + tailwind-merge | 2.1.1 / 3.4.0 |

## Getting started

Requires **Node.js 20.19+** (or 22.12+) and npm.

```bash
npm ci          # install exactly what package-lock.json pins
npm run dev     # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npx tsc --noEmit # typecheck
npm run build    # production build -> dist/
npm run preview  # preview the production build locally
```

## Project structure

```
.
├── index.html                 # HTML shell, SEO/OG meta, fonts, favicon
├── public/
│   └── noti.json              # notification count seed
├── src/
│   ├── App.tsx                # main page + platform grid + messaging UI
│   ├── index.css              # global styles, theme, animations
│   ├── main.tsx               # React entry point
│   └── utils/cn.ts            # clsx + tailwind-merge class helper
├── vite.config.ts             # React, Tailwind, singlefile plugins + "@" alias
├── tsconfig.json
├── package.json
└── package-lock.json
```

The `@` alias resolves to `src/` in both Vite and TypeScript.

## Deployment

The build output is `dist/`. On Vercel / Netlify / Cloudflare Pages, use:

- **Framework preset:** Vite
- **Install command:** `npm ci`
- **Build command:** `npm run build`
- **Output directory:** `dist`

Because JS/CSS are inlined into `index.html`, the page also works when deployed to GitHub Pages or any plain static file server. `public/noti.json` is copied to `dist/` alongside it.

A GitHub Actions workflow (`.github/workflows/build.yml`) runs install, typecheck, and build on every push and pull request, and uploads `dist/` as a build artifact.

## Source

Restored from the `clone-studybeepro-static-page.zip` archive. All original source files are preserved byte-for-byte; this README, `.gitignore`, and the CI workflow were added for the repository.
