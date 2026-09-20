// Logica endpoint-ului POST /api/contact — pură (fără acces direct la env global), testabilă cu Vitest.
// Specificație: docs/API_DESIGN.md. Rulează în Cloudflare Workers (worker/index.ts).
import { z } from 'zod';

export interface ContactEnv {
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_BCC_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  ALLOWED_ORIGINS?: string;
  /** "log" = nu trimite e-mail, doar loghează (pentru preview-uri fără chei). Niciodată în producție. */
  MAIL_MODE?: string;
}

export interface ContactDeps {
  fetch: typeof fetch;
  now: () => number;
  /** rate limiter (Workers Rate Limiting binding); lipsă = fără limitare locală */
  rateLimit?: (key: string) => Promise<{ success: boolean }>;
  log: (...args: unknown[]) => void;
}

// Cheile de test Turnstile (trec întotdeauna) — folosite doar când nu sunt configurate chei reale.
export const TURNSTILE_TEST_SECRET = '1x0000000000000000000000000000000AA';

export const MAX_BODY_BYTES = 16 * 1024;
export const MIN_FILL_MS = 3000;

const MSG = {
  required: 'Acest câmp este obligatoriu.',
  email: 'Adresa de e-mail nu este validă.',
  phone: 'Numărul de telefon conține caractere nepermise.',
  tooLong: (n: number) => `Textul este prea lung (maximum ${n} caractere).`,
};

// Elimină caracterele de control (păstrează \n doar în mesaj) și normalizează NFC.
const clean = (keepNewlines: boolean) => (v: unknown) => {
  if (typeof v !== 'string') return v;
  const re = keepNewlines
    ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
    : /[\u0000-\u001F\u007F]/g;
  return v.normalize('NFC').replace(re, '').trim();
};

export const contactSchema = z.object({
  nume: z.preprocess(clean(false), z.string().min(1, MSG.required).max(100, MSG.tooLong(100))),
  prenume: z.preprocess(clean(false), z.string().min(1, MSG.required).max(100, MSG.tooLong(100))),
  email: z.preprocess(
    clean(false),
    z
      .string()
      .min(1, MSG.required)
      .max(254, MSG.email)
      .pipe(z.email(MSG.email))
      .transform((s) => s.toLowerCase()),
  ),
  telefon: z.preprocess(
    clean(false),
    z
      .string()
      .max(30, MSG.tooLong(30))
      .refine((s) => s === '' || /^[+\d\s().-]{3,30}$/.test(s), MSG.phone)
      .optional()
      .default(''),
  ),
  mesaj: z.preprocess(clean(true), z.string().max(2000, MSG.tooLong(2000)).optional().default('')),
});

export type ContactInput = z.infer<typeof contactSchema>;

const json = (status: number, body: unknown, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extra,
    },
  });

// Pagină HTML minimală pentru submit fără JavaScript (form-urlencoded).
const htmlPage = (status: number, title: string, text: string) =>
  new Response(
    `<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(title)}</title><style>body{font-family:system-ui,sans-serif;color:#14213d;max-width:36rem;margin:4rem auto;padding:0 1.25rem;line-height:1.6}a{color:#256670}</style></head><body><h1>${escapeHtml(title)}</h1><p>${escapeHtml(text)}</p><p><a href="/#contact">Înapoi la formular</a></p></body></html>`,
    {
      status,
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
    },
  );

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const DEFAULT_ORIGINS = ['https://www.upburnout.com', 'https://upburnout.com', '*.workers.dev'];

