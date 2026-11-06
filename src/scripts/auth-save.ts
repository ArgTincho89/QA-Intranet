// `npm run auth:save:<entorno>` — abre el perfil MAESTRO en Chrome real y visible hacia BASE_URL y
// espera a que una persona complete el login corporativo. Al cerrar el contexto, el perfil queda
// autenticado en disco. Repetir cuando aparezca un desafío de Cloudflare o un bucle de login.

import { launchPersistentAuthenticatedContext, masterProfileDir } from '../support/browser-factory';
import { resolveConfig } from '../support/config';
import { HomePage } from '../pages/home.page';

async function main(): Promise<void> {
  const config = resolveConfig();
  console.log(`[auth-save] Entorno: ${config.env.toUpperCase()}  |  Perfil: ${masterProfileDir()}`);
  console.log(`[auth-save] Abriendo ${config.baseUrl} en Chrome. Completa el login (usuario, contraseña, MFA).`);
  console.log('[auth-save] Espero hasta 5 minutos a que cargue la intranet...');

  const context = await launchPersistentAuthenticatedContext({ ephemeral: false, slowMo: 50 });
  const page = context.pages()[0] ?? (await context.newPage());

  try {
    await page.goto(config.baseUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await new HomePage(page).waitUntilLoaded(5 * 60 * 1000);
    console.log('[auth-save] Login completado: el perfil queda autenticado para próximas ejecuciones.');
  } finally {
    await context.close();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('[auth-save] Falló:', (error as Error).message);
    process.exit(1);
  });
