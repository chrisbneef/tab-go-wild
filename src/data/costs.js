// Every cost figure on the site comes from here, with its source.
// These are published estimates, not quotes. Checked 2026-10-26.
// basis: 'page' = we read the page; 'snippet' = seen in search results only; 'secondary' = quoted by another site.

export const SOURCES = {
  interstateOR: { name: 'Interstate Roofing, Oregon roof cost calculator', url: 'https://www.interstateroofing.com/or/roof-cost-calculator', basis: 'page' },
  interstatePDX: { name: 'Interstate Roofing, Portland roofing page', url: 'https://www.interstateroofing.com/or/portland/roofing', basis: 'page' },
  jobin: { name: 'Jobin Roofing, roof replacement cost Portland/Vancouver (updated Sept 2026)', url: 'https://jobinroofing.com/roof-replacement-cost-vancouver-wa-portland-or/', basis: 'page' },
  stanley: { name: 'Stanley Roof and Solar, new roof cost Portland/Vancouver', url: 'https://stanleyroofandsolar.com/new-roof-cost-portland-vancouver/', basis: 'page' },
  tohOR: { name: 'This Old House, roof replacement cost in Oregon', url: 'https://www.thisoldhouse.com/roofing/roof-replacement-cost-oregon', basis: 'page' },
  hgRoof: { name: 'HomeGuide, roof replacement cost', url: 'https://homeguide.com/costs/roof-replacement-cost', basis: 'page' },
  cvv2025: { name: 'Remodeling / Zonda Cost vs. Value 2025 (national averages)', url: 'https://www.jlconline.com/cost-vs-value/2025/', basis: 'page' },
  hgMetal: { name: 'HomeGuide, metal roofing cost', url: 'https://homeguide.com/costs/metal-roofing-pros-and-cons', basis: 'page' },
  hgCedar: { name: 'HomeGuide, cedar shake roof cost', url: 'https://homeguide.com/costs/cedar-shake-roof-cost', basis: 'page' },
  hgTPO: { name: 'HomeGuide, TPO roofing cost', url: 'https://homeguide.com/costs/tpo-roofing-cost', basis: 'page' },
  angiFlatPDX: { name: 'Angi, flat roof replacement cost in Portland', url: 'https://www.angi.com/articles/how-much-does-flat-roof-replacement-cost/or/portland', basis: 'snippet' },
  angiRepairPDX: { name: 'Angi, roof repair cost in Portland', url: 'https://www.angi.com/articles/how-much-do-roof-repairs-cost/or/portland', basis: 'snippet' },
  hgRepair: { name: 'HomeGuide, roof repair cost', url: 'https://homeguide.com/costs/roof-repair-cost', basis: 'page' },
  hgGutter: { name: 'HomeGuide, gutter installation cost', url: 'https://homeguide.com/costs/gutter-installation-cost', basis: 'page' },
  agsOR: { name: 'American Gutter Service, gutter installation cost in Oregon (quoting Angi Portland data)', url: 'https://americangutterservice.com/gutter-installation-cost-oregon/', basis: 'secondary' },
  hgClean: { name: 'HomeGuide, roof cleaning cost', url: 'https://homeguide.com/costs/roof-cleaning-cost', basis: 'page' },
  pcrMoss: { name: 'Portland Clean Roof, moss removal & treatment', url: 'https://portlandcleanroof.com/services/moss-removal-treatment/', basis: 'page' },
  hgSkylight: { name: 'HomeGuide, skylight replacement or repair cost', url: 'https://homeguide.com/costs/skylight-replacement-or-repair-cost', basis: 'page' },
  hgInspect: { name: 'HomeGuide, roof inspection cost', url: 'https://homeguide.com/costs/roof-inspection-cost', basis: 'page' },
};

// Whole-job figures for a full roof replacement (mostly asphalt).
export const REPLACEMENT_FIGURES = [
  { label: 'Portland-area full replacement, typical range', value: '$8,211 – $23,958', src: 'interstatePDX' },
  { label: 'Oregon new roof, all materials', value: '$9,300 – $27,200', src: 'interstateOR' },
  { label: 'Portland/Vancouver, most homes (architectural asphalt, full tear-off)', value: '$14,000 – $20,000 (full range $12,000 – $30,000+)', src: 'jobin' },
  { label: 'Portland/Vancouver, asphalt on a typical 20–30 square home', value: '$20,000 – $36,000', src: 'stanley' },
  { label: 'Oregon average (This Old House)', value: '$7,225 average; $5,639 – $18,173 range', src: 'tohOR' },
  { label: 'National: asphalt reroof, 3,000 sq ft of roof, full tear-off', value: '$31,871 job cost; about 67.5% recouped at resale', src: 'cvv2025' },
];

