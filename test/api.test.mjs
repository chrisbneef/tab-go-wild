import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/quote.js';

function mockRes() {
  const r = { statusCode: 200, headers: {}, body: null, redirected: null };
  r.status = (c) => { r.statusCode = c; return r; };
  r.json = (b) => { r.body = b; return r; };
  r.setHeader = (k, v) => { r.headers[k] = v; };
  r.redirect = (c, u) => { r.statusCode = c; r.redirected = u; return r; };
  return r;
}
const req = (body, accept = 'application/json') => ({ method: 'POST', headers: { accept, 'content-type': 'application/json' }, body });
const lead = { name: 'Test Person', phone: '503-555-0100', city: 'West Linn', service: 'Roof Repair' };

test('rejects GET', async () => { const r = mockRes(); await handler({ method: 'GET', headers: {} }, r); assert.equal(r.statusCode, 405); });

test('503 when no delivery configured', async () => {
  delete process.env.RESEND_API_KEY; delete process.env.LEAD_WEBHOOK_URL; delete process.env.LEAD_TO_EMAIL;
  const r = mockRes(); await handler(req(lead), r); assert.equal(r.statusCode, 503);
});

test('validates phone', async () => { const r = mockRes(); await handler(req({ ...lead, phone: '12' }), r); assert.equal(r.statusCode, 400); });

test('honeypot pretends success and sends nothing', async () => {
  let called = false; globalThis.fetch = async () => { called = true; return { ok: true }; };
  process.env.LEAD_WEBHOOK_URL = 'https://example.test/hook';
  const r = mockRes(); await handler(req({ ...lead, company_website: 'spam.biz' }), r);
  assert.equal(r.statusCode, 200); assert.equal(called, false);
});

test('webhook + Resend delivery', async () => {
  const calls = []; globalThis.fetch = async (url, opts) => { calls.push({ url, body: JSON.parse(opts.body) }); return { ok: true, status: 200 }; };
  process.env.LEAD_WEBHOOK_URL = 'https://example.test/hook'; process.env.RESEND_API_KEY = 'test'; process.env.LEAD_TO_EMAIL = 'a@b.test';
  const r = mockRes(); await handler(req(lead), r);
  assert.equal(r.statusCode, 200);
  assert.equal(calls.length, 2);
  assert.ok(calls.some((c) => c.url === 'https://api.resend.com/emails' && c.body.subject.includes('West Linn')));
});

test('no-JS form post redirects to thank-you', async () => {
  globalThis.fetch = async () => ({ ok: true, status: 200 });
  const r = mockRes(); await handler(req(lead, 'text/html'), r);
  assert.equal(r.statusCode, 303); assert.equal(r.redirected, '/thank-you/');
});
