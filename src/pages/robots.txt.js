import { SITE } from '../config/site.js';
export function GET() {
  const body = `User-agent: *\nAllow: /\nDisallow: /thank-you/\nDisallow: /api/\n\nSitemap: ${SITE.url}/sitemap-index.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
