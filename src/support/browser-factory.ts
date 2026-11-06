// Lanzador de Chrome real con perfil persistente + stealth.
//
// Por qué: esta intranet está detrás de Cloudflare (Managed Challenge/Turnstile). Un
// chromium.launch() + storageState sigue recibiendo el desafío, porque cf_clearance queda
// ligada al navegador/perfil que la obtuvo. Lo que funciona, y hay que mantener junto:
//   - perfil real en disco reutilizado con launchPersistentContext
//   - playwright-extra + puppeteer-extra-plugin-stealth
//   - channel: 'chrome' (Google Chrome instalado, no el Chromium de Playwright)
//   - con ventana (headless: false): Turnstile no resuelve en headless
// Un aviso de Chrome sobre "--disable-blink-features" es inofensivo.
//
// Un perfil por entorno (.auth/chrome-profile-<env>): las sesiones de dev/pre/pro no se pisan.

import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';
import type { BrowserContext } from 'playwright';
import { chromium as chromiumStealth } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { testEnv } from './config';

let stealthRegistered = false;
function registerStealth(): void {
  if (stealthRegistered) return;
  chromiumStealth.use(StealthPlugin());
  stealthRegistered = true;
}

const AUTH_ROOT = path.resolve(__dirname, '..', '..', '.auth');

export function masterProfileDir(): string {
  const dir = path.join(AUTH_ROOT, `chrome-profile-${testEnv()}`);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function hasMasterProfile(): boolean {
  const dir = path.join(AUTH_ROOT, `chrome-profile-${testEnv()}`);
  return fs.existsSync(dir) && fs.readdirSync(dir).length > 0;
}

/**
 * Copia de trabajo del perfil maestro para esta ejecución: el maestro nunca debe abrirse
 * por dos Chrome a la vez (ficheros Singleton y lockfile). Esos ficheros no se copian.
 */
/** Cierra Chrome huérfanos de ejecuciones anteriores que sigan usando la copia de trabajo (solo Windows). */
function killStaleRunChrome(runDir: string): void {
  if (process.platform !== 'win32') return;
  const escaped = runDir.replace(/'/g, "''");
  const script =
    `Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | ` +
    `Where-Object { $_.CommandLine -like '*${escaped}*' } | ` +
    `ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`;
  spawnSync('powershell', ['-NoProfile', '-Command', script], { stdio: 'ignore' });
}

function prepareRunProfile(): string {
  const master = masterProfileDir();
  const runDir = `${master}.run`;
  killStaleRunChrome(runDir);
  fs.rmSync(runDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 });
  fs.cpSync(master, runDir, {
    recursive: true,
    force: true,
    filter: (src) => !/[/\\](Singleton\w*|lockfile|\.org\.chromium\.\w+)$/.test(src),
  });
  return runDir;
}

export interface PersistentLaunchOptions {
  headless?: boolean;
  slowMo?: number;
  viewport?: { width: number; height: number };
  /** `false` abre el perfil MAESTRO (solo para `auth:save`, que persiste la sesión). */
  ephemeral?: boolean;
}

export async function launchPersistentAuthenticatedContext(
  options: PersistentLaunchOptions = {}
): Promise<BrowserContext> {
  registerStealth();
  const dir = options.ephemeral === false ? masterProfileDir() : prepareRunProfile();

  return chromiumStealth.launchPersistentContext(dir, {
    headless: options.headless ?? false,
    channel: 'chrome',
    slowMo: options.slowMo,
    viewport: options.viewport ?? { width: 1920, height: 1080 },
    locale: 'es-ES',
    timezoneId: 'Europe/Madrid',
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-default-browser-check',
    ],
  }) as unknown as Promise<BrowserContext>;
}
