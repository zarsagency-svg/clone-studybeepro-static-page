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

- The unused 3D book component, embedded model, and book-only Three.js dependencies have been removed at the user’s request. The visible folder cards and glass icons remain available.
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
- The notification drawer is code-split and can be warmed during idle time; the notification trigger and its data handling remain available immediately.
- Retains Inter and Syne while requesting fewer font weights.

## Android / touch performance pass

- Atmospheric background colours are static gradients instead of three large, fixed blur layers.
- Phones and coarse-pointer devices use gradient-only glass and no filter-based folder shadows. Folder shapes, names, logos, ordering and links are retained; desktop glass is shallower.
- Mobile content appears immediately with no staggered entrances, bell loops or decorative pulses. Desktop entrances are short and do not retain transform layers after completion. Reduced-motion preferences are respected throughout.
- Transitions name their properties rather than animating every property, so shadows and filters are not accidentally animated.
- The static title scales to fit one line; reserved header space keeps the fixed inbox button from covering it on narrow screens.
- Small glass icons retain their layered shapes but no longer use nested backdrop filters.
- Inter and Syne variable fonts are self-hosted and cached as hashed assets. Only the title font is preloaded; body fonts load normally so they do not compete with the app’s initial download. Font OFL licenses are included under `src/assets/fonts/`.
- The notification drawer stays code-split. On normal connections it is warmed after startup during idle time; Save-Data/2G connections only load it on intent/open. Mobile open/close no longer waits for entrance/exit timers.
- Memoized folder cards and notification chrome avoid unrelated work while typing or updating the subscriber count. Existing notification read/like payloads and database configuration are unchanged.
- This pass changes only `mind-spark-play`; `mindspark-all` and its backend/settings are not modified. Browser/lab checks are not a guarantee of zero lag on every physical device.
