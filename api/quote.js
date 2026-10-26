/**
 * Vercel serverless function: POST /api/quote
 * Receives the quote form and forwards the lead. No keys live in this repo.
 *
 * Set these in Vercel -> Project -> Settings -> Environment Variables:
 *   LEAD_TO_EMAIL     where leads go (e.g. you@mpstrategies.io; later the renter's inbox)
 *   RESEND_API_KEY    free Resend account (resend.com, 3,000 emails/mo free) -> emails the lead
 *   LEAD_FROM_EMAIL   optional, a verified sender, e.g. leads@willamettefallsroofing.com
 *                     (defaults to Resend's onboarding@resend.dev for testing)
 *   LEAD_WEBHOOK_URL  optional: also POST the lead as JSON to a webhook
 *                     (Google Apps Script -> Sheet, Zapier, Make, Slack incoming webhook...)
 * At least one of RESEND_API_KEY+LEAD_TO_EMAIL or LEAD_WEBHOOK_URL must be set,
 * otherwise the function answers 503 and the form shows an error.
 */

const MAX = 2000;
const clean = (v) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, MAX);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  const type = req.headers['content-type'] || '';
  if (type.includes('application/json')) { try { return JSON.parse(raw || '{}'); } catch { return {}; } }
  return Object.fromEntries(new URLSearchParams(raw));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'method_not_allowed' }); }
  const wantsJson = (req.headers.accept || '').includes('application/json');
  const body = await readBody(req);

  // Honeypot: bots fill hidden fields. Pretend success.
  if (clean(body.company_website)) return wantsJson ? res.status(200).json({ ok: true }) : res.redirect(303, '/thank-you/');

  const lead = {
    name: clean(body.name), phone: clean(body.phone), email: clean(body.email),
    city: clean(body.city), service: clean(body.service), timeline: clean(body.timeline),
    details: clean(body.details), estimate: clean(body.estimate), page: clean(body.page), source: clean(body.source),
    received_at: new Date().toISOString(),
  };
  if (!lead.name || !lead.phone || lead.phone.replace(/\D/g, '').length < 10) {
    return wantsJson ? res.status(400).json({ ok: false, error: 'name_and_phone_required' }) : res.redirect(303, '/get-a-quote/?error=1');
  }

  const { RESEND_API_KEY, LEAD_TO_EMAIL, LEAD_FROM_EMAIL, LEAD_WEBHOOK_URL } = process.env;
  const tasks = [];

  if (RESEND_API_KEY && LEAD_TO_EMAIL) {
    const rows = Object.entries(lead).filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:4px 10px;color:#555">${esc(k)}</td><td style="padding:4px 10px"><b>${esc(v)}</b></td></tr>`).join('');
    tasks.push(fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: LEAD_FROM_EMAIL || 'Roof leads <onboarding@resend.dev>',
        to: LEAD_TO_EMAIL.split(',').map((s) => s.trim()).filter(Boolean),
        reply_to: lead.email || undefined,
        subject: `New roof lead: ${lead.service || 'Roofing'} in ${lead.city || 'south metro'} (${lead.name})`,
        html: `<h2>New quote request</h2><table>${rows}</table>`,
        text: Object.entries(lead).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n'),
      }),
    }).then((r) => { if (!r.ok) throw new Error('resend_' + r.status); }));
  }
  if (LEAD_WEBHOOK_URL) {
    tasks.push(fetch(LEAD_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) })
      .then((r) => { if (!r.ok) throw new Error('webhook_' + r.status); }));
  }
  if (!tasks.length) {
    console.error('quote form: no delivery configured (set RESEND_API_KEY + LEAD_TO_EMAIL or LEAD_WEBHOOK_URL)');
    return wantsJson ? res.status(503).json({ ok: false, error: 'not_configured' }) : res.redirect(303, '/get-a-quote/?error=1');
  }
  const results = await Promise.allSettled(tasks);
  const delivered = results.some((r) => r.status === 'fulfilled');
  results.filter((r) => r.status === 'rejected').forEach((r) => console.error('quote form delivery failed:', r.reason?.message));
  if (!delivered) return wantsJson ? res.status(502).json({ ok: false, error: 'delivery_failed' }) : res.redirect(303, '/get-a-quote/?error=1');
  return wantsJson ? res.status(200).json({ ok: true }) : res.redirect(303, '/thank-you/');
}
