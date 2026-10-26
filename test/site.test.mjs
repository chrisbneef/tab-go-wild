// Run after `npm run build`:  node --test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { SITE, RENTER } from '../src/config/site.js';

const DIST = new URL('../dist/', import.meta.url).pathname;
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk(DIST).filter((f) => f.endsWith('.html'));

test('builds the expected set of pages', () => {
  assert.ok(pages.length >= 34, `only ${pages.length} pages`);
  for (const p of ['index.html', 'services/roof-replacement/index.html', 'areas/west-linn/index.html', 'roof-replacement-cost/lake-oswego/index.html', 'roof-cost-estimator/index.html', 'faq/index.html', 'how-it-works/index.html', 'privacy/index.html', 'terms/index.html', 'resources/storm-leak-checklist/index.html'])
    assert.ok(existsSync(join(DIST, p)), `missing ${p}`);
});

test('every page has title, viewport, description, canonical, one h1 and valid JSON-LD', () => {
  for (const f of pages) {
    const h = readFileSync(f, 'utf8');
    assert.match(h, /<title>[^<]{10,}<\/title>/, f);
    assert.match(h, /name="viewport" content="width=device-width, initial-scale=1"/, f);
    assert.match(h, /name="description" content="[^"]{40,}"/, f);
    assert.match(h, /rel="canonical" href="https:\/\/www\.willamettefallsroofing\.com\//, f);
    assert.equal((h.match(/<h1[\s>]/g) || []).length, 1, `h1 count ${f}`);
    for (const m of h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) JSON.parse(m[1]);
    assert.doesNotMatch(h, /\bundefined\b|\bNaN\b|\[object Object\]|TODO|lorem/i, f);
  }
});

test('pre-rental compliance: no contractor claims, no license number, no fake reviews', () => {
  if (RENTER.active) return;
  for (const f of pages) {
    const h = readFileSync(f, 'utf8');
    assert.match(h, /is not a roofing contractor/, `disclaimer missing ${f}`);
    assert.doesNotMatch(h, /CCB #\d|aggregateRating|"@type":"Review"|years in business|since 19\d\d|our crew/i, f);
    assert.doesNotMatch(h, /RoofingContractor/, f);
  }
});

test('phone-only lead model: every page drives to the one tracking number', () => {
  const tel = `tel:${(RENTER.active && RENTER.phone?.e164) || SITE.phone.e164}`;
  for (const f of pages.filter((p) => !p.endsWith('404.html'))) {
    const h = readFileSync(f, 'utf8');
    assert.ok((h.split(`href="${tel}"`).length - 1) >= 2, `call links missing ${f}`);
    assert.match(h, /class="mobile-cta"/, `sticky call bar missing ${f}`);
    assert.doesNotMatch(h, /<form[\s>]|type="email"|name="email"|mailto:|\/api\/quote|get-a-quote/i, `form or email capture in ${f}`);
  }
  assert.ok(!existsSync(new URL('../api/quote.js', import.meta.url)), 'api/quote.js should be gone');
});

test('the placeholder number is clearly flagged until the tracking number is in', () => {
  if (!SITE.phone.isPlaceholder) return;
  assert.match(SITE.phone.display, /555-01\d\d/, 'placeholder must stay a fictional 555-01xx number');
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');
  assert.match(home, /Placeholder number/);
});

test('honest call copy: no promised callback times or guaranteed roofer callbacks', () => {
  for (const f of pages) {
    const h = readFileSync(f, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
    assert.doesNotMatch(h, /call(?:s)? you back (?:with)?in|within \d+ (?:minutes|hours)|guaranteed? (?:a )?(?:call|callback|response)|same[- ]day callback|24\/7/i, f);
  }
});

test('photos are optimized: modern formats, dimensions, alt text, lazy below the fold', () => {
  for (const f of pages) {
    const h = readFileSync(f, 'utf8');
    const imgs = [...h.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
    for (const img of imgs) {
      assert.match(img, /\swidth="\d+"/, `no width: ${img.slice(0, 120)} in ${f}`);
      assert.match(img, /\sheight="\d+"/, `no height in ${f}`);
      assert.match(img, /\salt(="|[\s>])/, `no alt in ${f}`);
    }
    if (imgs.length > 2) assert.ok(imgs.filter((i) => /loading="lazy"/.test(i)).length >= imgs.length - 2, `lazy-loading missing in ${f}`);
    if (imgs.length) assert.match(h, /type="image\/avif"/, `no AVIF source in ${f}`);
  }
});

test('local asset references resolve', () => {
  const missing = new Set();
  for (const f of pages) {
    const h = readFileSync(f, 'utf8');
    for (const m of h.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)) {
      const u = m[1];
      if (u.startsWith('/api/')) continue;
      const p = join(DIST, u);
      if (!(existsSync(p) && statSync(p).isFile()) && !existsSync(join(p, 'index.html'))) missing.add(`${u} (in ${f.replace(DIST, '')})`);
    }
  }
  assert.deepEqual([...missing], []);
});

test('sitemap, robots and llms.txt exist', () => {
  const sm = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
  assert.ok((sm.match(/<loc>/g) || []).length >= 34);
  assert.ok(!sm.includes('thank-you') && !sm.includes('get-a-quote'));
  assert.match(readFileSync(join(DIST, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/www\.willamettefallsroofing\.com\/sitemap-index\.xml/);
  assert.match(readFileSync(join(DIST, 'llms.txt'), 'utf8'), /NOT a roofing contractor/);
});

test('every cost table cites sources', () => {
  for (const f of pages.filter((p) => /roof-replacement-cost|services\/roof-|estimator|roofing-materials/.test(p))) {
    const h = readFileSync(f, 'utf8');
    if (h.includes('<table')) assert.match(h, /class="sources"/, f);
  }
});
