# Deploy VignanPad

## Relevant paths

| Platform        | Base path        | URL example                          |
|----------------|------------------|--------------------------------------|
| **Vercel**     | `/` (default)    | `https://your-app.vercel.app`        |
| **Netlify**    | `/` (default)    | `https://your-app.netlify.app`       |
| **GitHub Pages** | `/VignanPad/` | `https://vignan405sys.github.io/VignanPad/` |

- **Root deploy** (Vercel, Netlify): run `npm run build` and deploy the `dist` folder. No `BASE_PATH` needed.
- **Subpath deploy** (e.g. GitHub Pages under a repo): set `BASE_PATH` to the subpath (with leading and trailing slash) when building.

## Vercel

1. Push to GitHub and import the repo in [Vercel](https://vercel.com).
2. Build and output are set in `vercel.json`; deploy as usual.

## Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add a redirect so the SPA works: in **Site settings → Build & deploy → Post processing → Asset optimization** or add `dist/_redirects` with:
   ```
   /*    /index.html   200
   ```

## GitHub Pages (vignan405sys/VignanPad)

1. In the repo: **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions**.
2. Push to `main`; the workflow builds with `BASE_PATH=/VignanPad/` and deploys.
3. Live site: **https://vignan405sys.github.io/VignanPad/**

## Local preview with subpath (test GitHub Pages build)

**Windows (PowerShell):**
```powershell
$env:BASE_PATH="/VignanPad/"; npm run build; npx vite preview
```

**Linux / macOS:**
```bash
BASE_PATH=/VignanPad/ npm run build && npm run preview
```

Then open the URL shown and add `/VignanPad/` if preview serves from root.
