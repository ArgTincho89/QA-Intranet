import { When, Then } from '@cucumber/cucumber';
import * as assert from 'assert';
import { CustomWorld } from '../support/world';
import { PageMonitor } from '../support/page-monitor';
import { PLAYWRIGHT_DEFAULT_TIMEOUT_MS } from '../support/hooks';
import { ModulesPage, moduleSpec } from '../pages/modules.page';

/** En módulos externos (SAP, SharePoint) no podemos corregir sus errores: se reportan como WARNING y el paso no falla. */
function warnOnly(world: CustomWorld, what: string, problems: string[]): boolean {
  if (!world.currentModule?.external || problems.length === 0) return false;
  const msg = `⚠ WARNING (módulo externo, no bloquea) - ${what}:\n${problems.join('\n')}`;
  world.attach(msg, 'text/plain');
  console.warn(`\n${msg}\n`);
  return true;
}

When('hago clic en la tarjeta del módulo {string}', async function (this: CustomWorld, key: string) {
  // El monitor arranca justo antes del clic: solo cuenta lo que genera el módulo, no la home.
  this.monitor?.stop();
  this.currentModule = moduleSpec(key);
  this.monitor = new PageMonitor(this.page).start();
  const popup = await new ModulesPage(this.page).openFromHome(moduleSpec(key));
  if (popup) {
    // Una pestaña nueva (popup) no hereda el `setDefaultTimeout` de la pestaña compartida (Before,
    // hooks.ts): sin esto se queda en los 30 s por defecto de Playwright, insuficientes para el
    // redirect de login de algunos módulos externos (p. ej. SharePoint) bajo carga.
    popup.setDefaultTimeout(PLAYWRIGHT_DEFAULT_TIMEOUT_MS);
    this.page = popup;
    this.monitor.stop();
    this.monitor = new PageMonitor(popup).start();
  }
});

Then('navego a la URL del módulo {string}', async function (this: CustomWorld, key: string) {
  const spec = moduleSpec(key);
  await new ModulesPage(this.page).waitForPath(spec);
  const url = new URL(this.page.url());
  if (spec.external) {
    assert.ok(new ModulesPage(this.page).matchesPath(spec, url), `Esperado ${spec.external.host}${spec.external.pathPrefix}*, actual ${url.host}${url.pathname}`);
    return;
  }
  assert.strictEqual(url.origin, new URL(this.config.baseUrl).origin, 'El origen de la URL no coincide con el entorno');
  assert.ok([spec.path, `${spec.path}/`].includes(url.pathname), `Ruta esperada ${spec.path}, actual ${url.pathname}`);
});

Then('todos los endpoints del módulo responden 200', async function (this: CustomWorld) {
  assert.ok(this.monitor, 'El monitor no está activo: falta el paso de clic en la tarjeta');
  // Deja terminar las llamadas que el módulo lanza tras renderizar.
  await this.page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
  const problems = this.monitor.endpointProblems;
  this.attach(`Endpoints xhr/fetch observados: ${this.monitor.observedEndpoints}`, 'text/plain');
  if (warnOnly(this, 'Endpoints con respuesta distinta de 200', problems)) return;
  assert.deepStrictEqual(problems, [], `Endpoints con respuesta distinta de 200:\n${problems.join('\n')}`);
});

Then('no hay errores en la consola', async function (this: CustomWorld) {
  assert.ok(this.monitor, 'El monitor no está activo: falta el paso de clic en la tarjeta');
  const problems = this.monitor.consoleProblems;
  if (warnOnly(this, 'Errores de consola', problems)) return;
  assert.deepStrictEqual(problems, [], `Errores de consola:\n${problems.join('\n')}`);
});

Then('se renderizan los elementos básicos del módulo {string}', async function (this: CustomWorld, key: string) {
  const missing = await new ModulesPage(this.page).missingElements(moduleSpec(key));
  assert.deepStrictEqual(missing, [], `Elementos no encontrados:\n${missing.join('\n')}`);
});
