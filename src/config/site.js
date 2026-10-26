/**
 * ============================================================
 *  THE ONE FILE THAT CONTROLS THE BRAND, PHONE AND RENTER.
 * ============================================================
 *  >>> SWAP IN YOUR TRACKING NUMBER HERE <<<
 *  The whole site drives to ONE phone number (no forms, no email capture).
 *  Paste the call-tracking number (with voicemail + call recording) below and
 *  set TRACKING_NUMBER_IS_PLACEHOLDER = false. Every call button updates.
 *  (503) 555-01xx numbers are reserved for fiction and never ring anyone.
 * ------------------------------------------------------------ */
export const TRACKING_NUMBER = '(503) 555-0123';           // <- PLACEHOLDER: replace with the tracking number
export const TRACKING_NUMBER_IS_PLACEHOLDER = true;        // <- set false once the real number is in
export const TEXTING_ENABLED = false;                      // <- true only if the tracking number accepts SMS

/**
 * ============================================================
 *  Before a roofer rents the site:  RENTER.active = false
 *    -> the site presents itself as a local roofing resource that
 *       connects homeowners with a CCB-licensed roofer. It never
 *       claims to be a contractor (Oregon OAR 812-003-0120).
 *
 *  When a roofer rents it: fill in RENTER and set active = true.
 *    -> header, footer, schema, CTAs and the license line switch to
 *       the renter's business name, CCB # and phone automatically.
 *       Only add reviews the renter can prove (copy from their own
 *       Google Business Profile, with the reviewer's first name).
 *  See docs/README.md -> "Swap in the renter".
 */

function toE164(display) {
  const d = String(display).replace(/\D/g, '');
  return d.length === 10 ? `+1${d}` : `+${d}`;
}

export const SITE = {
  // Brand (rename here; also update the domain in vercel + Search Console)
  name: 'Willamette Falls Roofing',
  shortName: 'WF Roofing',
  tagline: 'Roof help for Portland\'s south metro',
  url: 'https://www.willamettefallsroofing.com',
  domain: 'willamettefallsroofing.com',
  // Optional contact address for corrections and privacy requests only (NOT lead capture).
  // Leave '' to show the phone number instead. Set up forwarding once the domain is bought.
  email: '',

  // Built from TRACKING_NUMBER above. Don't edit here.
  // While the placeholder is set, call buttons still render (so the design is visible)
  // and the page shows a small "placeholder number" note; the tests flag it.
  phone: {
    display: TRACKING_NUMBER,
    e164: toE164(TRACKING_NUMBER),
    isPlaceholder: TRACKING_NUMBER_IS_PLACEHOLDER,
  },
  texting: TEXTING_ENABLED,

  serviceArea: {
    primary: ['Lake Oswego', 'West Linn', 'Oregon City'],
    secondary: ['Gladstone', 'Milwaukie'],
    county: 'Clackamas County',
    region: 'Portland south metro, Oregon',
  },

  social: {
    // Add profile URLs once the accounts exist (used in schema sameAs + footer)
    facebook: '',
    instagram: '',
    nextdoor: '',
  },

  updated: '2026-10-26',
};

export const RENTER = {
  active: false, // <- flip to true when a licensed roofer rents the site

  businessName: '',      // e.g. 'Elkridge Roofing LLC'
  ccbNumber: '',         // REQUIRED by Oregon law once active, e.g. '123456'
  phone: { display: '', e164: '' }, // leave blank to keep the tracking number above (recommended)
  website: '',           // the renter's own site, optional
  googleBusinessProfileUrl: '', // the renter's own GBP (never create one for this site)
  yearsInBusiness: null, // only if verifiable
  address: null,         // { street, city, region: 'OR', postalCode } only if the renter wants it shown
  guarantee: '',         // only the renter's real written warranty terms
  // Real reviews only, copied with permission from the renter's GBP:
  // { author: 'Sarah M.', rating: 5, text: '...', source: 'Google', date: '2026-11-02' }
  reviews: [],
  rating: null,          // { value: 4.9, count: 57, source: 'Google' } only if real
};

/** Helpers used across the site */
export const isRented = () => RENTER.active && RENTER.businessName && RENTER.ccbNumber;

export const brandName = () => (isRented() ? RENTER.businessName : SITE.name);

export const activePhone = () => {
  if (isRented() && RENTER.phone?.e164) return RENTER.phone;
  return SITE.phone;
};

/** Call buttons always render. This only says whether the number is real yet. */
export const isPlaceholderPhone = () => !!activePhone().isPlaceholder;
export const telHref = () => `tel:${activePhone().e164}`;
export const smsHref = () => (SITE.texting ? `sms:${activePhone().e164}` : null);
