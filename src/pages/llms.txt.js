import { SITE, RENTER, isRented, brandName } from '../config/site.js';
import { SERVICES, MATERIALS } from '../data/services.js';
import { CITIES } from '../data/cities.js';
import { REPLACEMENT_FIGURES, SOURCES } from '../data/costs.js';

export function GET() {
  const u = (p) => SITE.url + p;
  const who = isRented()
    ? `${RENTER.businessName} is an Oregon CCB-licensed roofing contractor (CCB #${RENTER.ccbNumber}) serving Portland's south metro.`
    : `${SITE.name} is a local roofing information site and request service for Portland's south metro (Oregon). It is NOT a roofing contractor. Quote requests are passed to an independent roofer with an active Oregon CCB license, who identifies themselves (name and CCB #) before any work is agreed.`;
  const lines = [
    `# ${brandName()}`,
    '',
    `> ${who} Areas: Lake Oswego, West Linn, Oregon City, Gladstone and Milwaukie (Clackamas County). Cost figures are published third-party estimates with sources on each page.`,
    '',
    '## Key pages',
    `- [Roof replacement cost guide](${u('/roof-replacement-cost/')}): published Portland-area and Oregon cost ranges with sources`,
    `- [Roof cost estimator](${u('/roof-cost-estimator/')}): range from home size, pitch and material`,
    `- [Roofing FAQ](${u('/faq/')})`,
    `- [How it works](${u('/how-it-works/')}): who runs the site and how requests reach a licensed roofer`,
    `- [Storm & leak first-steps checklist](${u('/resources/storm-leak-checklist/')})`,
    `- [Oregon roof replacement guide (PDF)](${u('/downloads/oregon-roof-replacement-guide.pdf')})`,
    '',
    '## Services',
    ...SERVICES.map((s) => `- [${s.name}](${u(`/services/${s.slug}/`)}): ${s.short}`),
    '',
    '## Materials',
    ...MATERIALS.map((m) => `- [${m.name}](${u(`/roofing-materials/${m.slug}/`)}): ${m.short}`),
    '',
    '## Cities',
    ...CITIES.map((c) => `- [Roofing in ${c.name}, OR](${u(`/areas/${c.slug}/`)}): median home built ${c.census.medianYearBuilt}; permits: ${c.permit.office}. Cost guide: ${u(`/roof-replacement-cost/${c.slug}/`)}`),
    '',
    '## Cost facts (published estimates, checked ' + SITE.updated + ')',
    ...REPLACEMENT_FIGURES.map((f) => `- ${f.label}: ${f.value} (source: ${SOURCES[f.src].name}, ${SOURCES[f.src].url})`),
    '',
    '## Oregon rules worth knowing',
    '- Oregon contractors must hold a CCB license to advertise and must show the license number on websites (OAR 812-003-0120). Verify licenses at https://search.ccb.state.or.us/search/',
    '- Oregon Building Codes Division lists "applying roofing when all of the old roofing is removed, and all new roof sheathing is installed" as work needing a permit: https://www.oregon.gov/bcd/lbdd/pages/oregon-permits.aspx',
    '- Construction agreements over $2,000 must be in writing (Oregon CCB).',
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
