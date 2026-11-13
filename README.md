# QA-Intranet — automatización de pruebas de la Intranet de SEIDOR

Este repositorio contiene la **automatización de pruebas de la Intranet de SEIDOR** (Playwright + Cucumber + TypeScript). Es un proyecto ligero y aislado para ejecutar pruebas puntuales en local contra **dev**, **pre** y (más adelante) **pro**.

Pruebas actuales (`src/features/modules.feature`): desde la home se pulsa la tarjeta de cada módulo y se comprueba la URL, los elementos básicos, que los endpoints respondan 200 y que no haya errores de consola.

| ID | Módulo |
|---|---|
| TC-MOD-01 | Registro horario |
| TC-MOD-02 | Resumen registros |
| TC-MOD-03 | Imputación horas |
| TC-MOD-04 | Resumen imputaciones |
| TC-MOD-05 | Resumen gastos |
| TC-MOD-06 | Resumen pendientes |
| TC-MOD-07 | Resumen horas |
| TC-MOD-08 | Edición horas |
| TC-MOD-09 | Resumen gastos (albaranes) |
| TC-MOD-10 | Edición gastos |
| TC-MOD-11 | Home de la intranet (SAP) |
| TC-MOD-12 | Listado de viajes (SAP) |
| TC-MOD-13 | Documentos (SAP) |
| TC-MOD-14 | CMS (SharePoint) |
| TC-MOD-15 | Homologación de proveedores (SharePoint) |
| TC-MOD-16 | Documentos generales |
| TC-MOD-17 | Documentos mi área personal |
| TC-MOD-18 | Documentos mi área personal managers |
| TC-MOD-19 | Normativas pendientes de aceptar |
| TC-MOD-20 | Resumen proyectos |
| TC-MOD-21 | Resumen subproyectos |
| TC-MOD-22 | Resumen tareas |
| TC-MOD-23 | Histórico normativas |
| TC-MOD-24 | Permisos usuario |
| TC-MOD-25 | Roles y accesos |
| TC-MOD-26 | Roles y accesos multiusuario |
| TC-MOD-27 | Asignaciones categoría |
| TC-MOD-28 | Gestión documental |
| TC-MOD-29 | Gestión notificaciones |
| TC-MOD-30 | Notificaciones enviadas |
| TC-MOD-31 | Resumen de proyectos (GEP) |
| TC-MOD-32 | Categorías |

### Feature "Imputación horas" (`src/features/imputacion-horas.feature`)

22 casos (2 por subsección) tomados de la suite de Azure DevOps "Imputation hours" (ID 531), en el orden del documento. Ejecutar con `npm run test:dev -- --name "TC-IH"`. Los casos con `@datos-prueba` crean datos el 14/07/2026 y los limpian. Los pasos no automatizables se registran como aviso, no como verificados.

| ID | Sección | Caso |
|---|---|---|
| TC-IH-01 / 02 | Calendario | UI / Funcionalidad |
| TC-IH-03 / 04 | Agregar imputación | Funcionalidad / UI |
| TC-IH-05 / 06 | Editar imputación | Funcionalidad / UI |
| TC-IH-07 / 08 | Eliminar imputación | Funcionalidad / UI |
| TC-IH-09 / 10 | Agregar gasto | Funcionalidad / UI |
| TC-IH-11 / 12 | Página de detalle | UI / Funcionalidad |
| TC-IH-13 / 14 | Resumen | UI / Funcionalidad |
| TC-IH-15 / 16 | Copiar día | UI / Funcionalidad |
| TC-IH-17 / 18 | Eliminar día | UI / Funcionalidad |
| TC-IH-19 / 20 | Paginación | UI / Funcionalidad |
| TC-IH-21 / 22 | Ordenamiento | Funcionalidad / UI |

### Feature "Resumen imputaciones" (`src/features/resumen-imputaciones.feature`)

40 casos (TC-RI-01 a 40) de la suite de Azure DevOps "Imputations summary" (ID 532), con la nomenclatura `TC-RI-NN - <título>`. Ejecutar con `npm run test:dev -- --tags "@resumen-imputaciones"` (o `--name "TC-RI-01 "` para uno). Los casos `@vistas-prueba` crean y borran vistas propias `QA_RI_*`; los `@datos-prueba` usan el 14/07/2026 y lo limpian. Los desvíos respecto al documento (navegación, filtros inexistentes, textos de botones, datos) están documentados en la cabecera del feature; los pasos no automatizables se registran como aviso, no como verificados.

| ID | Sección | Caso |
|---|---|---|
| TC-RI-01 / 02 | Crear vista | UI / Funcionalidad |
| TC-RI-03 / 04 | Editar vista | Funcionalidad / UI |
| TC-RI-05 / 06 | Eliminar vista | Funcionalidad / UI |
| TC-RI-07 / 08 | Filtro de fecha personalizado | Funcionalidad / UI |
| TC-RI-09 / 10 | Filtro de fecha del mes actual | Funcionalidad / UI |
| TC-RI-11 / 12 | Filtro de fecha de la semana actual | Funcionalidad / UI |
| TC-RI-13 / 14 | Filtro por división del proyecto | Funcionalidad / UI |
| TC-RI-15 / 16 | Filtro por división del usuario | Funcionalidad / UI |
| TC-RI-17 / 18 | Filtro por país (no existe en la pantalla) | Funcionalidad / UI |
| TC-RI-19 / 20 | Filtro por centro de trabajo (no existe) | Funcionalidad / UI |
| TC-RI-21 / 22 | Filtro por código de subproyecto (no existe) | Funcionalidad / UI |
| TC-RI-23 / 24 | Filtro por creador (no existe) | Funcionalidad / UI |
| TC-RI-25 / 26 | Filtro por cliente (no existe) | Funcionalidad / UI |
| TC-RI-27 / 28 | Selección de campos | Funcionalidad / UI |
| TC-RI-29 / 30 | Editar imputación | Funcionalidad / UI |
| TC-RI-31 / 32 | Eliminar imputación | Funcionalidad / UI |
| TC-RI-33 / 34 | Ordenación | Funcionalidad / UI |
| TC-RI-35 / 36 | Exportar a Excel | UI / Funcionalidad |
| TC-RI-37 / 38 | Arrastrar y soltar columnas | Funcionalidad / UI |
| TC-RI-39 / 40 | Añadir imputación como completador | UI / Funcionalidad |

