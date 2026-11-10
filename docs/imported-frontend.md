# Imported frontend reference

The following notes describe the standalone `mind-spark-play` source project. This destination repository additionally retains its original `api/subscribers.js`, notification helpers, database migrations, and build workflow. The standalone project's missing-API note does not apply to this combined deployment.

---

# MIND SPARK

React, TypeScript, Tailwind CSS, and Vite website imported from the supplied `play.zip` archive.

## Run locally

Use Node.js 20.19+ or a newer supported LTS release.

```sh
npm ci
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

Vercel configuration is included in `vercel.json`: Vite framework, `npm ci`, `npm run build`, output directory `dist`.

## Import notes

- The 3D book is intentionally **not displayed**, as requested. Its component and model remain intact in `src/components/PaladinsBook3D.tsx` and `src/assets/book/bookObj.ts`.
- The original ZIP did not include the five book textures: `baseColor.jpg`, `emissive.jpg`, `metallic.jpg`, `normal.jpg`, and `roughness.jpg`. No replacement book textures were added. To restore the book later, supply those files in `src/assets/book/` and re-enable its import and placement in `src/App.tsx`.
- Four missing platform logos were recovered from the existing public site at https://clone-website-with-3d-elements.vercel.app/ and saved under `src/assets/platforms/`.
- The existing Supabase notification integration is unchanged. Its browser publishable key is not an administrative/service-role key. No database changes were made.
- The archive does not contain a server implementation of `/api/subscribers`. The frontend retains its original fallback subscriber count if that endpoint is unavailable.
- Existing sites and repositories are not modified by this import.

## Focused loading and interface update

- Removed the four feature badges, category tabs, and footer colour-swatch strip. Search and all eight platform cards remain available.
- Made the MIND SPARK title static and removed text-glow effects. The remaining page colours, folder styling, links, and notification behaviour are retained.
- Uses normal Vite output with separately hashed JavaScript, CSS, and image assets instead of an all-in-one HTML file.
- Hashed `/assets/` files use a one-year immutable browser cache. HTML is not given that long-lived cache policy.
- Platform logos are WebP. Below-the-first-row images use native lazy loading and all card images use asynchronous decoding with explicit dimensions.
- The notification drawer is downloaded on demand when opened; the notification trigger and its data handling remain available immediately.
- Retains Inter and Syne while requesting fewer font weights.
