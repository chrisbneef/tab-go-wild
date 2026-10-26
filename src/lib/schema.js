import { SITE, RENTER, isRented, brandName, activePhone, isPlaceholderPhone } from '../config/site.js';
import { CITIES } from '../data/cities.js';

export const abs = (path = '/') => new URL(path, SITE.url).toString();

export const areaServed = () =>
  CITIES.map((c) => ({
    '@type': 'City',
    name: c.name,
    containedInPlace: { '@type': 'AdministrativeArea', name: 'Clackamas County, Oregon' },
    sameAs: c.wikipedia,
  }));

/** The site-wide entity. Honest by default: an Organization with no address.
 *  When rented, it becomes a RoofingContractor naming the licensed renter. */
export function orgSchema() {
  const phone = activePhone();
  const sameAs = Object.values(SITE.social).filter(Boolean);
  if (isRented()) {
    const o = {
      '@type': 'RoofingContractor',
      '@id': abs('/#org'),
      name: RENTER.businessName,
      url: SITE.url,
      areaServed: areaServed(),
      identifier: { '@type': 'PropertyValue', propertyID: 'Oregon CCB license', value: RENTER.ccbNumber },
      ...(!isPlaceholderPhone() ? { telephone: phone.e164 } : {}),
      ...(RENTER.googleBusinessProfileUrl || RENTER.website
        ? { sameAs: [RENTER.googleBusinessProfileUrl, RENTER.website, ...sameAs].filter(Boolean) }
        : sameAs.length ? { sameAs } : {}),
    };
    if (RENTER.address) {
      o.address = { '@type': 'PostalAddress', streetAddress: RENTER.address.street, addressLocality: RENTER.address.city, addressRegion: RENTER.address.region || 'OR', postalCode: RENTER.address.postalCode, addressCountry: 'US' };
    }
    if (RENTER.rating && RENTER.rating.value && RENTER.rating.count) {
      // Only valid if these are first-party reviews collected on this site; see docs/README.md.
      o.aggregateRating = { '@type': 'AggregateRating', ratingValue: RENTER.rating.value, reviewCount: RENTER.rating.count };
    }
    return o;
  }
  return {
    '@type': 'Organization',
    '@id': abs('/#org'),
    name: SITE.name,
    url: SITE.url,
    logo: abs('/icon-512.png'),
    description: 'A local roofing resource for Lake Oswego, West Linn, Oregon City, Gladstone and Milwaukie, Oregon. Free guides and cost information, and a request service that connects homeowners with a CCB-licensed local roofer. Not a roofing contractor.',
    areaServed: areaServed(),
    knowsAbout: ['Roof replacement', 'Roof repair', 'Roof moss removal', 'Gutters', 'Skylights', 'Oregon roofing permits', 'Oregon CCB licensing'],
    ...(!isPlaceholderPhone() ? { telephone: phone.e164 } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return { '@type': 'WebSite', '@id': abs('/#website'), name: brandName(), url: SITE.url, publisher: { '@id': abs('/#org') }, inLanguage: 'en-US' };
}

export function breadcrumbSchema(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.url) })),
  };
}

export function serviceSchema({ name, description, url, cityName }) {
  return {
    '@type': 'Service',
    '@id': abs(url) + '#service',
    name,
    serviceType: name,
    description,
    url: abs(url),
    provider: { '@id': abs('/#org') },
    areaServed: cityName
      ? { '@type': 'City', name: cityName, containedInPlace: { '@type': 'State', name: 'Oregon' } }
      : areaServed(),
  };
}

export function faqSchema(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') } })),
  };
}

export function articleSchema({ headline, description, url, dateModified }) {
  return {
    '@type': 'Article',
    headline, description, url: abs(url),
    dateModified: dateModified || SITE.updated,
    datePublished: SITE.updated,
    author: { '@id': abs('/#org') },
    publisher: { '@id': abs('/#org') },
    mainEntityOfPage: abs(url),
  };
}

export function graph(nodes) {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) };
}
