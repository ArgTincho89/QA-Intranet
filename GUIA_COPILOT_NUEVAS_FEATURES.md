# Guía para automatizar una nueva feature (léeme antes de escribir una sola línea)

Este documento existe porque la primera vez que se automatizó "Imputación horas" en este
repositorio (con Copilot, sin esta guía), el resultado alucinó datos, parafraseó los pasos del
test plan a su manera, fusionó/saltó pasos y usó una nomenclatura inventada. Nada de eso estaba
mal escrito — simplemente **no era lo que el test plan decía**. Hubo que rehacer la feature entera
para que cada escenario reprodujera, en el mismo orden, lo que la QA había escrito.

**Regla de oro: tu trabajo es traducir el test plan a Gherkin + Playwright, no reinterpretarlo.**
Si un paso del documento dice "Verificar el campo Categoría", el escenario tiene un paso que
verifica el campo Categoría — ni se combina con el paso de al lado, ni se le cambia el nombre,
ni se sustituye por otra cosa que "se parece". Cuando de verdad haga falta desviarse (y a veces
hace falta: la UI real no coincide al 100% con el documento), el desvío se **documenta
explícitamente**, nunca se hace en silencio.

Usa `src/features/imputacion-horas.feature`, `src/steps/imputacion-horas.steps.ts` y
`src/pages/imputacion-horas.page.ts` como referencia viva de todo lo que se explica aquí: son el
resultado de aplicar esta guía, no un ejemplo aparte.

---

## 0. Qué vas a recibir y qué tienes que devolver

Vas a recibir el **nombre de la feature** y el **listado de test cases** tal como los exportó la
QA (una tabla por caso, con columnas Paso / Acción / Resultado esperado). Tu entregable es:

1. `src/features/<nombre-feature>.feature` — un escenario por test case, fiel al documento.
2. `src/steps/<nombre-feature>.steps.ts` — las step definitions que lo implementan de verdad
   contra la intranet real (nunca steps que solo hacen `return 'pending'` o que no comprueban nada).
3. `src/pages/<nombre-feature>.page.ts` — el Page Object, si la feature lo necesita (reutiliza uno
   existente si la pantalla ya tiene uno, p. ej. si el nuevo caso vive dentro de una pantalla que
   ya automatizó otra feature).
4. Una entrada en `README.md` con la tabla de IDs, igual que las de `TC-MOD-*` / `TC-IH-*`.
5. Un resumen final que diga, caso por caso: **pasa**, **pasa con desvíos documentados** (cuáles y
   por qué), o **no automatizable** (qué parte y por qué, con evidencia técnica, no una excusa).

No se da una feature por terminada por el hecho de que compile o de que el `--dry-run` no se
queje. Se da por terminada cuando corrió **de verdad contra el entorno dev** y pasó (ver §6).

---

## 1. Nomenclatura

Sigue el patrón ya usado en este repo: `TC-<PREFIJO>-NN <Sección> - <Subsección>`.

- `TC-MOD-NN` → `modules.feature` (recorrido de los 32 módulos).
- `TC-IH-NN` → `imputacion-horas.feature`.
- Para una feature nueva, deriva un prefijo corto (2–4 letras) del nombre en español de la
  pantalla/módulo (p. ej. "Resumen imputaciones" → `TC-RI`). Si el documento de la QA ya trae sus
  propios IDs (`TC-IH-01`, etc.), **reutilízalos tal cual**, no inventes otros.
- Si el documento no trae ID pero sí un título de caso (p. ej. "Resumen - UI"), el nombre del
  escenario es `TC-<PREFIJO>-NN <Título del caso tal cual lo escribió la QA>`.
- Si tienes dudas razonables sobre el prefijo o la numeración, pregunta antes de inventar uno.

---

## 2. El principio de fidelidad 1:1

Cada test case es una tabla de filas `Paso | Acción | Resultado esperado`. La traducción a Gherkin
es mecánica, no creativa:

