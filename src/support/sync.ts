// Esperas ligadas a estado observable. Nada de sleeps fijos salvo el sondeo de Cloudflare.
import type { Page } from 'playwright';

// Títulos que Cloudflare usa en su pantalla intermedia.
const CLOUDFLARE_TITLES = ['just a moment', 'un momento', 'attention required', 'verificación de seguridad'];

// El texto del desafío varía entre variantes; lo único constante es el pie "Ray ID: ...".
async function isCloudflareChallenge(page: Page): Promise<boolean> {
  const title = (await page.title().catch(() => '')).toLowerCase();
  if (CLOUDFLARE_TITLES.some((needle) => title.includes(needle))) return true;
  const bodyText = await page.locator('body').innerText({ timeout: 2_000 }).catch(() => '');
  const normalized = bodyText.toLowerCase();
  return normalized.includes('ray id') && normalized.includes('cloudflare');
}

/** Espera a que el desafío de Cloudflare se resuelva solo (Chrome real con ventana, sin clics). */
export async function waitForCloudflareToClear(page: Page, timeout = 45_000): Promise<void> {
  if (!(await isCloudflareChallenge(page))) return;
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    await page.waitForTimeout(1_000);
    if (!(await isCloudflareChallenge(page))) return;
  }
  throw new Error(
    `El desafío de Cloudflare no se resolvió en ${timeout}ms. Es un bloqueo real: repite ` +
      `"npm run auth:save:<entorno>" para refrescar el perfil, o pide a IT una regla de allowlist.`
  );
}

/**
 * Pantalla de Microsoft "¿Confía en <dominio>?". Puede aparecer en cualquier navegación, incluso
 * a mitad de ejecución. No contiene credenciales: es un "reconozco esta cuenta". `#idSIButton9`
 * se reutiliza en otras pantallas de Microsoft, así que solo se pulsa si `#appConfirmTitle`
 * (único de esta pantalla) está presente.
 */
export async function clickThroughOrgTrustPromptIfPresent(page: Page): Promise<void> {
  const heading = page.locator('#appConfirmTitle');
  const isPresent = await heading.waitFor({ state: 'visible', timeout: 5_000 }).then(() => true).catch(() => false);
  if (!isPresent) return;
  await page.locator('#idSIButton9').click();
  await heading.waitFor({ state: 'hidden' }).catch(() => {});
}

/** Página en blanco con "403 Forbidden" que el edge sirve a veces en lugar de la app. */
export async function isForbiddenPage(page: Page): Promise<boolean> {
  try {
    const bodyText = (await page.locator('body').innerText({ timeout: 1_500 })).trim();
    return bodyText.length < 80 && bodyText.includes('403 Forbidden');
  } catch {
    return false;
  }
}

/** El edge respondió 403: no tiene sentido esperar, hay que cerrar el navegador y relanzar. */
export class ForbiddenError extends Error {
  constructor() {
    super('403 Forbidden (Microsoft-Azure-Application-Gateway/v2)');
    this.name = 'ForbiddenError';
  }
}
