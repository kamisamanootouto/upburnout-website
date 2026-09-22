import { expect, test, type Page } from '@playwright/test';
import { hero, abordare, participare, inscriere, contact } from '../../src/data/acasa';
import { site } from '../../src/data/site';
import { PRIVACY_ENABLED } from '../../src/data/confidentialitate';

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1280) < 768;

// Erorile de consolă și violările CSP sunt eșec de test: le colectăm pe fiecare pagină.
async function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (e) => {
      console.error(`CSP: ${e.violatedDirective} ← ${e.blockedURI}`);
    });
  });
  return errors;
}

test.describe('Acasă', () => {
  test('conținut, titluri și cele 8 ședințe; fără erori în consolă', async ({ page }) => {
    const errors = await collectErrors(page);
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
    await expect(page).toHaveTitle(site.titles.acasa);
    await expect(page.locator('h1')).toHaveText(hero.title);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByText(hero.subtitle)).toBeVisible();
    for (const s of abordare.sedinte) {
      const rest = s.title.replace(/^\d+\.\s/, '');
      await expect(page.getByRole('heading', { level: 3, name: rest })).toBeVisible();
    }
    for (const step of participare.steps) await expect(page.getByText(step)).toBeVisible();
    await expect(page.getByText(inscriere.lineItalic)).toBeVisible();
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('headere de securitate și SEO', async ({ page }) => {
    const res = await page.goto('/');
    const h = res!.headers();
    expect(h['content-security-policy']).toContain(
      "script-src 'self' https://challenges.cloudflare.com 'sha256-",
    );
    expect(h['content-security-policy']).not.toContain('unsafe-inline');
    expect(h['strict-transport-security']).toContain('max-age=31536000');
    expect(h['x-content-type-options']).toBe('nosniff');
    expect(h['x-frame-options']).toBe('DENY');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      hero.subtitle,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://www.upburnout.com/',
    );
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /og-image\.jpg$/,
    );
    await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
  });

  test('linkuri: ancore interne, QuestionPro în filă nouă, echipă', async ({ page }) => {
    await page.goto('/');
    const signup = page.locator('main').getByRole('link', { name: hero.cta }).first();
    await signup.click();
    await expect(page).toHaveURL(/#inscrie-te$/);
    await expect(page.locator('#inscrie-te')).toBeInViewport();

    await page.getByRole('link', { name: inscriere.ctaContact }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('#contact')).toBeInViewport();

    const qp = page.locator(`a[href="${site.links.questionpro}"]`);
    await expect(qp).toHaveAttribute('href', site.links.questionpro);
    await expect(qp).toHaveAttribute('target', '_blank');
    await expect(qp).toHaveAttribute('rel', /noopener/);

    await page.getByRole('link', { name: /Descoperă echipa proiectului/ }).click();
    await expect(page).toHaveURL(/\/echip%C4%83#echipa-de-cercetare$/);
    await expect(page.locator('#echipa-de-cercetare')).toBeInViewport();
  });

  test('formular: validare, apoi trimitere reușită cu Turnstile (chei de test)', async ({
    page,
  }) => {
    await page.goto('/#contact');
    const form = page.locator('#formular-contact');
    // scriptul formularului e gata când a completat câmpul ascuns `ts` (evită un click înaintea hidratării)
    await expect(form.locator('input[name="ts"]')).not.toHaveValue('');
    await form.getByRole('button', { name: contact.submit }).click();
    await expect(form.locator('#nume-eroare')).toHaveText(/obligatoriu/);
    await expect(form.locator('#email-eroare')).toHaveText(/obligatoriu/);
    await expect(form.locator('#nume')).toBeFocused();

    await form.locator('#nume').fill('Popescu');
    await form.locator('#prenume').fill('Ana');
    await form.locator('#email').fill('gresit');
    await form.locator('#telefon').fill('abc');
    await form.getByRole('button', { name: contact.submit }).click();
    await expect(form.locator('#email-eroare')).toHaveText(/nu este validă/);
    await expect(form.locator('#telefon-eroare')).toHaveText(/nepermise/);

    await form.locator('#email').fill('ana@exemplu.ro');
    await form.locator('#telefon').fill('0722 000 000');
    await form.locator('#mesaj').fill('Test automat');
    // widget-ul Turnstile (cheie de test) se încarcă lazy și trece singur
    await expect
      .poll(
        async () => page.evaluate(() => ((window as any).turnstile?.getResponse?.() ? 'ok' : 'nu')),
        {
          timeout: 20_000,
        },
      )
      .toBe('ok');
    // pragul anti-bot de 3 s de la randare
    await page.waitForTimeout(3200);
    await form.getByRole('button', { name: contact.submit }).click();
    await expect(form.locator('#form-status')).toHaveText(/Mulțumim/, { timeout: 15_000 });
    await expect(form.locator('#nume')).toHaveValue('');
  });

  test('meniul mobil (doar pe mobil): deschidere, Esc, click pe link', async ({ page }) => {
    test.skip(!isMobile(page), 'doar viewport mobil');
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Deschide meniul' });
    await expect(page.locator('#meniu-mobil')).toBeHidden();
    await toggle.click();
    await expect(page.locator('#meniu-mobil')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Închide meniul' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await page.keyboard.press('Escape');
    await expect(page.locator('#meniu-mobil')).toBeHidden();
    await toggle.click();
    await page.locator('#meniu-mobil').getByRole('link', { name: 'Echipă' }).click();
    await expect(page).toHaveURL(/echip%C4%83$/);
  });

  test('fără scroll orizontal', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe('Echipă', () => {
  test('cei 10 membri în ordine, H1 „Despre noi”, fără erori', async ({ page }) => {
    const errors = await collectErrors(page);
    await page.goto('/echipă');
    await expect(page).toHaveTitle(site.titles.echipa);
    await expect(page.locator('h1')).toHaveText('Despre noi');
    // Lista de mai jos e independentă de src/data (echipa.ts importă imagini, pe care Playwright nu le poate încărca)
    // și dublează verificarea față de content/pages/echipa.md.
    const names = [
      'Drd. Athena Gândilă',
      'Conf. Univ. Dr. Andrei Rusu',
      'Prof. Univ. Dr. Delia Vîrgă',
      'Conf. Univ. Dr. Bogdan Tulbure',
      'Prof. Univ. Dr. Ioana Podină',
      'Prof. Dr. Shannon Sauer-Zavala',
      'Gianina Buruczky',
      'Psih. Daniel Drăgulescu',
      'Psih. Gabriela Micu',
      'Psih. Vlad Coșa',
    ];
    const rendered = await page.locator('figcaption p:first-child').allTextContents();
    expect(rendered).toEqual(names);
    await expect(page.getByText('Asistent cercetare voluntar')).toBeVisible();
    // toate portretele s-au încărcat
    const broken = await page.evaluate(
      () => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
    );
    expect(broken).toBe(0);
    expect(errors, errors.join('\n')).toEqual([]);
  });
});

test.describe('Confidențialitate', () => {
  test('pagina există, e legată din footer și de sub formular', async ({ page }) => {
    test.skip(!PRIVACY_ENABLED, 'politica e dezactivată temporar (PRIVACY_ENABLED=false)');
    await page.goto('/');
    await expect(
      page.locator('footer').getByRole('link', { name: 'Politica de confidențialitate' }),
    ).toHaveAttribute('href', '/confidentialitate');
    await page
      .locator('#formular-contact')
      .getByRole('link', { name: 'Politica de confidențialitate' })
      .click();
    await expect(page).toHaveURL(/\/confidentialitate$/);
    await expect(page.locator('h1')).toHaveText('Politica de confidențialitate');
    await expect(page.getByText('gdpr@e-uvt.ro').first()).toBeVisible();
  });

  test('dezactivată: pagina dă 404 și nu există niciun link către ea', async ({
    page,
    request,
  }) => {
    test.skip(PRIVACY_ENABLED, 'politica e activă (PRIVACY_ENABLED=true)');
    const res = await request.get('/confidentialitate');
    expect(res.status()).toBe(404);
    await page.goto('/');
    await expect(page.locator('a[href="/confidentialitate"]')).toHaveCount(0);
    await expect(page.getByText('Politica de confidențialitate')).toHaveCount(0);
  });
});

test.describe('Rutare', () => {
  test('/echipa → 301 /echipă; slash final → /echipă; 404 în design; /acasa → /', async ({
    request,
    page,
  }) => {
    const r1 = await request.get('/echipa', { maxRedirects: 0 });
    expect(r1.status()).toBe(301);
    expect(r1.headers()['location']).toMatch(/\/echip%C4%83$/);
    const r2 = await request.get('/echip%C4%83/', { maxRedirects: 0 });
    expect([301, 307, 308]).toContain(r2.status());
    const r3 = await request.get('/acasa', { maxRedirects: 0 });
    expect(r3.status()).toBe(301);
    const res = await page.goto('/pagina-inexistenta');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Pagina nu a fost găsită' })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  });

  test('sitemap și robots', async ({ request }) => {
    const sm = await request.get('/sitemap-index.xml');
    expect(sm.status()).toBe(200);
    const s0 = await request.get('/sitemap-0.xml');
    const xml = await s0.text();
    expect(xml).toContain('https://www.upburnout.com/</loc>');
    expect(xml).toContain('https://www.upburnout.com/echip%C4%83</loc>');
    expect(xml).not.toContain('404');
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('Sitemap: https://www.upburnout.com/sitemap-index.xml');
  });
});

test.describe('Robustețe', () => {
  test('fără JavaScript: conținutul și navigarea rămân accesibile', async ({
    browser,
    baseURL,
  }) => {
    const ctx = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 800 },
    });
    const page = await ctx.newPage();
    await page.goto(baseURL + '/');
    await expect(page.locator('h1')).toHaveText(hero.title);
    await expect(page.locator('#meniu-mobil').getByRole('link', { name: 'Echipă' })).toBeVisible();
    await expect(page.locator('.menu-toggle')).toBeHidden();
    // <noscript> nu e randat ca DOM când Playwright doar dezactivează execuția scripturilor; verificăm în HTML
    expect(await page.content()).toContain('Pentru a trimite formularul, activează JavaScript.');
    await ctx.close();
  });

  test('prefers-reduced-motion: fără animații de intrare', async ({ browser, baseURL }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(baseURL + '/');
    const anim = await page.evaluate(
      () => getComputedStyle(document.querySelector('.reveal')!).animationName,
    );
    expect(anim).toBe('none');
    await ctx.close();
  });

  test('API-ul respinge cereri fără origine validă și GET', async ({ request }) => {
    const get = await request.get('/api/contact');
    expect(get.status()).toBe(405);
    const post = await request.post('/api/contact', {
      headers: { 'content-type': 'application/json', origin: 'https://evil.example' },
      data: {},
    });
    expect(post.status()).toBe(403);
  });
});