// Installed $ per square foot of ROOF area, used by the estimator.
// low/high = the envelope of the cited sources (rounded), not a quote.
export const MATERIAL_RATES = {
  asphalt: { label: 'Architectural asphalt shingles', low: 4.5, high: 9, note: 'Low end near This Old House\'s Oregon average ($4.56/sq ft); high end from a Portland roofer\'s installed range ($7–$9/sq ft).', srcs: ['tohOR', 'jobin'] },
  metal: { label: 'Standing-seam metal', low: 9, high: 16, note: 'HomeGuide\'s standing-seam range ($9–$16+/sq ft). A Portland roofer quotes about $32,000–$62,000 for a typical 20–30 square home, so local bids can run higher.', srcs: ['hgMetal', 'stanley'] },
  cedar: { label: 'Cedar shake (real wood)', low: 25, high: 30, note: 'HomeGuide\'s real cedar shake range; synthetic shake runs about $12–$20/sq ft.', srcs: ['hgCedar'] },
  synthetic: { label: 'Synthetic / composite shake', low: 12, high: 20, note: 'HomeGuide\'s synthetic shake range.', srcs: ['hgCedar'] },
  flat: { label: 'Flat / low-slope membrane (TPO)', low: 4, high: 16, note: 'HomeGuide\'s TPO range ($4–$10/sq ft) to Angi\'s Portland flat-roof figure ($8,000–$16,000 for about 1,000 sq ft).', srcs: ['hgTPO', 'angiFlatPDX'] },
};

export const OTHER_COSTS = [
  { item: 'Roof repair (Portland)', value: '$372 – $1,872 for most projects; about $1,118 average', src: 'angiRepairPDX' },
  { item: 'Minor roof repair', value: '$150 – $1,000 (many roofers have a $150 – $300 minimum)', src: 'hgRepair' },
  { item: 'Flashing repair', value: '$200 – $500', src: 'hgRepair' },
  { item: 'Repairs involving water damage', value: '$1,000 – $6,000+', src: 'hgRepair' },
  { item: 'Emergency / after-hours premium', value: 'about $200 – $300 extra', src: 'hgRepair' },
  { item: 'Roof inspection', value: '$100 – $400 typical', src: 'hgInspect' },
  { item: 'Gutter installation', value: '$12 – $25 per linear foot; $2,200 – $5,000 for an average home', src: 'hgGutter' },
  { item: 'Gutter projects in Portland (Angi data)', value: '$689 – $1,810 for most projects', src: 'agsOR' },
  { item: 'Moss removal + treatment (Oregon roofs)', value: '$350 – $950 depending on size, moss and access', src: 'pcrMoss' },
  { item: 'Roof cleaning', value: '$250 – $600 average; moss treatment alone $100 – $250', src: 'hgClean' },
  { item: 'Zinc strips (materials)', value: '$30 – $60 per 50-foot roll', src: 'hgClean' },
  { item: 'Skylight replacement', value: '$800 – $2,400 average', src: 'hgSkylight' },
  { item: 'Leaking skylight repair', value: '$225 – $800', src: 'hgSkylight' },
];

export const SERVICE_COSTS = {
  'roof-replacement': ['interstatePDX', 'jobin', 'stanley'],
  'roof-repair': ['angiRepairPDX', 'hgRepair'],
  'emergency-leak-storm-repair': ['hgRepair'],
  'roof-inspection': ['hgInspect'],
  gutters: ['hgGutter', 'agsOR'],
  'moss-removal-roof-cleaning': ['pcrMoss', 'hgClean'],
  skylights: ['hgSkylight'],
};

export const costsForService = (slug) => {
  const keys = SERVICE_COSTS[slug] || [];
  if (slug === 'roof-replacement') return REPLACEMENT_FIGURES.filter((f) => keys.includes(f.src)).map((f) => ({ item: f.label, value: f.value, src: f.src }));
  return OTHER_COSTS.filter((c) => keys.includes(c.src) && (
    slug !== 'emergency-leak-storm-repair' || /Emergency|water damage/i.test(c.item)
  ) && (slug !== 'roof-repair' || !/Emergency/.test(c.item)));
};

// Roof area from house size: footprint (sq ft / stories) x pitch factor (slope + typical overhangs).
export const PITCH = {
  low: { label: 'Low (nearly flat to 4/12)', factor: 1.15 },
  medium: { label: 'Medium (5/12 – 8/12, most homes)', factor: 1.25 },
  steep: { label: 'Steep (9/12 and up)', factor: 1.45 },
};