## Cómo ejecutar las pruebas (resumen)

```bash
git clone https://github.com/ArgTincho89/QA-Intranet.git
cd QA-Intranet
npm install                 # una vez (y tras cada cambio en package.json)
npm run auth:save:dev       # una vez por entorno: login manual en el Chrome que se abre
npm run test:dev            # ejecuta las pruebas contra DEV
npm run test:pre            # ... contra PRE (antes: npm run auth:save:pre)
npm run test:pro            # ... contra PRO (requiere BASE_URL en .env.pro y auth:save:pro)
```

Al terminar, la terminal muestra la ruta del reporte HTML (`reports/<fecha>/<entorno>/<alcance>/dashboard/index.html`).

## Requisitos
- Node.js 20+ y **Google Chrome instalado** (se usa el Chrome real, no el Chromium de Playwright).
- Windows (la limpieza de Chrome huérfanos está pensada para Windows; en otros SO el resto funciona igual).
- Acceso a la VPN / red corporativa si el entorno lo exige.
- `npm install`

## Uso

| Acción | Comando |
|---|---|
| Guardar sesión (una vez por entorno) | `npm run auth:save:dev` / `:pre` / `:pro` |
| Ejecutar todo | `npm run test:dev` / `test:pre` / `test:pro` |
| Solo `@smoke` | `npm run test:smoke:dev` (o `:pre`, `:pro`) |
| Por flag | `npm test -- --pre` (o `--dev`, `--pro`, `--env pre`) |
| Filtrar | `npm run test:dev -- --tags "@smoke"` · `npm run test:dev -- --name "TC-MOD-01"` |
| Modo del navegador | `npm run test:dev` (headed, por defecto) · `npm run test:dev -- --headless` · `npm run test:dev -- --headed` |
| Regenerar dashboard | `npm run report -- --env dev` |

Códigos de salida: `0` todo pasó · `1` hubo fallos · `2` no se pudo ejecutar (falta URL o sesión).

### Primera vez en un entorno
1. `npm run auth:save:dev` abre Chrome con ventana. Haz el login corporativo (usuario, contraseña, MFA). Al cargar la intranet se cierra solo y la sesión queda en `.auth/chrome-profile-dev/`.
2. `npm run test:dev`.

Repite `auth:save:<entorno>` cuando la sesión caduque o aparezca un desafío de Cloudflare / bucle de login. **El proyecto nunca rellena credenciales**: el login es siempre manual.

## Entornos
La URL de cada entorno está en `.env.dev`, `.env.pre`, `.env.pro` (`BASE_URL`, sin secretos). `.env.pro` está **vacío a propósito**: complétalo cuando se conozca la URL de producción; mientras tanto la ejecución se detiene. Orden de resolución: variable de shell → `.env.<entorno>` → `.env`.

## Reporte
Cada ejecución genera `reports/<fecha>/<entorno>/<alcance>/`:
- `dashboard/index.html` — pasos en Gherkin, captura y log del error del paso fallido.
- `evidence/<escenario>/` — `failure.png` y `trace.zip` (`npx playwright show-trace trace.zip`), solo si falla.

## Estructura
```
src/features/   escenarios Gherkin (*.feature)
src/steps/      step definitions
src/pages/      Page Objects
src/support/    config, navegador (Chrome persistente + stealth), sesión, hooks, esperas
src/scripts/    auth-save.ts
scripts/        run.mjs (entrada única), auth.mjs, build-dashboard.mjs, env.mjs
```
Añadir una prueba: nuevo `.feature` en `src/features/` + steps en `src/steps/` (+ Page Object si hace falta). Etiquetas: `@smoke` (humo), `@wip` (excluido de la ejecución).

## Comportamiento a tener en cuenta
- **403 Forbidden del edge** (`Microsoft-Azure-Application-Gateway/v2`): al abrir la home se detecta al instante, se cierra el navegador y se relanza, hasta 3 intentos.
- **Una ejecución por entorno a la vez** (comparten el perfil de Chrome); una segunda sale con código 2.
- **Errores de consola ignorados** (defecto conocido de la app): mensajes `... not supported, must be a valid ISO 4217 currency code`. Lista en `src/support/page-monitor.ts`.
- **Añadir un módulo**: entrada en `MODULES` de `src/pages/modules.page.ts` + escenario `TC-MOD-NN` en `modules.feature`.

## Notas sobre Cloudflare
Funciona porque se combinan: perfil de Chrome persistente por entorno, `playwright-extra` + stealth, `channel: 'chrome'` y navegador **con ventana**. Evita `--headless` (o `HEADLESS=1`): Cloudflare suele bloquearlo. Un aviso de Chrome sobre `--disable-blink-features` es inofensivo.
