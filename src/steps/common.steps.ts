import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { HomePage } from '../pages/home.page';
import { isForbiddenPage, ForbiddenError } from '../support/sync';
import { relaunchBrowser } from '../support/hooks';

const MAX_FORBIDDEN_ATTEMPTS = 3;

// El edge (Azure Application Gateway) a veces responde "403 Forbidden" con la página en blanco.
// Es transitorio: se cierra el navegador y se reintenta el acceso, hasta 3 veces en total.
// Exportada para que otras features (p. ej. imputacion-horas) puedan reutilizar el mismo
// reintento con su propia redacción de paso, sin duplicar la lógica.
export async function irALaHomeConReintentos(world: CustomWorld): Promise<void> {
  for (let attempt = 1; attempt <= MAX_FORBIDDEN_ATTEMPTS; attempt++) {
    try {
      await new HomePage(world.page).goto(world.config.baseUrl);
      return;
    } catch (error) {
      const forbidden =
        error instanceof ForbiddenError || (await isForbiddenPage(world.page).catch(() => false));
      if (!forbidden) throw error;
    }

    world.attach(
      `403 Forbidden (Microsoft-Azure-Application-Gateway/v2) en el intento ${attempt}/${MAX_FORBIDDEN_ATTEMPTS}.`,
      'text/plain'
    );
    if (attempt === MAX_FORBIDDEN_ATTEMPTS) {
      throw new Error(`La intranet respondió "403 Forbidden" en ${MAX_FORBIDDEN_ATTEMPTS} intentos consecutivos.`);
    }
    await relaunchBrowser(world);
  }
}

Given('que accedo a la home de la intranet', async function (this: CustomWorld) {
  await irALaHomeConReintentos(this);
});
