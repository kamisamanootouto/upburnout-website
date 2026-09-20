import { describe, expect, it, vi } from 'vitest';
import {
  buildEmail,
  contactSchema,
  escapeHtml,
  handleContact,
  isAllowedOrigin,
  type ContactDeps,
  type ContactEnv,
} from './contact';

const ORIGIN = 'https://www.upburnout.com';
const NOW = 1_800_000_000_000;

const validFields = {
  nume: 'Popescu',
  prenume: 'Ana',
  email: 'Ana@Exemplu.ro',
  telefon: '+40 722 000 000',
  mesaj: 'Bună ziua,\nam o întrebare.',
  website: '',
  ts: String(NOW - 10_000),
  'cf-turnstile-response': 'token-ok',
};

function makeDeps(overrides: Partial<ContactDeps> = {}) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, init });
    if (url.includes('turnstile')) return new Response(JSON.stringify({ success: true }));
    if (url.includes('resend'))
      return new Response(JSON.stringify({ id: 'msg_1' }), { status: 200 });
    return new Response('nope', { status: 500 });
  });
  const deps: ContactDeps = {
    fetch: fetchMock as unknown as typeof fetch,
    now: () => NOW,
    log: () => {},
    ...overrides,
  };
  return { deps, calls, fetchMock };
}

const env: ContactEnv = {
  RESEND_API_KEY: 're_test',
  TURNSTILE_SECRET_KEY: 'secret',
  CONTACT_TO_EMAIL: 'dest@exemplu.ro',
  CONTACT_FROM_EMAIL: 'onboarding@resend.dev',
};

const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://www.upburnout.com/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: ORIGIN,
      'cf-connecting-ip': '1.2.3.4',
      ...headers,
    },
    body: JSON.stringify(body),
  });

describe('contactSchema', () => {
  it('acceptă date valide, normalizează e-mailul și taie spațiile', () => {
    const r = contactSchema.safeParse({ ...validFields, nume: '  Popescu ' });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.nume).toBe('Popescu');
      expect(r.data.email).toBe('ana@exemplu.ro');
      expect(r.data.mesaj).toContain('\n');
    }
  });
  it('respinge câmpurile obligatorii goale și e-mailul invalid, cu mesaje în română', () => {
    const r = contactSchema.safeParse({ nume: '', prenume: '', email: 'nu-e-email' });
    expect(r.success).toBe(false);
    if (!r.success) {
      const msgs = Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message]));
      expect(msgs.nume).toBe('Acest câmp este obligatoriu.');
      expect(msgs.email).toBe('Adresa de e-mail nu este validă.');
    }
  });
  it('respinge telefonul cu caractere nepermise și textele prea lungi; elimină caracterele de control', () => {
    expect(contactSchema.safeParse({ ...validFields, telefon: 'abc' }).success).toBe(false);
    expect(contactSchema.safeParse({ ...validFields, mesaj: 'x'.repeat(2001) }).success).toBe(
      false,
    );
    const r = contactSchema.safeParse({ ...validFields, nume: 'Pop\u0000escu\r\n' });
    expect(r.success && r.data.nume).toBe('Popescu');
  });
});

describe('isAllowedOrigin', () => {
  const mk = (origin?: string) =>
    new Request('https://x/api/contact', { method: 'POST', headers: origin ? { origin } : {} });
  it('acceptă domeniile site-ului și preview-urile *.workers.dev ale proiectului', () => {
    expect(isAllowedOrigin(mk('https://www.upburnout.com'), {})).toBe(true);
    expect(isAllowedOrigin(mk('https://upburnout.com'), {})).toBe(true);
    expect(isAllowedOrigin(mk('https://upburnout.bogdan.workers.dev'), {})).toBe(true);
    expect(isAllowedOrigin(mk('https://abc123-upburnout.bogdan.workers.dev'), {})).toBe(true);
  });
  it('respinge origini străine sau lipsă', () => {
    expect(isAllowedOrigin(mk('https://evil.example'), {})).toBe(false);
    expect(isAllowedOrigin(mk('https://altceva.workers.dev'), {})).toBe(false);
    expect(isAllowedOrigin(mk(), {})).toBe(false);
  });
});

