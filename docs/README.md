# Willamette Falls Roofing — rank-and-rent site

Static Astro site + one Vercel serverless function (`api/quote.js`) for the quote form.
Built for Portland's south metro: Lake Oswego, West Linn, Oregon City (tier 1), Gladstone, Milwaukie (tier 2).

> **Compliance in one line:** until a licensed roofer rents it, the site presents itself as a local roofing
> *resource* that connects homeowners with a CCB-licensed roofer. It never claims to be a contractor,
> shows no license number, reviews, address, years in business, crew photos or guarantees
> (Oregon OAR 812-003-0120). Flip `RENTER.active` only when a real licensed roofer has signed.

---

## 1. What's in the repo

```
src/config/site.js      <- THE config: brand name, domain, phone, form endpoint, RENTER block
src/data/*.js           <- all content: services, cities, costs (with sources), FAQs, checklist
src/pages/              <- routes (home, /services/*, /areas/*, /roof-replacement-cost/*, estimator, FAQ…)
src/components/         <- header, footer, quote form, license line, etc.
api/quote.js            <- Vercel function: emails/forwards quote-form leads (no keys in code)
public/                 <- favicons, OG images (public/og), lead-magnet PDFs (public/downloads)
docs/                   <- this README + the off-site kit (social, citations, content plan, renter pitch)
docs/lead-magnets/      <- HTML sources of the two PDFs (edit, then re-print to PDF)
```

Local dev: `npm install` then `npm run dev` (Node 20.3+ / 22). Production build: `npm run build` → `dist/`.

## 2. Deploy on Vercel (about 5 minutes)

1. Vercel → **Add New → Project** → import `chrisbneef/tab-go-wild`.
2. Framework preset: **Astro** (auto-detected). Build command `npm run build`, output `dist` (defaults). No other settings.
3. Add the environment variables below (Settings → Environment Variables), then **Deploy**.
4. Visit `https://<project>.vercel.app/get-a-quote/` and submit a test lead.

## 3. Environment variables (form delivery)

The quote form posts to `/api/quote`. Set **at least one** delivery method or the form shows an error:

| Variable | Required | What it is |
|---|---|---|
| `LEAD_TO_EMAIL` | with Resend | Where leads go, comma-separated. Start with your inbox; later add/replace with the renter's. |
| `RESEND_API_KEY` | with Resend | Free Resend account (resend.com, free tier) → API Keys. |
| `LEAD_FROM_EMAIL` | optional | Verified sender, e.g. `Roof Leads <leads@willamettefallsroofing.com>` (verify the domain in Resend). Until then it uses Resend's test sender, which can only deliver to your Resend account email. |
| `LEAD_WEBHOOK_URL` | optional | Also POST each lead as JSON to a webhook: a Google Apps Script → Google Sheet, Zapier/Make, or a Slack incoming webhook. Can be used instead of Resend. |

No keys live in the code. Redeploy after changing env vars.

**Alternative (no function):** set `formEndpoint` in `src/config/site.js` to a Formspree form URL (`https://formspree.io/f/xxxx`). The form already sends `Accept: application/json`, which Formspree supports.

## 4. Buy the domain and connect it

1. Buy **willamettefallsroofing.com** (Cloudflare Registrar, Porkbun or Namecheap; ~$10–12/yr). It was unregistered on 2026-10-26.
2. Vercel → Project → Settings → Domains → add `www.willamettefallsroofing.com` and `willamettefallsroofing.com` (redirect apex → www). Follow the DNS records Vercel shows.
3. If you choose a different domain or name, change `SITE.name`, `SITE.url`, `SITE.domain` and `SITE.email` in `src/config/site.js` and the brand text in the two lead-magnet HTML files.

## 5. Add a call-tracking number

The site ships with a **placeholder** number `(503) 555-0123` and `isPlaceholder: true`, so it shows "Request a callback" / estimator buttons instead of tap-to-call.

1. Get a local 503/971 tracking number that forwards to your phone (CallRail, CallTrackingMetrics, or Twilio + a simple forward; ~$3–50/mo). Turn on call recording with a disclosure if you want proof of calls for the renter pitch.
2. In `src/config/site.js` set:
   ```js
   phone: { display: '(503) 555-1234', e164: '+15035551234', isPlaceholder: false },
   ```
3. Commit → Vercel redeploys. Tap-to-call buttons appear in the header, sticky mobile bar, CTAs and schema.
4. Keep the **same tracking number** when the site is rented: forward it to the renter. That's how you prove call volume and how you switch the calls off if they stop paying.

## 6. Google Search Console + Bing

1. search.google.com/search-console → Add property → **Domain** → verify with the DNS TXT record.
2. Sitemaps → submit `https://www.willamettefallsroofing.com/sitemap-index.xml`.
3. URL Inspection → request indexing for the home page, the 5 city pages and the cost guide.
4. Bing Webmaster Tools → import from Search Console (also feeds ChatGPT/Copilot search).
5. Optional analytics: Vercel Web Analytics (one click in Vercel) or Plausible. Avoid heavy tag managers to keep it fast.

**No Google Business Profile for this site.** Google suspends lead-gen/virtual-office profiles. Map-pack visibility comes later from the **renter's own** GBP (link it in `RENTER.googleBusinessProfileUrl`).

## 7. Swap in the renter (10 minutes)

1. Verify the roofer's license at https://search.ccb.state.or.us/search/ (active, name matches, bond/insurance current).
2. Edit `src/config/site.js` → `RENTER`:
   ```js
   active: true,
   businessName: 'Example Roofing LLC',
   ccbNumber: '123456',
   phone: { display: '', e164: '' },   // keep blank to keep YOUR tracking number (recommended)
   googleBusinessProfileUrl: 'https://g.page/…',
   website: 'https://exampleroofing.com',
   reviews: [],      // only real reviews, copied with permission, with first name + source + date
   rating: null,     // only if real; see note below
   ```
3. Commit. Automatically: header/footer/how-it-works switch to the renter's name, every page shows
   "Roofing services on this site are provided by … Oregon CCB #…", schema becomes `RoofingContractor`
   with the CCB number, the form's consent line drops "share with a roofer".
4. Set `LEAD_TO_EMAIL` to include the renter's inbox (Vercel env var) and forward the tracking number.
5. Optional: add the renter's real address (`RENTER.address`) only if they want it public.

**Reviews note:** don't mark up third-party Google reviews as `aggregateRating` (Google's self-serving review rule). Show a few real quotes as text with "— Sarah M., Google" and link to the GBP. `RENTER.rating` exists for first-party reviews you collect on the site.

**Rename to the renter's brand entirely?** Change `SITE.name` too. Keep the domain: the rankings live there.

## 8. Before launch checklist

- [ ] Domain bought, connected, HTTPS working
- [ ] Form env vars set; test lead received
- [ ] Tracking number set (or leave placeholder until you have one)
- [ ] Search Console verified, sitemap submitted
- [ ] Someone answers calls/leads pre-rental (you, or a roofer on a free trial week). Don't let leads die: that's the pitch.
- [ ] Re-check cost sources every 6 months (`SITE.updated`, `src/data/costs.js`)

## 9. Content & ranking plan

See `docs/content-roadmap.md` (20 topics by intent), `docs/citations-and-links.md` and `docs/social-calendar.md`.
Renter outreach drafts: `docs/renter-pitch.md` (nothing has been sent).
