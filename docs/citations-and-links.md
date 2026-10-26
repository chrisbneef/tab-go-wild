# Citations, directories & local links (plan — no accounts created)

Lead-gen sites can't honestly claim a business address, so most "citation" sites (which are built around
NAP: name, address, phone) either don't fit or must wait for the renter. Below, sorted by **now** vs
**wait for renter**. Never create a fake address, virtual office or Google Business Profile for this site.

## A. Do now (fits a resource site, no address needed)

| Opportunity | Why it fits | Notes |
|---|---|---|
| Google Search Console + Bing Webmaster Tools | Indexing; Bing also feeds ChatGPT/Copilot search | See README §6 |
| Facebook Page + Instagram | Brand presence, `sameAs` in schema | Category "Home improvement website"/"Local service"; no address; add URLs to `SITE.social` |
| YouTube channel (optional) | Short how-to videos (moss, gutters, storm steps) embed well and rank | Educational only |
| Pinterest (optional) | Home/roof material comparison pins get steady traffic | Links to cost/material pages |
| Local news & blog outreach | Pitch the sourced cost guide or storm checklist as a resource when storms hit | West Linn Tidings, Lake Oswego Review, Oregon City News (Pamplin/Portland Tribune local papers), Patch |
| Neighborhood association newsletters | Offer the free storm checklist PDF as a neighbor resource | West Linn's recognized neighborhood associations, Lake Oswego NAs, Oregon City NAs. Ask, don't spam; no sales copy |
| HOA management companies | Send the roof replacement guide as a free homeowner handout | Pitch: "free, sourced homeowner guide, no sales" |
| Real estate agents (south metro) | Agents share roof checklists with buyers/sellers; link from their resource pages | You already know local agents through MP Strategies |
| Home inspectors | Roof sections of their reports; link to the inspection & repair-vs-replace pages | |
| Reddit r/Portland, r/askportland (careful) | Answer roof questions genuinely; link only when it's the best answer | Read subreddit self-promo rules first |
| Quora / answer engines | Answer "roof cost Portland", "moss on roof Oregon" with the sourced figures | |
| HARO-style journalist requests (Qwoted, Featured, Help a B2B Writer) | Quotes on roof costs/moss/storms → links from home sites | Speak as "local roofing resource", not a contractor |
| Your own MP Strategies site | A case study/portfolio link (no "client" claim) | Optional; reveals your involvement |

## B. Wait for the renter (needs a real business, license or address)

| Opportunity | Why wait |
|---|---|
| **Google Business Profile** | Must be the renter's own verified profile. Link it in `RENTER.googleBusinessProfileUrl`. |
| Apple Business Connect / Apple Maps | Needs a real business location |
| Bing Places | Needs a real business (can import the renter's GBP) |
| Yelp, BBB, Angi, HomeAdvisor, Thumbtack, Houzz, Porch, Nextdoor Business (as a contractor) | Contractor profiles: license/address/reviews belong to the renter |
| Manufacturer contractor locators (GAF, Owens Corning, CertainTeed, Malarkey, IKO) | Certification is the roofer's |
| NRCA / Roofing Contractors Association of Washington-Oregon type trade groups | Membership is the roofer's |
| Chambers of commerce (West Linn, Lake Oswego, Oregon City, North Clackamas) | Membership needs a real business; great once rented |
| Data aggregators (Data Axle, Neustar Localeze, Foursquare) | NAP-based; use the renter's NAP |
| Local sponsorships (Little League, school auctions, Oregon City's First City Celebration-type events) | Sponsor as the renter's brand for real local links |

## C. Internal & technical (done in the build)

- Organization schema with `areaServed` for 5 cities (switches to `RoofingContractor` + CCB # when rented)
- Service, FAQPage, BreadcrumbList, Article and HowTo schema on the relevant pages
- `sitemap-index.xml`, `robots.txt`, `llms.txt`, per-city OG images, canonical URLs
- Services × cities link matrix on /services/ and /areas/; every city links to every service and its cost guide

## D. Link-earning assets already on the site

1. **Roof replacement cost guide** (every published figure side by side, with sources) → journalists, Reddit, agents
2. **Storm & leak first-steps checklist** (1-page PDF) → neighborhood associations, HOAs, local news during storms
3. **Oregon roof replacement guide** (8-page PDF) → agents, inspectors, HOA managers
4. **Cost estimator** → "roof cost calculator Oregon" searches and resource pages
