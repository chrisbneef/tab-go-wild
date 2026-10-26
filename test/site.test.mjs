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
  assert.ok(pages.length >= 36, `only ${pages.length} pages`);
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

test('placeholder phone is never shown as a tap-to-call link', () => {
  if (!SITE.phone.isPlaceholder) return;
  for (const f of pages) assert.ok(!readFileSync(f, 'utf8').includes(`tel:${SITE.phone.e164}`), f);
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
  assert.ok(!sm.includes('thank-you'));
  assert.match(readFileSync(join(DIST, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/www\.willamettefallsroofing\.com\/sitemap-index\.xml/);
  assert.match(readFileSync(join(DIST, 'llms.txt'), 'utf8'), /NOT a roofing contractor/);
});

test('every cost table cites sources', () => {
  for (const f of pages.filter((p) => /roof-replacement-cost|services\/roof-|estimator|roofing-materials/.test(p))) {
    const h = readFileSync(f, 'utf8');
    if (h.includes('<table')) assert.match(h, /class="sources"/, f);
  }
});
