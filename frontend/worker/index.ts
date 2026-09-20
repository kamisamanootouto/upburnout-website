// Worker-ul site-ului: servește static assets (dist/) și răspunde la POST /api/contact.
// Configurație: wrangler.jsonc (assets.run_worker_first = ["/api/*"]). Specificație: docs/API_DESIGN.md.
import { handleContact, type ContactEnv } from './contact';

interface Env extends ContactEnv {
  ASSETS: Fetcher;
  CONTACT_RATE_LIMIT?: RateLimit;
}

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
    if (url.pathname.startsWith('/api/')) {
      return new Response('Not found', { status: 404, headers: { 'cache-control': 'no-store' } });
    }
    // Orice altceva (inclusiv 404-urile) vine din static assets, cu not_found_handling = 404-page.
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
