# Reconstruction Notes

## Recovered evidence

- React 18.3.1 and React DOM 18.3.1
- React Router DOM 6.26.0 in the bundle; 6.30.4 in source to include compatible security fixes
- Moment 2.30.1
- Chart.js 4.4.3
- Jodit 4.2.10 in the bundle; 4.13.8 in source to address prototype pollution
- Redux Toolkit with one `shopApi` RTK Query slice
- Ant Design, Socket.IO Client, React Hot Toast, and React Icons
- API and socket origin: `https://api.akdala.com`
- JSON-encoded local-storage keys: `token`, `email`, and `resetToken`
- Roles: `ADMIN`, `SUPER_ADMIN`, `VENDOR`, `USER`, `RIDER`, and `PROFESSIONAL`

The recovered CSS, logo, avatar, favicon, route labels, form labels, endpoint
paths, HTTP methods, cache tags, query defaults, Socket.IO event names, and role
decisions were taken directly from the surviving build.

## Assumptions

- API response collections can appear either as `response.data` or nested
  `response.data.data`; shared response helpers accept both because the bundle
  used both patterns across endpoints.
- Some original source filenames and internal component boundaries were not
  recoverable. Names now describe observed responsibilities.
- Package versions without embedded version metadata are pinned to compatible
  releases from the same bundle generation.
- Socket.IO Client is pinned to 4.8.3 rather than the vulnerable recovered 4.7.x
  line.
- `/vendor` now redirects to `/vendor/dashboard`. The production guard redirected
  vendors to `/vendor` but had no index child, which could render an empty layout;
  the redirect is treated as an accidental source bug.
- The existing API has not been mutated during reconstruction. Full visual/data
  parity for protected routes requires the agreed non-production admin and vendor
  test credentials.

## Reference-build restoration

The first reconstruction build was accidentally emitted to Vite's default
`dist/` directory. Before that build, the original JavaScript had been copied and
fully formatted in a temporary forensic workspace, while CSS and static assets
had been copied into `src/`. The reference filenames and contents were restored
from those copies and future builds were moved to `dist-recovered/`.

The restored JavaScript is semantically equivalent but was re-minified from the
formatted forensic copy, so its bytes and size are not identical to the initially
supplied minified file. The original asset filenames and `index.html` references
are retained.
