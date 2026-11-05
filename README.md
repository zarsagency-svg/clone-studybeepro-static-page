# MIND SPARK — Static Landing Page

A single-page React + TypeScript landing page for **MIND SPARK**, a free education platform. It showcases the platform cards, an admin notification/inbox panel, and a like/message interaction.

The site uses a **red & black** theme: a near-black `#0a0a0a` base, `#121212` / `#18181b` cards, and red accents (`#ef4444` → `#dc2626` → `#b91c1c`), with Syne headings over Inter body text. The logo is the supplied white four-point spark mark on black.

Built with Vite and `vite-plugin-singlefile`, so `npm run build` produces a **self-contained `dist/index.html`** (JS and CSS inlined) that can be hosted on any static host.

## Platform cards

- **Next Toppers** is the only live card. Clicking it opens `https://xhashikstudy-nt.vercel.app/`.
- Every other card is a **static, non-clickable "Coming Soon" placeholder**. They are rendered as plain `<div>` elements with no `href`, no click handler, no pointer cursor and no hover animation — clicking them does nothing.
- Platform names, images and order are otherwise unchanged.

## Live Telegram subscriber count

The Telegram banner links to **`https://t.me/zarsstudy`** and shows the channel's **real** member count, fetched from `GET /api/subscribers`.

`api/subscribers.js` is a small Node serverless function (auto-deployed from the `api/` folder on Vercel). It uses two sources:

1. **Official Bot API** `getChatMemberCount` — used when `TELEGRAM_BOT_TOKEN` is set. Create a bot with [@BotFather](https://t.me/BotFather), add it to the channel, then set `TELEGRAM_BOT_TOKEN` in your Vercel project's environment variables (see `.env.example`). The token stays server-side and is never sent to the browser.
2. **Public channel preview page** — no credentials needed. Telegram renders `tgme_page_extra` (e.g. `10 subscribers`) at `https://t.me/zarsstudy`; the function fetches and parses it server-side because browsers cannot due to CORS.

Responses are cached for 5 minutes. On a purely static host with no `/api` route (GitHub Pages, plain file server, local `python -m http.server`), the request simply fails and the banner shows a neutral "Join the community" label — it never displays a fabricated number.

## Tech stack

| Part | Version |
| --- | --- |
| React / React DOM | 19.2.6 |
| Vite | 7.3.2 |
| TypeScript | 5.9.3 |
| Tailwind CSS (`@tailwindcss/vite`) | 4.1.17 |
| lucide-react | 1.68.0 |
| clsx + tailwind-merge | 2.1.1 / 3.4.0 |

Fonts: **Inter** (body) and **Syne** (display) via Google Fonts.

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
├── index.html                 # HTML shell, MIND SPARK SEO/OG meta, fonts, favicon
├── api/
│   └── subscribers.js         # serverless endpoint: real @zarsstudy member count
├── .env.example               # optional TELEGRAM_BOT_TOKEN setup notes
├── public/
│   ├── mind-spark-logo.jpeg   # supplied white spark logo (header + favicon)
│   └── noti.json              # notification count seed
├── src/
│   ├── App.tsx                # main page + platform grid + messaging UI
│   ├── index.css              # red/black theme tokens, animations, card hover
│   ├── main.tsx               # React entry point
│   └── utils/cn.ts            # clsx + tailwind-merge class helper
├── vite.config.ts             # React, Tailwind, singlefile plugins + "@" alias
├── tsconfig.json
├── package.json
└── package-lock.json
```

The `@` alias resolves to `src/` in both Vite and TypeScript. Theme colors live as CSS variables at the top of `src/index.css`, so the palette can be retuned in one place.

## Deployment

The build output is `dist/`. On Vercel / Netlify / Cloudflare Pages, use:

- **Framework preset:** Vite
- **Install command:** `npm ci`
- **Build command:** `npm run build`
- **Output directory:** `dist`

Because JS/CSS are inlined into `index.html`, the page also works when deployed to GitHub Pages or any plain static file server. `public/mind-spark-logo.jpeg` and `public/noti.json` are copied to `dist/` alongside it.

A GitHub Actions workflow (`.github/workflows/build.yml`) runs install, typecheck, and build on every push and pull request, and uploads `dist/` as a build artifact.

## Source

Restored from the `clone-studybeepro-static-page.zip` archive, then rebranded to MIND SPARK with a red & black theme and the supplied spark logo. This README, `.gitignore` and the CI workflow were added for the repository.
