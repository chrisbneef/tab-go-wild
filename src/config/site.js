/**
 * ============================================================
 *  THE ONE FILE THAT CONTROLS THE BRAND, PHONE AND RENTER.
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

export const SITE = {
  // Brand (rename here; also update the domain in vercel + Search Console)
  name: 'Willamette Falls Roofing',
  shortName: 'WF Roofing',
  tagline: 'Roof help for Portland\'s south metro',
  url: 'https://www.willamettefallsroofing.com',
  domain: 'willamettefallsroofing.com',
  email: 'hello@willamettefallsroofing.com', // set up forwarding once the domain is bought

  // PLACEHOLDER phone. Replace with the call-tracking number (see docs/README.md).
  // While this placeholder is set, the site shows "Request a callback" instead of tap-to-call.
  phone: {
    display: '(503) 555-0123',
    e164: '+15035550123',
    isPlaceholder: true,
  },

  // Where the quote form posts. Default is the built-in Vercel function (api/quote.js).
  // To use Formspree instead, paste your form URL, e.g. 'https://formspree.io/f/xxxxxxx'.
  formEndpoint: '/api/quote',

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

export const canCall = () => !activePhone().isPlaceholder;
