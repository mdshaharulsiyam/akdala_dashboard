# Shop Dashboard (Recovered Source)

This project is a maintainable reconstruction of the Vite production bundle that
was preserved in `dist/`. The new source is organized by routes, pages, layouts,
components, hooks, services, constants, utilities, assets, and styles.

## Run locally

```bash
npm install
npm run dev
```

The API and Socket.IO origins default to the local backend:

```env
VITE_API_BASE_URL=http://localhost:5004
VITE_SOCKET_URL=http://localhost:5004
```

Copy `.env.example` to `.env` to override either value.

## Commands

- `npm run dev` — Vite development server
- `npm run build` — production build in `dist-recovered/`
- `npm run preview` — preview the recovered production build
- `npm run test` — Vitest tests
- `npm run lint` — source linting

`dist/` is the production-reference build. Reconstructed builds intentionally use
`dist-recovered/` so subsequent verification does not replace that reference.

## Architecture

- `src/routes` — React Router route tree and role guards
- `src/layouts` — shared responsive dashboard shell
- `src/pages` — route-level admin, vendor, and authentication features
- `src/components` — shared navigation, states, cards, dialogs, and editor
- `src/services` — RTK Query endpoints grouped by backend domain
- `src/hooks` — profile, debounce, and Socket.IO behavior
- `src/constants` and `src/utils` — recovered routes, roles, storage keys, formatting, and form-data helpers
- `src/styles/recovered.css` — exact recovered compiled stylesheet
- `src/styles/source.css` — maintainable source additions and layout rules

See [RECOVERY_NOTES.md](./RECOVERY_NOTES.md) for evidence, assumptions, and
remaining credential-dependent verification.
