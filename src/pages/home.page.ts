import type { Page } from 'playwright';
import { clickThroughOrgTrustPromptIfPresent, waitForCloudflareToClear, isForbiddenPage, ForbiddenError } from '../support/sync';

const LOGIN_REDIRECT_MAX_ATTEMPTS = 3;
const LOGIN_REDIRECT_RETRY_WAIT_MS = 25_000;

export class HomePage {
  constructor(private readonly page: Page) {}

  /**
   * Navega a la URL base y espera a estar realmente dentro de la intranet. Si cae en
   * login.microsoftonline.com puede ser throttling transitorio de Azure AD (se espera y se
   * reintenta); si persiste, la sesión caducó de verdad y hay que repetir `auth:save`.
   * Nunca rellena credenciales.
   */
  async goto(baseUrl: string): Promise<void> {
    const expectedHost = new URL(baseUrl).host;

    for (let attempt = 1; attempt <= LOGIN_REDIRECT_MAX_ATTEMPTS; attempt++) {
      const response = await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      if (response?.status() === 403 || (await isForbiddenPage(this.page))) throw new ForbiddenError();
      await waitForCloudflareToClear(this.page);
      // Si ya estamos en el host de la app no hace falta esperar 5 s a una pantalla que vive en Microsoft;
      // si aparece más tarde por una redirección, waitUntilLoaded la atiende.
      await clickThroughOrgTrustPromptIfPresent(this.page, this.page.url().includes(expectedHost) ? 300 : 5_000);
      if (await isForbiddenPage(this.page)) throw new ForbiddenError();

      if (this.page.url().includes(expectedHost)) {
        await this.waitUntilLoaded();
        return;
      }

      if (attempt === LOGIN_REDIRECT_MAX_ATTEMPTS) {
        throw new Error(
          `Se esperaba llegar a "${expectedHost}" tras ${LOGIN_REDIRECT_MAX_ATTEMPTS} intentos, pero la URL ` +
            `sigue siendo "${this.page.url()}". Si es login.microsoftonline.com la sesión caducó: ` +
            `ejecuta "npm run auth:save:<entorno>".`
        );
      }
      await this.page.waitForTimeout(LOGIN_REDIRECT_RETRY_WAIT_MS);
    }
  }

  /** La SPA está montada y con contenido real. Sondea cada 500 ms y aborta en cuanto ve un 403. */
  async waitUntilLoaded(timeout = 60_000): Promise<void> {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await isForbiddenPage(this.page)) throw new ForbiddenError();
      if (await this.page.locator('#appConfirmTitle').isVisible().catch(() => false)) {
        await clickThroughOrgTrustPromptIfPresent(this.page, 1_000);
      }
      const ready = await this.page
        .evaluate(() => {
          const root = document.querySelector('app-root');
          return !!root && (root as HTMLElement).innerText.trim().length > 50;
        })
        .catch(() => false);
      if (ready) return;
      await this.page.waitForTimeout(500);
    }
    throw new Error(`La SPA no cargó contenido en ${timeout}ms (URL: ${this.page.url()}).`);
  }

  get path(): string {
    return new URL(this.page.url()).pathname;
  }
}
