# Willamette Falls Roofing

Rank-and-rent roofing site for Portland's south metro (Lake Oswego, West Linn, Oregon City, Gladstone, Milwaukie).
Astro (static), phone-only: every CTA is tap-to-call to one tracking number. No forms, no email capture.

- **Deploy, domain, tracking number (voicemail + weekly call counts), Search Console, renter swap:** [`docs/README.md`](docs/README.md)
- **One config file for name / phone / CCB / renter:** [`src/config/site.js`](src/config/site.js). The phone is the `TRACKING_NUMBER` constant at the top; it's a **placeholder** `(503) 555-0123` until you paste the real tracking number and set `TRACKING_NUMBER_IS_PLACEHOLDER = false`.
- **Design principles:** [`docs/design-principles.md`](docs/design-principles.md). **Photo credits:** [`docs/image-credits.md`](docs/image-credits.md)
- Off-site kit: [`docs/social-calendar.md`](docs/social-calendar.md), [`docs/citations-and-links.md`](docs/citations-and-links.md), [`docs/content-roadmap.md`](docs/content-roadmap.md), [`docs/renter-pitch.md`](docs/renter-pitch.md)

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # -> dist/
```
