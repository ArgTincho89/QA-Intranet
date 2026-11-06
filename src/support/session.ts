// Sesión: captura MANUAL y reutilización. Este proyecto nunca rellena el formulario de login
// (Entra ID/MSAL + MFA): una persona ejecuta `npm run auth:save:<entorno>` y el perfil de
// Chrome queda autenticado en disco (cookies, cf_clearance y sessionStorage de MSAL).

import type { BrowserContext } from 'playwright';
import { hasMasterProfile, launchPersistentAuthenticatedContext } from './browser-factory';
import { testEnv, type ResolvedConfig } from './config';

export class StaleSessionError extends Error {
  constructor() {
    super(
      `No hay sesión autenticada para el entorno "${testEnv()}". Ejecuta "npm run auth:save:${testEnv()}" ` +
        `para abrir Chrome, hacer el login corporativo (incluido MFA) una vez, y vuelve a lanzar las pruebas.`
    );
    this.name = 'StaleSessionError';
  }
}

export async function getAuthenticatedContext(
  config: ResolvedConfig,
  viewport: { width: number; height: number }
): Promise<BrowserContext> {
  if (!hasMasterProfile()) throw new StaleSessionError();
  return launchPersistentAuthenticatedContext({ viewport, headless: config.headless });
}