/** Verifică Origin (sau Referer) față de lista permisă; `*.workers.dev` acceptă preview-urile Cloudflare ale proiectului. */
export function isAllowedOrigin(request: Request, env: ContactEnv): boolean {
  const list = (
    env.ALLOWED_ORIGINS?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? DEFAULT_ORIGINS
  ).concat(
    // wrangler dev
    ['http://localhost:8787', 'http://127.0.0.1:8787'],
  );
  const raw = request.headers.get('origin') ?? request.headers.get('referer');
  if (!raw) return false;
  let origin: URL;
  try {
    origin = new URL(raw);
  } catch {
    return false;
  }
  const originStr = `${origin.protocol}//${origin.host}`;
  return list.some((allowed) => {
    if (allowed.startsWith('*.')) {
      const suffix = allowed.slice(1); // ".workers.dev"
      return (
        origin.protocol === 'https:' &&
        origin.hostname.endsWith(suffix) &&
        origin.hostname.includes('upburnout')
      );
    }
    return allowed === originStr;
  });
}

async function verifyTurnstile(
  token: string,
  ip: string | null,
  env: ContactEnv,
  deps: ContactDeps,
): Promise<boolean> {
  const secret = env.TURNSTILE_SECRET_KEY ?? TURNSTILE_TEST_SECRET;
  if (!env.TURNSTILE_SECRET_KEY)
    deps.log('warn: TURNSTILE_SECRET_KEY lipsă — se folosește cheia de test');
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const res = await deps.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    deps.log('turnstile error', err instanceof Error ? err.message : err);
    return false;
  }
}

export function buildEmail(data: ContactInput, sentAt: Date) {
  const when = new Intl.DateTimeFormat('ro-RO', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Bucharest',
  }).format(sentAt);
  const telefon = data.telefon || '—';
  const mesaj = data.mesaj || '—';
  const subject = `Mesaj nou de pe upburnout.com — ${data.prenume} ${data.nume}`;
  const text = [
    'Mesaj nou din formularul de contact upburnout.com',
    '',
    `Nume:      ${data.nume}`,
    `Prenume:   ${data.prenume}`,
    `Email:     ${data.email}`,
    `Telefon:   ${telefon}`,
    'Mesaj:',
    mesaj,
    '',
    `Trimis la: ${when}`,
  ].join('\n');
  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#4a5875;white-space:nowrap">${k}</td><td style="padding:6px 0">${escapeHtml(v)}</td></tr>`;
  const html = `<!doctype html><html lang="ro"><body style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#14213d;font-size:15px;line-height:1.5">
<p style="margin:0 0 12px"><strong>Mesaj nou din formularul de contact upburnout.com</strong></p>
<table style="border-collapse:collapse">${row('Nume', data.nume)}${row('Prenume', data.prenume)}${row('Email', data.email)}${row('Telefon', telefon)}</table>
<p style="margin:16px 0 4px;color:#4a5875">Mesaj:</p>
<p style="margin:0;white-space:pre-wrap">${escapeHtml(mesaj)}</p>
<p style="margin:20px 0 0;color:#5f6e8a;font-size:13px">Trimis la: ${escapeHtml(when)}</p>
</body></html>`;
  return { subject, text, html };
}

async function sendEmail(data: ContactInput, env: ContactEnv, deps: ContactDeps): Promise<boolean> {
  const to = env.CONTACT_TO_EMAIL;
  const from = env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev';
  const { subject, text, html } = buildEmail(data, new Date(deps.now()));
  if (env.MAIL_MODE === 'log') {
    deps.log('MAIL_MODE=log — e-mail netrimis', { to, subject });
    return true;
  }
  if (!env.RESEND_API_KEY || !to) {
    deps.log('delivery error: RESEND_API_KEY sau CONTACT_TO_EMAIL lipsesc');
    return false;
  }
  const payload: Record<string, unknown> = {
    from: `UP Burnout <${from}>`,
    to: [to],
    reply_to: data.email,
    subject,
    text,
    html,
  };
  if (env.CONTACT_BCC_EMAIL) payload.bcc = [env.CONTACT_BCC_EMAIL];

  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const res = await deps.fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${env.RESEND_API_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) return true;
      // Resend răspunde cu {message} (ex. sandbox: „You can only send testing emails to your own email address”)
      deps.log('resend error', res.status, (await res.text().catch(() => '')).slice(0, 300));
      if (res.status >= 400 && res.status < 500) return false; // nu reîncerca erori de client (cheie, validare)
    } catch (err) {
      clearTimeout(timer);
      deps.log('resend network error', err instanceof Error ? err.message : err);
    }
  }
  return false;
}

