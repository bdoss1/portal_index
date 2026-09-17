# Portal Index

A Next.js App Router field guide to Rick and Morty, built with React and the public Rick and Morty API.

## Run

```sh
npm install
npm run dev
```

Visit http://localhost:3000. For production, run `npm run build` followed by `npm start`.

## Features

- Debounced character search, status filters, and API pagination
- Shareable character detail routes with origin, location, and episode appearances
- Episode search, season filters, and expandable character casts
- Responsive animated portal styling with reduced-motion support
- Loading, empty, error, and retry states; stale requests are cancelled

The API and character images are loaded directly from https://rickandmortyapi.com/api in the browser. Network access to that service is required; unavailable requests show retry states. No API key is needed.

The app lives in `src/app` and `src/components`, with local character portraits in `public/images`. Development uses `.next-dev`, separate from the production `.next` output.
