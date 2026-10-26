/**
 * Photo slots. Files live in src/assets/photos/<slot>.jpg and are optimized at build
 * time by astro:assets (AVIF + WebP, responsive widths, width/height set).
 * Sources and licenses: docs/image-credits.md. None of these photos show our own work
 * or crew: the site is not a contractor. Swap in real local photos by replacing a file.
 */
const files = import.meta.glob('../assets/photos/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });

export const ALT = {
  "hero": "A home with steep gabled roofs among tall evergreens at dusk",
  "falls": "Willamette Falls on the river between Oregon City and West Linn",
  "rain-roof": "Rain running off the edge of a shingle roof into the gutter",
  "moss": "Moss growing on an old roof",
  "roofer": "A roofer in a safety harness fastening shingles on a house",
  "shingles": "Rows of asphalt roof shingles",
  "metal": "A grey standing-seam metal roof with a dormer window",
  "cedar": "A weathered wood shake roof with two dormers",
  "flat": "Low-slope membrane roofs seen from above",
  "gutters": "Leaves and needles collecting along a roof edge",
  "skylight": "Looking up through an open skylight at the sky",
  "inspection": "Someone standing on a roof above a ladder, looking over the shingles",
  "storm": "Trees down across a road after an ice storm",
  "lake-oswego": "Oswego Lake at dusk, ringed by evergreens",
  "west-linn": "The historic 1896 Lewthwaite-Moffatt House on Willamette Falls Drive in West Linn",
  "oregon-city": "The Oregon City Municipal Elevator",
  "milwaukie": "The Willamette River at Milwaukie Bay Park",
  "gladstone": "The riverside in Gladstone, Oregon",
  "street": "A white house among tall trees"
};

const FALLBACK = {
  'rain-roof': ['gutters', 'hero'], storm: ['rain-roof', 'inspection', 'hero'], inspection: ['roofer', 'hero'],
  skylight: ['shingles', 'hero'], flat: ['metal', 'hero'], cedar: ['shingles', 'hero'], metal: ['shingles', 'hero'],
  shingles: ['roofer', 'hero'], gutters: ['rain-roof', 'hero'], moss: ['shingles', 'hero'], roofer: ['shingles', 'hero'],
  'lake-oswego': ['street', 'hero'], 'west-linn': ['falls', 'hero'], 'oregon-city': ['falls', 'hero'],
  milwaukie: ['street', 'hero'], gladstone: ['street', 'hero'], street: ['hero'], falls: ['hero'],
};

function find(slot) {
  const key = Object.keys(files).find((k) => k.replace(/^.*\//, '').replace(/\.\w+$/, '') === slot);
  return key ? files[key] : null;
}

/** Returns { src: ImageMetadata, alt, slot } for a slot, walking fallbacks. */
export function photo(slot) {
  const chain = [slot, ...(FALLBACK[slot] || ['hero'])];
  for (const s of chain) {
    const src = find(s);
    if (src) return { src, alt: ALT[s] || '', slot: s };
  }
  return null;
}

export const SERVICE_PHOTO = {
  'roof-replacement': 'roofer',
  'roof-repair': 'shingles',
  'emergency-leak-storm-repair': 'storm',
  'roof-inspection': 'inspection',
  gutters: 'gutters',
  'moss-removal-roof-cleaning': 'moss',
  skylights: 'skylight',
  'asphalt-shingles': 'shingles',
  'metal-roofing': 'metal',
  'cedar-shake': 'cedar',
  'flat-roof-tpo': 'flat',
};
