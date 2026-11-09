// Ciclo de vida:
//  - Chrome se abre UNA vez por ejecución (BeforeAll): relanzar el mismo perfil por escenario
//    pelea con los lock files de Chrome.
//  - UNA pestaña compartida: MSAL guarda sus tokens en sessionStorage (por pestaña); una pestaña
//    nueva por escenario fuerza SSO silencioso cada vez y Azure AD acaba limitándolo.
//  - Evidencia solo si falla: captura (incrustada en el dashboard) y trace.zip.
//  - Si el edge sirve "403 Forbidden", se relanza el navegador antes del siguiente reintento.

import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import type { ITestCaseHookParameter } from '@cucumber/cucumber';
import type { BrowserContext, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { CustomWorld } from './world';
import { getAuthenticatedContext } from './session';
import { reportDir, resolveConfig } from './config';
import { clickThroughOrgTrustPromptIfPresent, isForbiddenPage } from './sync';

// Presupuesto por paso (Cucumber) y espera por defecto de Playwright (debe caber dentro del primero).
setDefaultTimeout(Number(process.env.CUCUMBER_STEP_TIMEOUT_MS ?? 90_000));
const PLAYWRIGHT_DEFAULT_TIMEOUT_MS = 60_000;
const VIEWPORT = { width: 1920, height: 1080 };

let sharedContext: BrowserContext;
let sharedPage: Page | undefined;

async function resetSharedBrowser(): Promise<void> {
  await sharedPage?.close().catch(() => {});
  sharedPage = undefined;
  await sharedContext?.close().catch(() => {});
  sharedContext = await getAuthenticatedContext(resolveConfig(), VIEWPORT);
}

/** Cierra el navegador y abre uno nuevo, reasignando contexto y pestaña al world del escenario. */
export async function relaunchBrowser(world: CustomWorld): Promise<void> {
  world.monitor?.stop();
  await world.context?.tracing.stop().catch(() => {});
  await resetSharedBrowser();
  world.context = sharedContext;
  await world.context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  sharedPage = await world.context.newPage();
  sharedPage.setDefaultTimeout(PLAYWRIGHT_DEFAULT_TIMEOUT_MS);
  world.page = sharedPage;
}

BeforeAll(async function () {
  // Falla rápido, antes de abrir ningún navegador, si falta algo obligatorio o no hay sesión.
  sharedContext = await getAuthenticatedContext(resolveConfig(), VIEWPORT);
});

Before(async function (this: CustomWorld) {
  this.context = sharedContext;
  await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });

  if (!sharedPage || sharedPage.isClosed()) {
    sharedPage = await this.context.newPage();
    sharedPage.setDefaultTimeout(PLAYWRIGHT_DEFAULT_TIMEOUT_MS);
  }
  this.page = sharedPage;
  await clickThroughOrgTrustPromptIfPresent(this.page);
});

After(async function (this: CustomWorld, { pickle, result }: ITestCaseHookParameter) {
  const failed = result?.status === Status.FAILED;
  const evidenceDir = path.join(reportDir(), 'evidence', slug(pickle.name));
  this.monitor?.stop();

  if (failed && this.page) {
    fs.mkdirSync(evidenceDir, { recursive: true });
    try {
      const screenshot = await this.page.screenshot({ fullPage: true });
      fs.writeFileSync(path.join(evidenceDir, 'failure.png'), screenshot);
      this.attach(screenshot, 'image/png');
      this.attach(`URL al fallar: ${this.page.url()}`, 'text/plain');
    } catch {
      // La evidencia es best-effort: nunca debe enmascarar el fallo del escenario.
    }
  }

  await this.context?.tracing
    .stop({ path: failed ? path.join(evidenceDir, 'trace.zip') : undefined })
    .catch(() => {});

  if (failed && this.page && (await isForbiddenPage(this.page).catch(() => false))) {
    this.attach('Página en blanco con "403 Forbidden": se relanza el navegador antes del siguiente intento.', 'text/plain');
    await resetSharedBrowser();
  }
});

// Cerrar Chrome puede colgarse (pestañas externas, beforeunload...). Si el AfterAll falla o expira,
// Cucumber aborta antes de escribir el JSON y no se genera el dashboard: el cierre es best-effort y acotado.
async function closeWithin(label: string, close: (() => Promise<unknown>) | undefined, ms: number): Promise<void> {
  if (!close) return;
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<void>((resolve) => {
    timer = setTimeout(() => {
      console.warn(`[hooks] El cierre de ${label} superó ${ms / 1000}s: se continúa sin esperar.`);
      resolve();
    }, ms);
  });
  await Promise.race([close().catch(() => {}), timeout]);
  if (timer) clearTimeout(timer);
}

AfterAll(async function () {
  const page = sharedPage;
  const context = sharedContext;
  await closeWithin('la pestaña', page ? () => page.close({ runBeforeUnload: false }) : undefined, 10_000);
  await closeWithin('el navegador', context ? () => context.close() : undefined, 20_000);
});

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
}
