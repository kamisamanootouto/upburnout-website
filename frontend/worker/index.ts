// Worker-ul site-ului: servește static assets (dist/) și răspunde la POST /api/contact.
// Configurație: wrangler.jsonc (assets.run_worker_first = ["/api/*"]). Specificație: docs/API_DESIGN.md.
import { handleContact, type ContactEnv } from './contact';

interface Env extends ContactEnv {
  ASSETS: Fetcher;
  CONTACT_RATE_LIMIT?: RateLimit;
}

const PRODUCTION_HOSTS = new Set(['www.upburnout.com', 'upburnout.com']);

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') {
      return handleContact(request, env, {
        fetch: (input, init) => fetch(input, init),
        now: () => Date.now(),
        rateLimit: env.CONTACT_RATE_LIMIT
          ? (key) => env.CONTACT_RATE_LIMIT!.limit({ key })
          : undefined,
        log: (...args) => console.log('[contact]', ...args),
      });
    }
    // Diagnostic fără secrete: spune doar DACĂ sunt configurate, nu valorile.
    if (url.pathname === '/api/health') {
      return Response.json(
        {
          ok: true,
          resendKey: Boolean(env.RESEND_API_KEY),
          contactTo: Boolean(env.CONTACT_TO_EMAIL),
          contactFrom: env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev',
          turnstileSecret: env.TURNSTILE_SECRET_KEY ? 'set' : 'test-key',
          rateLimit: Boolean(env.CONTACT_RATE_LIMIT),
          mailMode: env.MAIL_MODE ?? 'send',
        },
        { headers: { 'cache-control': 'no-store' } },
      );
    }
    if (url.pathname.startsWith('/api/')) {
      return new Response('Not found', { status: 404, headers: { 'cache-control': 'no-store' } });
    }
    // Orice altceva (inclusiv 404-urile) vine din static assets, cu not_found_handling = 404-page.
    const response = await env.ASSETS.fetch(request);
    // Preview-urile (*.workers.dev, localhost) nu trebuie indexate în locul domeniului real.
    if (!PRODUCTION_HOSTS.has(url.hostname)) {
      const headers = new Headers(response.headers);
      headers.set('x-robots-tag', 'noindex');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }
    return response;
  },
} satisfies ExportedHandler<Env>;