describe('buildEmail', () => {
  it('escapează HTML-ul și păstrează textul brut în varianta text', () => {
    const data = contactSchema.parse({ ...validFields, mesaj: '<script>alert(1)</script>' });
    const { subject, text, html } = buildEmail(data, new Date(NOW));
    expect(subject).toBe('Mesaj nou de pe upburnout.com — Ana Popescu');
    expect(text).toContain('<script>alert(1)</script>');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
  it('escapeHtml acoperă toate caracterele speciale', () => {
    expect(escapeHtml(`<a href="x">&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;',
    );
  });
});

describe('handleContact', () => {
  it('trimite e-mailul și răspunde 200 pentru date valide', async () => {
    const { deps, calls } = makeDeps();
    const res = await handleContact(post(validFields), env, deps);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, text: expect.stringContaining('Mulțumim') });
    const resend = calls.find((c) => c.url.includes('resend'))!;
    const payload = JSON.parse(String(resend.init?.body));
    expect(payload.to).toEqual(['dest@exemplu.ro']);
    expect(payload.reply_to).toBe('ana@exemplu.ro');
    expect(
      String(resend.init?.headers && (resend.init.headers as Record<string, string>).authorization),
    ).toBe('Bearer re_test');
    const turnstile = calls.find((c) => c.url.includes('turnstile'))!;
    expect(String(turnstile.init?.body)).toContain('remoteip=1.2.3.4');
  });

  it('405 pentru GET, 403 pentru origine străină, 413 pentru corp prea mare, 400 pentru JSON invalid', async () => {
    const { deps } = makeDeps();
    const get = new Request('https://www.upburnout.com/api/contact', {
      headers: { origin: ORIGIN },
    });
    expect((await handleContact(get, env, deps)).status).toBe(405);
    expect(
      (await handleContact(post(validFields, { origin: 'https://evil.example' }), env, deps))
        .status,
    ).toBe(403);
    const big = post({ ...validFields, mesaj: 'x'.repeat(20_000) });
    expect((await handleContact(big, env, deps)).status).toBe(413);
    const bad = new Request('https://www.upburnout.com/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: ORIGIN },
      body: '{not json',
    });
    expect((await handleContact(bad, env, deps)).status).toBe(400);
  });

  it('400 cu erori pe câmp pentru date invalide, fără să apeleze Turnstile sau Resend', async () => {
    const { deps, calls } = makeDeps();
    const res = await handleContact(post({ ...validFields, email: 'gresit', nume: '' }), env, deps);
    expect(res.status).toBe(400);
    const body = (await res.json()) as { ok: boolean; errors: Record<string, string> };
    expect(body.errors.email).toBe('Adresa de e-mail nu este validă.');
    expect(body.errors.nume).toBe('Acest câmp este obligatoriu.');
    expect(calls).toHaveLength(0);
  });

  it('honeypot completat sau trimitere în sub 3 secunde → 200 fals, nimic trimis', async () => {
    const { deps, calls } = makeDeps();
    expect(
      (await handleContact(post({ ...validFields, website: 'spam.example' }), env, deps)).status,
    ).toBe(200);
    expect(
      (await handleContact(post({ ...validFields, ts: String(NOW - 500) }), env, deps)).status,
    ).toBe(200);
    expect(calls).toHaveLength(0);
  });

  it('403 când Turnstile eșuează sau tokenul lipsește', async () => {
    const { deps, calls } = makeDeps({
      fetch: (async (input: RequestInfo | URL) =>
        String(input).includes('turnstile')
          ? new Response(JSON.stringify({ success: false }))
          : new Response('{}')) as unknown as typeof fetch,
    });
    expect((await handleContact(post(validFields), env, deps)).status).toBe(403);
    expect(
      (await handleContact(post({ ...validFields, 'cf-turnstile-response': '' }), env, deps))
        .status,
    ).toBe(403);
    expect(calls).toHaveLength(0);
  });

  it('429 când rate limiter-ul refuză', async () => {
    const { deps } = makeDeps({ rateLimit: async () => ({ success: false }) });
    const res = await handleContact(post(validFields), env, deps);
    expect(res.status).toBe(429);
    expect(res.headers.get('retry-after')).toBe('60');
  });

  it('502 când Resend pică (după o reîncercare la eroare de rețea)', async () => {
    let resendCalls = 0;
    const { deps } = makeDeps({
      fetch: (async (input: RequestInfo | URL) => {
        if (String(input).includes('turnstile'))
          return new Response(JSON.stringify({ success: true }));
        resendCalls++;
        throw new Error('network');
      }) as unknown as typeof fetch,
    });
    const res = await handleContact(post(validFields), env, deps);
    expect(res.status).toBe(502);
    expect(resendCalls).toBe(2);
  });

  it('502 fără RESEND_API_KEY; MAIL_MODE=log răspunde 200 fără să trimită', async () => {
    const { deps, calls } = makeDeps();
    expect(
      (await handleContact(post(validFields), { ...env, RESEND_API_KEY: undefined }, deps)).status,
    ).toBe(502);
    const before = calls.length;
    expect(
      (await handleContact(post(validFields), { ...env, MAIL_MODE: 'log' }, deps)).status,
    ).toBe(200);
    expect(calls.slice(before).some((c) => c.url.includes('resend'))).toBe(false);
  });

  it('submit fără JavaScript (form-urlencoded) primește o pagină HTML', async () => {
    const { deps } = makeDeps();
    const req = new Request('https://www.upburnout.com/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded', origin: ORIGIN },
      body: new URLSearchParams(validFields).toString(),
    });
    const res = await handleContact(req, env, deps);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');
    expect(await res.text()).toContain('Mulțumim');
  });
});
