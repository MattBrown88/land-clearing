# Land Clearing Estimator — Demo

An embeddable instant-estimate widget for land-clearing and forestry-mulching contractors, branded for the
fictional **Heartland Land Clearing**. It's a static React + TypeScript + Vite app with no backend, so it deploys to
GitHub Pages as-is.

> Demo estimator. The pricing is illustrative and is not an actual quote.

## Local development

Requires Node 20.19+ (Node 22 recommended).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally
```

## Customizing for a prospect

Everything contractor-specific lives in **`src/config/contractor.ts`**:

| Setting | What it controls |
| --- | --- |
| `companyName`, `tagline`, `phone`, `serviceArea` | Header, card, CTA and footer copy |
| `logoUrl` | Put a logo in `public/` (e.g. `public/logo.png`) and set `'./logo.png'`. If empty, a tree mark in the brand color is used |
| `primaryColor`, `accentColor` | The whole color scheme. Every shade is derived from these two |
| `estimatorTitle`, `estimatorSubtitle`, `estimatorNote`, `priceIncludes`, `trustPoints`, `responseTime` | Marketing copy |
| `baseDayRate`, `baseAcresPerDay`, `minimumProjectPrice`, `mobilizationFee` | Core pricing |
| `rangeLowFactor`, `rangeHighFactor`, `priceRounding` | How wide the range is and how it's rounded |
| `vegetation`, `clearingType`, `terrain`, `access` | Dropdown labels and the hidden production multiplier for each |
| `showDemoDisclaimer` | Set to `false` for a real deployment |

Typical workflow for a new prospect: copy the repo, change the name, phone, colors and logo, then adjust the day
rate and multipliers to match how they say they price jobs.

### How the demo pricing works

```
machineDays = acres / baseAcresPerDay × vegetation × clearingType × terrain × access
price       = machineDays × baseDayRate + mobilizationFee
```

The low end of the range is `rangeLowFactor` × that value and the high end is `rangeHighFactor` ×, rounded to
`priceRounding`. No estimate goes below `minimumProjectPrice`. Machine time is rounded to half days. The customer
never sees the multipliers. The results page labels each factor as *Lighter work*, *Standard*, *Adds time* or
*Major factor*. The logic is in `src/lib/estimate.ts`.

## Embedding on a contractor's site

Add `?embed` to the URL to get just the estimator card, without the demo site header and footer:

```html
<iframe src="https://<user>.github.io/<repo>/?embed" style="width:100%;height:1500px;border:0"></iframe>
```

## Deploying to GitHub Pages

`vite.config.ts` uses `base: './'`, so the build works under any repository name.

**Automatic (recommended):**

1. Push the project to a GitHub repository with `main` as the default branch.
2. In the repo, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds and publishes the site to
   `https://<user>.github.io/<repo>/`. You can also run it by hand from the **Actions** tab.

**Manual alternative:** run `npm run build` and publish the `dist/` folder to any static host (Netlify, Vercel,
S3, or a `gh-pages` branch).

## Going live (beyond the demo)

**Request a Final Quote** doesn't send anything right now. See `requestQuote` in
`src/components/EstimateResult.tsx`. To capture real leads, post the form values (and the photo) to a form service
such as Formspree or Basin, a CRM webhook, or a small serverless function.

## Project structure

```
src/
  config/contractor.ts        ← all branding, copy and pricing
  lib/estimate.ts             pricing model + formatting
  lib/form.ts                 form state, validation, phone formatting
  components/EstimatorForm.tsx
  components/EstimateResult.tsx
  components/PhotoUpload.tsx
  components/Brand.tsx        logo mark + tree-line graphic
  App.tsx                     page shell, view switching, ?embed mode
  styles.css
```