async function readBody(
  request: Request,
): Promise<{ fields: Record<string, string>; isForm: boolean } | 'too_large' | 'bad'> {
  const len = Number(request.headers.get('content-length') ?? 0);
  if (len > MAX_BODY_BYTES) return 'too_large';
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return 'too_large';
  const type = request.headers.get('content-type') ?? '';
  const fields: Record<string, string> = {};
  if (type.includes('application/json')) {
    try {
      const obj = JSON.parse(raw) as Record<string, unknown>;
      if (!obj || typeof obj !== 'object') return 'bad';
      for (const [k, v] of Object.entries(obj))
        if (typeof v === 'string' || typeof v === 'number') fields[k] = String(v);
      return { fields, isForm: false };
    } catch {
      return 'bad';
    }
  }
  if (type.includes('application/x-www-form-urlencoded')) {
    for (const [k, v] of new URLSearchParams(raw)) fields[k] = v;
    return { fields, isForm: true };
  }
  return 'bad';
}

export async function handleContact(
  request: Request,
  env: ContactEnv,
  deps: ContactDeps,
): Promise<Response> {
  if (request.method !== 'POST') {
    return json(405, { ok: false, error: 'method' }, { allow: 'POST' });
  }
  if (!isAllowedOrigin(request, env)) return json(403, { ok: false, error: 'origin' });

  const parsed = await readBody(request);
  if (parsed === 'too_large') return json(413, { ok: false, error: 'too_large' });
  if (parsed === 'bad') return json(400, { ok: false, error: 'bad_request' });
  const { fields, isForm } = parsed;
  const reply = (status: number, body: Record<string, unknown>, extra?: Record<string, string>) =>
    isForm
      ? htmlPage(
          status,
          body.ok ? 'Mesaj trimis' : 'Mesajul nu a fost trimis',
          String(body.text ?? ''),
        )
      : json(status, body, extra);

  const ip = request.headers.get('cf-connecting-ip');
  if (deps.rateLimit && ip) {
    const { success } = await deps.rateLimit(ip);
    if (!success) {
      return reply(
        429,
        {
          ok: false,
          error: 'rate_limited',
          retryAfter: 60,
          text: 'Ai trimis prea multe mesaje într-un timp scurt. Te rugăm să încerci din nou peste câteva minute.',
        },
        { 'retry-after': '60' },
      );
    }
  }

  // Boți: honeypot completat sau formular trimis în sub 3 secunde → „succes” fals, nimic trimis.
  const ts = Number(fields.ts ?? 0);
  if ((fields.website ?? '') !== '' || (ts > 0 && deps.now() - ts < MIN_FILL_MS)) {
    deps.log('bot suspect ignorat');
    return reply(200, {
      ok: true,
      text: 'Mulțumim! Mesajul tău a fost trimis. Îți răspundem cât de curând.',
    });
  }

  const result = contactSchema.safeParse(fields);
  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!errors[key]) errors[key] = issue.message;
    }
    return reply(400, {
      ok: false,
      errors,
      text: 'Verifică datele introduse: ' + Object.values(errors).join(' '),
    });
  }

  const token = fields['cf-turnstile-response'] ?? '';
  if (!token || !(await verifyTurnstile(token, ip, env, deps))) {
    return reply(403, {
      ok: false,
      error: 'turnstile',
      text: 'Verificarea anti-spam nu a reușit. Reîncarcă pagina și încearcă din nou.',
    });
  }

  const sent = await sendEmail(result.data, env, deps);
  if (!sent)
    return reply(502, {
      ok: false,
      error: 'delivery',
      text: 'Mesajul nu a putut fi trimis. Te rugăm să încerci din nou.',
    });
  return reply(200, {
    ok: true,
    text: 'Mulțumim! Mesajul tău a fost trimis. Îți răspundem cât de curând.',
  });
}
