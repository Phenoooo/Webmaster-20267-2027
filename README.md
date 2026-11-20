# The AI Courtroom

An interactive site for practicing AI literacy through short courtroom scenarios.

## Development

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Use `npm run lint` for linting and `npm run build` to validate a production build.

## Project map

- `app/` contains route entry points and page-specific case scenarios.
- `components/` contains shared navigation, court layouts, and home/game views.
- `lib/courts.ts` defines court names, descriptions, skills, and routes.
- `app/globals.css` holds shared design tokens, responsive styles, and image treatments.
- `public/` contains the photos, illustration, and video used by the pages.

To add or edit a court, update its details in `lib/courts.ts`, its scenario in
`app/<court-route>/page.tsx`, and its artwork or photo rules in
`components/CourtArtwork.tsx` and `app/globals.css`.
