# SvelteKit: `beforeNavigate` doesn't run for a click during a pending navigation

`beforeNavigate` callbacks don't run for a link click or `goto` that starts while another client-side navigation is still pending. A guard that protects unsaved work can't cancel it, and the app leaves the page.

Reported in [sveltejs/kit#ISSUE](https://github.com/sveltejs/kit/issues/ISSUE).

## By hand

[Open in StackBlitz](https://stackblitz.com/github/stickerdaniel/sveltekit-beforenavigate-pending-repro), or run `npm install && npm run dev`.

The editor at `/` cancels every navigation that leaves it and logs each `beforeNavigate` call. "Apply filter" calls `goto('?filter=n', { replace: true, reset: false })`, and the page's `load` takes 1.5 s for a filter.

1. Open `/` and click "Leave to /other". The log shows the cancelled `link`, and the editor stays.
2. Click "Apply filter", then "Leave to /other" within 1.5 s.

Expected: the log shows the cancelled `link`, and the editor stays.
Actual: the log shows only the `goto`, and the app navigates to `/other`.

## Automated

```sh
npm install
npx playwright install chromium
npm run build
npm run repro
```

`repro.mjs` runs both steps 5 times each and prints whether `beforeNavigate` saw the click and where the run ended. With `@sveltejs/kit` 3.1.1 in Chromium 156:

| case                         | `beforeNavigate` saw the link | ended on |
| ---------------------------- | ----------------------------- | -------- |
| Leave                        | 5/5                           | `/`      |
| Leave while the filter loads | 0/5                           | `/other` |