- **Acción → `Dado`/`Cuando`/`Y`** (según si es la primera acción del escenario, una verificación
  nueva, o continúa la anterior).
- **Resultado esperado → `Entonces`/`Y`**, en el mismo paso, inmediatamente después de su acción.
- Si el "Resultado esperado" es `—` (sin resultado), esa fila **no lleva `Entonces`** — es
  navegación/preparación, no verificación.
- Los pasos se respetan **en el orden del documento**. No se reordenan para que el código quede
  más prolijo, no se agrupan dos filas en una, no se elimina una fila porque "ya se comprueba
  implícitamente" en otra.
- El texto Gherkin debe leerse parecido al texto original (traducido/normalizado, no
  reformulado). Compara en `imputacion-horas.feature`:

  ```gherkin
  Cuando verifico la interfaz de un día incompleto (sin imputaciones)
  Entonces el día incompleto debe mostrarse en color amarillo
  ```

  contra la fila original del documento ("Verificar la interfaz de un día incompleto... / El día
  incompleto debe mostrarse en color amarillo"). Es casi literal. Eso es lo que se espera.

- **Nunca inventes datos de ejemplo que el documento no pide.** Si una fila dice "Seleccionar uno
  de los proyectos de la lista", no decidas por tu cuenta un proyecto cualquiera sin verificar
  antes qué datos de prueba existen de verdad en el entorno (ver §4). El caso real de
  `TC-IH-03` necesitó un proyecto con subproyecto y tarea para poder automatizar esos pasos tal
  como pedía el documento; usar un proyecto cualquiera sin subproyecto habría obligado a saltarse
  esos pasos (como hizo Copilot la primera vez).

---

## 3. Estructura de archivos (sigue el patrón exacto de `imputacion-horas.*`)

### 3.1 Feature file

- Cabecera con comentarios: fuente del test plan, convención de traducción Acción/Resultado,
  datos de prueba usados (fechas/registros fijos de referencia) y la lista de desvíos
  documentados respecto al texto original (ver §5). Copia el formato de las primeras 24 líneas de
  `imputacion-horas.feature`.
- `@<nombre-feature>` como tag de la Característica completa (permite ejecutar solo esa feature
  con `--tags`).
- **Sin `Antecedentes` compartido** si distintos test cases navegan por caminos distintos (p. ej.
  uno entra por el módulo, otro por un link dentro de otra pantalla): cada escenario repite sus
  propios pasos de navegación, tal como hace el documento. Solo usa `Antecedentes` si *todos* los
  test cases arrancan exactamente igual.
- `@datos-prueba` en los escenarios que crean/editan/borran datos (ver §4). Los que solo leen
  datos existentes no llevan esta etiqueta.

### 3.2 Steps

- Un step definition por texto Gherkin único; si dos escenarios comparten exactamente la misma
  frase, **un solo step la implementa** (no la dupliques). Si dos frases distintas necesitan
  lógica parecida, factoriza en un método del Page Object y llama a ese método desde ambos steps.
- Antes de escribir un `Then`, decide si la verificación depende del contexto (p. ej. "aparece el
  diálogo de confirmación" puede ser el de borrar imputación o el de borrar día). Si un mismo
  texto Gherkin puede aparecer en más de un contexto, el step debe detectar en qué contexto está
  (mirar qué contenedor está visible) en vez de asumir uno fijo — mira
  `Then('verifico la interfaz de la pantalla', ...)` en `imputacion-horas.steps.ts` como ejemplo.
- Reutiliza los helpers comunes ya existentes en vez de reimplementarlos: `irALaHomeConReintentos`
  (`common.steps.ts`), el patrón de limpieza de datos de prueba, `elegirAutocompletar`,
  `escribirHoras`, etc.

### 3.3 Page Object

- Getters para los contenedores (diálogo, formulario, tabla...), métodos para las acciones
  (`seleccionarDia`, `guardarImputacion`...). Nada de lógica de aserciones dentro del Page Object:
  las aserciones (`assert.*`) viven en los steps, el Page Object solo expone datos/acciones.
- Si la pantalla ya tiene Page Object de otra feature (p. ej. el calendario que reutilizan varios
  test cases), amplíalo en vez de duplicar selectores.

---

## 4. Datos de prueba: nunca inventados, siempre verificados en vivo

1. **No asumas qué datos existen.** Antes de escribir un paso que selecciona "un proyecto", "una
   tarea caducada", "un día con imputaciones", etc., comprueba en vivo qué hay de verdad en dev.
   Escribe un script desechable de Playwright (ver plantilla en §6.2), núnca lo commitees, y
   bórralo cuando termines.
2. Este proyecto ya tiene datos de prueba dedicados descubiertos así (no los inventes de nuevo,
   reutilízalos si tu feature los necesita): proyectos `00_NC_EMPTY` (sin subproyecto/tarea),
   `00_NC_SUBPROJECT` (con subproyecto y tarea), `00_T_TASK` / `00_T_SUBPROJECT_TASK` (tarea
   caducada — el desplegable de tarea aparece vacío, "Sin opciones disponibles"). Si tu feature
   necesita un dato que no existe todavía, busca si hay un fixture de QA ya preparado con un
   nombre parecido (`00_*`) antes de asumir que no existe.
3. **Reserva un día/registro de escritura dedicado**, distinto de los días/registros de solo
   lectura que uses como referencia estable. En `imputacion-horas.feature`: `14/07/2026` es el día
   de escritura (se limpia antes y después), `12/05/2026`, `01/05/2026` y `03/05/2026` son
   referencias de solo lectura que nunca se tocan.
4. Los escenarios `@datos-prueba` deben dejar el entorno **exactamente como lo encontraron**: un
   `After({ tags: '@datos-prueba' })` que limpia, y cada escenario que depende de "día vacío"
   debe **garantizarlo él mismo** (limpiar si hace falta) en vez de asumir que nadie dejó basura —
   ver la lección del §8 sobre interferencia entre escenarios.

---

## 5. Cuándo y cómo desviarse del texto del documento

Vas a encontrar casos donde la UI real no coincide con el documento. Ejemplos reales ya resueltos
en esta feature (lee los comentarios de cabecera de `imputacion-horas.feature` para verlos
completos):

- El documento dice "modal de añadir imputación"; la UI real muestra un formulario embebido en la
  página, no un modal. Se usa "formulario" en el texto Gherkin, documentado una vez en la
  cabecera.
- El documento dice que la edición se abre desde "Resumen de imputaciones"; esa pantalla devuelve
  403 en el entorno de dev con el usuario de pruebas. El diálogo que se verifica es el mismo
  componente, así que se llega a él desde "Imputación horas", documentado explícitamente.
- Un bug real de backend (`POST /rapports/tickets` responde 500 si subes el justificante antes de
  elegir el tipo de gasto) obligó a reordenar dos pasos; se documentó con el endpoint y el error
  exacto, no con una frase vaga.

**Reglas para un desvío válido:**

- Tiene que ser **necesario** (la UI real no permite seguir el documento literal) y **lógico** (el
  desvío no traiciona lo que el paso quiere comprobar).
- Se documenta en un comentario junto al escenario o en la cabecera del archivo, explicando *qué*
  dice el documento, *qué* hace la UI real, y *por qué* se adapta así.
- Nunca se usa un desvío para evitar automatizar algo que sí era automatizable con un poco más de
  esfuerzo (investigar un selector, encontrar el dato de prueba correcto, esperar el estado
  correcto). Un desvío documenta una diferencia real, no resuelve pereza.

Cuando un paso **de verdad** no se puede automatizar (requiere un perfil de administrador que no
existe para el usuario de pruebas, un servicio externo de IA, datos que no se pueden crear en
dev...), no lo inventes ni lo fuerces: usa el step ya existente
`Then('se registra como no automatizable: {string}', ...)`, con el motivo técnico concreto (qué
falta exactamente, no "no se pudo"). Esto queda en el reporte HTML como adjunto del paso, nunca se
imprime en consola (ver `live-progress-formatter.ts`), y dejando claro que **ese paso no se da por
verificado** — no se marca el test como pasado fingiendo que sí se comprobó.

### 5.1 "Este filtro/campo no existe en la pantalla" no es casi nunca la conclusión correcta

Esto pasó de verdad en la feature "Resumen imputaciones" y hay que evitarlo la próxima vez.

Un test case puede describir un filtro (p. ej. "País", "Centro de trabajo", "Código", "Creador",
"Cliente") que **no está** en la pantalla donde empezaste a buscar. La tentación es concluir
"la pantalla X no tiene ese filtro" y marcar el paso como no automatizable. **Esa conclusión casi
siempre está mal.** Lo que pasó al revisar ese caso real: los 5 campos SÍ existían — cada uno en
una pantalla distinta de la intranet (`countryId`/`workCenterId` en Histórico normativas, `code`
en Resumen subproyectos, `creatorId` en Notificaciones enviadas, `clientId` en Resumen proyectos),
confirmado leyendo el `.component.html` real de cada una. El test case simplemente **no
pertenecía a la pantalla donde se estaba buscando** — pertenecía a otra, y esa suite de Azure
DevOps mezclaba referencias de varias pantallas bajo un mismo nombre de suite (el propio
documento de test cases ya avisaba de esto y pedía confirmar las rutas de navegación antes de dar
los casos por buenos).

**Antes de concluir "este campo no existe en la aplicación", busca el campo en el resto del
frontend.** Es rápido: `grep -rn "nombreDelCampo" src/app/pages` en el repo del frontend (solo
lectura) sobre el `configMap` o el nombre del control que esperas (p. ej. `countryId`,
`workCenterId`, `clientId`). Si aparece en otro módulo, **no lo marques como no automatizable**:
eso es la señal de que el test case (o varios del mismo bloque) pertenecen a otra pantalla, no de
que el campo no exista. En ese punto, **para y pregunta al usuario** qué pantalla es la correcta
para esos casos — no lo decidas tú consolidándolos todos en la pantalla "más parecida" solo
porque es la que ya estabas automatizando. Si de verdad no aparece en ningún módulo del frontend
después de buscarlo, ahí sí es un "no automatizable" legítimo (o, más probablemente, un campo que
depende de un permiso/rol que el usuario de pruebas no tiene — compruébalo también antes de
descartarlo).

Esto es distinto de un desvío válido (§5): un desvío documenta que la UI real hace algo distinto
de lo que dice el documento para **el mismo caso, en la misma pantalla**. Lo de arriba es sobre
cuándo el caso entero puede estar **en la pantalla equivocada** — y eso no se resuelve con un
comentario de desvío, se resuelve preguntando.

**Actualización (2026-11-13): este caso concreto ya está corregido.** TC-RI-17..26 de
`resumen-imputaciones.feature`/`.steps.ts` navegan ahora a las 4 pantallas reales (Histórico
normativas, Resumen subproyectos, Notificaciones enviadas, Resumen proyectos) y verifican el
filtro de verdad, en vez de registrar "no automatizable". Si alguna vez vuelves a ver un bloque de
casos marcados como "el filtro no existe en la pantalla" en este repo, es una señal de alarma: ya
pasó una vez, cuéstate si de verdad se investigó lo suficiente antes de concluirlo.

---

## 6. Flujo de trabajo obligatorio

No escribas el `.feature` final a la primera. El orden que de verdad funciona:

### 6.1 Lee el frontend real (solo lectura)

Antes de escribir un selector, busca el componente Angular real en el repo del frontend (ruta que
te dará el usuario, con permiso de **solo lectura**: no modifiques nada ahí). Busca el
`.component.html` de la pantalla para confirmar: estructura real del DOM (¿el botón que buscas es
hijo o hermano del contenedor que crees?), ids reales de los campos, textos reales de botones/menús
(pueden no coincidir con el texto del documento — p. ej. el documento dice "Eliminar imputación"
pero el botón real dice "Borrar imputación"; usa el texto real en el código, el texto del
documento en el Gherkin, y dilo en un comentario), lógica de validadores (`*.component.ts` /
`*.service.ts`) para entender por qué algo está deshabilitado o es obligatorio. Si un campo que el
test case pide no aparece en la pantalla que esperabas, **no concluyas que no existe**: búscalo en
el resto del repo del frontend antes de descartarlo (ver §5.1).

### 6.2 Verifica en vivo contra dev con scripts desechables

Con la sesión ya guardada (`.auth/chrome-profile-dev`), puedes abrir el navegador real y probar
selectores/datos antes de tocar el código final. Patrón mínimo (bórralo al terminar, nunca lo
commitees):

```ts
import { resolveConfig } from './src/support/config';
import { getAuthenticatedContext } from './src/support/session';
import { HomePage } from './src/pages/home.page';

(async () => {
  const cfg = resolveConfig();
  const ctx = await getAuthenticatedContext(cfg, { width: 1920, height: 1080 });
  const page = ctx.pages()[0] ?? (await ctx.newPage());
  await new HomePage(page).goto(cfg.baseUrl);
  // ... click en la tarjeta del módulo, navegar, inspeccionar el DOM real ...
  await ctx.close();
})().catch((e) => { console.error(String(e).slice(0, 800)); process.exit(1); });
```

Ejecútalo con `npx ts-node --transpile-only <script>.ts`. Útil también para: capturar
`page.on('response', ...)` y ver si una acción dispara un error HTTP real (así se encontró el 500
del backend), o volcar `innerText`/clases de un elemento cuando una aserción falla y no se
entiende por qué.

### 6.3 Escribe el `.feature`, los steps y el Page Object

Con lo anterior ya verificado, ahora sí: traduce cada test case siguiendo §2 y §3.

### 6.4 Typecheck y dry-run

```bash
npx tsc --noEmit
npx cucumber-js --config cucumber.js --profile default --dry-run --tags "@<nombre-feature>"
```

El dry-run tiene que terminar sin pasos "Undefined" ni "Ambiguous" antes de ejecutar nada contra
el navegador real.

### 6.5 Ejecuta cada escenario individualmente contra dev, y arregla la causa raíz

```bash
npm run test:dev -- --name "TC-<PREFIJO>-01 " --headless
```

(el espacio final en el `--name` evita que "TC-IH-01" matchee también "TC-IH-010" si existiera).
Cuando falle, **no relajes la aserción para que pase** ni la marques como "no automatizable" sin
evidencia: vuelve a §6.2, investiga por qué falla de verdad (¿el valor no está en el DOM como
texto, se pinta por CSS? ¿el botón es hermano, no hijo? ¿el elemento está deshabilitado por
`pointer-events:none`, no por el atributo `disabled`? — ver §8 para la lista de causas ya vistas
en este repo) y corrige la causa real.

### 6.6 Ejecuta la feature completa junta (no solo escenario por escenario)

```bash
npm run test:dev -- --tags "@<nombre-feature>" --headless
```

Un escenario puede pasar solo y fallar en conjunto porque otro escenario anterior dejó datos que
el primero asumía ausentes (pasó exactamente esto con `TC-IH-01`/`TC-IH-02` y el día de prueba
compartido). Si eso ocurre, el escenario que asume "vacío"/"sin datos" debe **garantizarlo él
mismo** (limpiar si hace falta) en vez de confiar en el orden de ejecución.

### 6.7 (Si tu feature se suma a la suite combinada) actualiza `cucumber.js`

Si el usuario quiere que la nueva feature se ejecute en el orden fijo junto a las demás (ver el
perfil `suite` en `cucumber.js`), añade su ruta en el array `paths` en el orden correcto, y
confírmalo con un `--dry-run --profile suite` (debe listar las features en el orden esperado).

### 6.8 Reporta

Entrega el resumen que pide el §0, punto 5. No digas "la feature está lista" si no corriste el
punto 6.6 contra dev y no la viste pasar. Si la última pasada completa falló por algo que parece
ruido transitorio (red, timeout) y volviste a probar los casos sueltos en vez de repetir la pasada
completa, dilo así de claro en el resumen — "no se confirmó la pasada completa en verde" — en vez
de dar la feature por cerrada. Un "N/N casos pasan" en el resumen debe significar que se vio pasar
la feature **completa, de una vez**, no la suma de ejecuciones sueltas.

---

## 7. Errores ya vistos en este repo (revísalos antes de rendirte con un `assert` que falla)

- **El valor que buscas no está en el texto del DOM**: algunas pantallas pintan datos (p. ej. la
  hora imputada en el calendario) con CSS a partir de una clase (`hour-HH-MM`) leída por un
  `::before`/`::after`, no como texto. `innerText()`/regex sobre el texto nunca lo va a encontrar;
  hay que leer la clase.
- **Dos elementos que esperas "anidados" son en realidad hermanos**: un botón "Guardar" puede
  vivir en un `<div class="btns-block">` aparte, no dentro del formulario que lo activa. Si un
  `.click()` nunca encuentra el elemento (timeout esperando "visible"), confirma la jerarquía real
  en el HTML del componente (§6.1) antes de aumentar timeouts.
- **Un panel de PrimeNG (año/mes del calendario, por ejemplo) oculta la cabecera mientras está
  abierto**: no intentes releer un valor que vive en un elemento que el propio panel esconde; usa
  la clase `-selected` (`p-datepicker-year-selected`, `p-datepicker-month-selected`) del propio
  panel.
- **"Deshabilitado" puede ser `pointer-events: none` por una clase CSS, no el atributo
  `disabled`**: Playwright esperará indefinidamente a que un elemento así sea "estable" y nunca lo
  será. Verifica la clase directamente (`getAttribute('class')`) en vez de forzar el clic.
- **No esperes con un `elementHandle()` capturado una sola vez** para sondear un estado que cambia
  con el tiempo (p. ej. "espera a que este botón deje de estar disabled"): si Angular vuelve a
  renderizar el nodo, el handle queda obsoleto y el sondeo nunca ve el cambio real. Vuelve a
  consultar el *locator* en cada iteración de un bucle de espera manual.
- **El texto del documento no siempre coincide con el texto real del botón/menú** ("Eliminar" vs.
  "Borrar"): usa el texto real en el selector, dilo en un comentario de una línea.
- **Un diálogo que vuelve a abrirse puede conservar estado de la vez anterior** (no asumas que
  "Añadir X" siempre abre un formulario completamente en blanco; compruébalo en vivo).
- **Un fallo real de backend puede disfrazarse de "mi selector está mal"**: si una acción
  simple falla sin razón aparente, añade un listener de `page.on('response', ...)` y mira si hay
  un 4xx/5xx real antes de seguir ajustando selectores.
- **Un filtro/campo que "no existe" en la pantalla donde buscaste casi siempre existe en otra
  pantalla real** (ver §5.1 para el caso real: 5 filtros de "Resumen imputaciones" que en
  realidad pertenecían a otras 4 pantallas distintas). Antes de marcar "no automatizable: el
  campo no existe", búscalo en el resto del frontend.
- **Lo que pasa escenario por escenario puede fallar junto**: ejecuta siempre el §6.6 antes de dar
  la feature por terminada.
- **Un `.last()`/`.first()` sobre un localizador que mezcla DOS tipos de componente parecidos
  (p. ej. `.p-select-overlay, .p-multiselect-overlay` o `.p-select-option, .p-multiselect-option`)
  puede capturar el overlay/opción equivocado** si la pantalla tiene más de un componente de ese
  estilo (p. ej. un filtro `p-select` y, más abajo, el selector de Campos como `p-multiselect`).
  Pasó al arreglar TC-RI-17..26: el `waitFor` "veía visible" un overlay que no era el que acababas
  de abrir, y la búsqueda de la opción fallaba con 0 resultados aunque la opción sí estaba en el
  DOM. Solución: detecta el tipo real del componente (`tagName`) y usa SOLO las clases de ESE tipo
  (`.p-select-dropdown`/`.p-select-filter`/`.p-select-option`, nunca mezcladas con las de
  `p-multiselect`) en cada paso.
- **Navegar a otra pantalla que comparte el mismo wrapper (`app-summary-wrapper`) puede necesitar
  un pequeño margen extra** antes de interactuar con sus desplegables: esperar solo a que aparezca
  el primer campo visible (p. ej. `#startdate-0`) no siempre basta — Angular puede seguir
  terminando de enlazar otros componentes de la pantalla. Si un `p-select`/`p-multiselect` recién
  abierto muestra 0 opciones justo después de navegar, añade una segunda espera (otro elemento
  visible, p. ej. el botón Filtrar) más un margen corto antes de abrir el desplegable.
- **"Limpiar"/"Clear filters" no siempre deja los campos en blanco**: en Resumen de imputaciones
  las fechas quedan vacías tras Limpiar, pero en otras pantallas con el mismo wrapper (Histórico
  normativas, Resumen subproyectos, Notificaciones enviadas, Resumen proyectos) Limpiar las
  restablece a un rango por defecto ("01/01/2000"–"31/12/2026"), no a vacío. No asumas el mismo
  contrato de "limpiar = vacío" en una pantalla nueva solo porque lo viste en otra con un
  componente visualmente idéntico; compruébalo en vivo y, si hace falta, verifica el filtro
  específico (su chip en el acordeón "Filtros") en vez de la fecha en bruto.

---

## 8. Qué NO hacer (la lista corta)

- No parafrasees un paso del documento "porque queda más claro" en tu redacción.
- No inventes datos de ejemplo (proyectos, fechas, nombres) sin haber verificado antes qué existe
  de verdad en el entorno.
- No fusiones ni reordenes pasos del documento sin documentar por qué.
- No relajes una aserción para que un test pase si no entendiste la causa real del fallo.
- No marques un paso como "no automatizable" sin una razón técnica concreta y verificable.
- No concluyas "este campo no existe en la aplicación" solo porque no está en la pantalla donde
  empezaste a buscar — búscalo en el resto del frontend antes de descartarlo (§5.1). Si varios
  casos de la misma suite parecen apuntar a pantallas distintas de la que le da nombre a la suite,
  para y pregunta al usuario en vez de consolidarlos todos en una pantalla por tu cuenta.
- No des una feature por terminada sin haberla corrido contra dev (escenario por escenario y
  completa, §6.5–§6.6) **de una sola vez, de principio a fin**.
- No uses `console.warn`/`console.log` para mensajes informativos durante la ejecución — usa
  `this.attach(...)` para que quede en el reporte HTML sin ensuciar la consola en vivo.
- No borres ni modifiques nada del repo del frontend: es de **solo lectura**.

---

## 9. Formato en el que te va a llegar el encargo

El usuario te va a decir algo como: *"lee `GUIA_COPILOT_NUEVAS_FEATURES.md` e implementa la
feature `<nombre>` con estos test cases: `<pega aquí la tabla Paso/Acción/Resultado esperado de
cada caso>"*. Tu primera respuesta, antes de escribir código, debería confirmar: el prefijo de
nomenclatura que vas a usar, el nombre de archivo de la feature, y si vas a reutilizar algún Page
Object existente. Si algo del documento es ambiguo (un paso sin resultado esperado claro, un dato
que no sabes si existe en dev), dilo y pregunta — no lo rellenes por tu cuenta.
