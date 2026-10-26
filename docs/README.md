# Willamette Falls Roofing: rank-and-rent site

Static Astro site, **phone-only**: no forms, no email capture, no server functions. Every call-to-action is tap-to-call to one tracking number; you take voicemails for now and use the weekly call count to pitch renters.
Built for Portland's south metro: Lake Oswego, West Linn, Oregon City (tier 1), Gladstone, Milwaukie (tier 2).

> **Compliance in one line:** until a licensed roofer rents it, the site presents itself as a local roofing
> *resource* that connects homeowners with a CCB-licensed roofer. It never claims to be a contractor,
> shows no license number, reviews, address, years in business, crew photos or guarantees
> (Oregon OAR 812-003-0120). Flip `RENTER.active` only when a real licensed roofer has signed.

---

## 1. What's in the repo

```
src/config/site.js      <- THE config: TRACKING_NUMBER (top of file), brand name, domain, RENTER block
src/data/*.js           <- all content: services, cities, costs (with sources), FAQs, checklist
src/pages/              <- routes (home, /services/*, /areas/*, /roof-replacement-cost/*, estimator, FAQ…)
src/components/         <- header, footer, call button/panel, sticky call bar, license line, Photo
src/assets/photos/      <- source photos by slot (optimized to AVIF/WebP at build); credits in docs/image-credits.md
public/                 <- favicons, OG images (public/og), lead-magnet PDFs (public/downloads)
docs/                   <- this README + the off-site kit (social, citations, content plan, renter pitch)
docs/lead-magnets/      <- HTML sources of the two PDFs (edit, then re-print to PDF)
```

Local dev: `npm install` then `npm run dev` (Node 20.3+ / 22). Production build: `npm run build` → `dist/`.

## 2. Deploy on Vercel (about 5 minutes)

1. Vercel → **Add New → Project** → import `chrisbneef/tab-go-wild`.
2. Framework preset: **Astro** (auto-detected). Build command `npm run build`, output `dist` (defaults). No other settings.
3. **Deploy.** No environment variables are needed (the old quote form, `api/quote.js` and the
   `RESEND_API_KEY` / `LEAD_TO_EMAIL` variables are gone; delete them in Vercel if you set them).
4. Open the site on your phone and tap a call button: it dials the number in `src/config/site.js`.

## 3. Lead model: one phone number, voicemail for now

- Header call button, sticky call bar on phones, a call panel beside every content page, and call bands.
- The cost estimator shows its range immediately (no gate) and ends with a call button.
- The two PDFs (roof guide, leak checklist) are direct downloads. No email is collected anywhere.
- Copy promises no callback time. The standard line is: *"Call to talk with a local, CCB-licensed roofer.
  If we miss you, leave a message and we'll get back to you."* Keep it that way unless someone really answers live.
- Click-to-text is built in but off: set `TEXTING_ENABLED = true` in `src/config/site.js` only if your
  tracking number receives SMS.
- **Return every voicemail** (or pass it to a roofer on a free trial week). Unanswered leak calls are bad for
  the homeowner and for your future renter pitch.

## 4. Buy the domain and connect it

1. Buy **willamettefallsroofing.com** (Cloudflare Registrar, Porkbun or Namecheap; ~$10–12/yr). It was unregistered on 2026-10-26.
2. Vercel → Project → Settings → Domains → add `www.willamettefallsroofing.com` and `willamettefallsroofing.com` (redirect apex → www). Follow the DNS records Vercel shows.
3. If you choose a different domain or name, change `SITE.name`, `SITE.url`, `SITE.domain` (and the optional `SITE.email` contact) in `src/config/site.js` and the brand text in the two lead-magnet HTML files.

## 5. Add the call-tracking number (voicemail + weekly call counts)

The site ships with a **placeholder** number `(503) 555-0123` (555-01xx numbers are fictional and never ring).
Call buttons still render so you can see the design, and a small "Placeholder number" tag shows in the call
panels and footer until you swap it.

**What you need from the number:** a local 503/971 number, voicemail with a short greeting, call recording
(with the disclosure your provider plays), call/voicemail notifications to your phone or email, and a call
log you can export so you can quote "X calls per week" to roofers. Later: forward to the renter's phone.

| Option type | Pros | Cons |
|---|---|---|
| **Dedicated call-tracking service** (e.g. CallRail, CallTrackingMetrics, WhatConverts) | Voicemail, recording, transcription, weekly reports and per-source tracking out of the box; easy forwarding to a renter later; dashboards you can screenshot for the pitch | Highest monthly cost (typically tens of dollars a month per account; check current plans); more than you need for one site |
| **Programmable telephony** (e.g. Twilio, Telnyx, Plivo) | Pennies per number and per minute; full control (voicemail, recording, SMS, call logs via API) | You build the voicemail/forwarding flow yourself (or use a template); reporting is DIY |
| **Virtual business line apps** (e.g. Google Voice for Workspace, OpenPhone/Quo, Grasshopper) | Cheap and simple; voicemail transcription and a call log on your phone; texting usually included | Weak reporting for proving volume; some restrict call forwarding or reselling the number |

Pick one, then:

1. In `src/config/site.js` (top of the file) set
   ```js
   export const TRACKING_NUMBER = '(503) 555-1234';
   export const TRACKING_NUMBER_IS_PLACEHOLDER = false;
   ```
   (and `TEXTING_ENABLED = true` only if the number takes texts).
2. Commit → Vercel redeploys. Every call button, the sticky bar and the schema `telephone` use the new number.
3. Track calls per week from day one (a simple sheet: date, caller city, job type, voicemail or answered).
   That log is your renter pitch.
4. Keep the **same tracking number** when the site is rented: forward it to the renter. That's how you prove
   call volume and how you switch the calls off if they stop paying.

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
3. Commit. Automatically: header/footer/how-it-works and the call panels switch to the renter's name, every
   page shows "Roofing services on this site are provided by … Oregon CCB #…", and schema becomes
   `RoofingContractor` with the CCB number.
4. Forward the tracking number to the renter's phone (keep the number itself in your account).
5. Optional: add the renter's real address (`RENTER.address`) only if they want it public.

**Reviews note:** don't mark up third-party Google reviews as `aggregateRating` (Google's self-serving review rule). Show a few real quotes as text with "— Sarah M., Google" and link to the GBP. `RENTER.rating` exists for first-party reviews you collect on the site.

**Rename to the renter's brand entirely?** Change `SITE.name` too. Keep the domain: the rankings live there.

## 8. Before launch checklist

- [ ] Domain bought, connected, HTTPS working
- [ ] Tracking number with voicemail set in `src/config/site.js`; test call and voicemail received
- [ ] Weekly call log started
- [ ] Search Console verified, sitemap submitted
- [ ] Someone returns voicemails pre-rental (you, or a roofer on a free trial week). Don't let leads die: that's the pitch.
- [ ] Re-check cost sources every 6 months (`SITE.updated`, `src/data/costs.js`)

## 9. Photos

All photos are free-license stock or Wikimedia Commons files; sources, photographers and licenses are in
`docs/image-credits.md` and on the site's /image-credits/ page (required for the CC BY / BY-SA files). No photo is
presented as anyone's crew or work. To use your own local photos, drop a JPEG into `src/assets/photos/` with
the same slot name (e.g. `hero.jpg`) and update the credits.

Design decisions: `docs/design-principles.md`.

## 10. Content & ranking plan

See `docs/content-roadmap.md` (20 topics by intent), `docs/citations-and-links.md` and `docs/social-calendar.md`.
Renter outreach drafts: `docs/renter-pitch.md` (nothing has been sent).
