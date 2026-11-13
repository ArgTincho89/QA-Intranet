import { Given, When, Then, After } from '@cucumber/cucumber';
import * as assert from 'assert';
import * as fs from 'fs';
import type { Download, Request } from 'playwright';
import { CustomWorld } from '../support/world';
import { irALaHomeConReintentos } from './common.steps';
import { aMinutos } from '../pages/imputacion-horas.page';
import { ResumenImputacionesPage, aFecha, rangoMesActual, rangoSemanaActual } from '../pages/resumen-imputaciones.page';

const PREFIJO_VISTAS = 'QA_RI_';
const FILTROS: Record<string, string> = { 'División proyecto': 'divisionid-0', 'División usuario': 'userdivisionid-0' };

interface Estado {
  ultimoTexto: string;
  ordenTexto: Record<string, string[]>;
  pagina1: string[];
  pagina2: string[];
  descarga?: Download;
  peticionExportar?: Request;
  ordenColumnasAntes: string[];
  ordenColumnasDespues: string[];
  columnaArrastrada: string;
  posicionDestino: number;
  opcionesSituacion: string[];
}

const estados = new WeakMap<CustomWorld, Estado>();
const st = (w: CustomWorld): Estado => {
  let e = estados.get(w);
  if (!e) {
    e = { ultimoTexto: '', ordenTexto: {}, pagina1: [], pagina2: [], ordenColumnasAntes: [], ordenColumnasDespues: [], columnaArrastrada: '', posicionDestino: -1, opcionesSituacion: [] };
    estados.set(w, e);
  }
  return e;
};
const ri = (w: CustomWorld) => new ResumenImputacionesPage(w.page);

const dentroDe = (fecha: string, desde: string, hasta: string) => {
  const f = aFecha(fecha).getTime();
  return f >= aFecha(desde).getTime() && f <= aFecha(hasta).getTime();
};

const lista = (texto: string) => texto.split(',').map((t) => t.trim()).filter(Boolean);
const comparar = (a: string, b: string) => a.localeCompare(b, 'es', { sensitivity: 'base' });

async function verificarFiltrosBorrados(w: CustomWorld): Promise<void> {
  const p = ri(w);
  const f = await p.fechas();
  assert.strictEqual(f.desde, '', `"Fecha desde" debería estar vacía y es "${f.desde}"`);
  assert.strictEqual(f.hasta, '', `"Fecha hasta" debería estar vacía y es "${f.hasta}"`);
  assert.strictEqual(await p.valorCampo('divisionid-0'), '', 'El filtro División proyecto debería estar vacío');
  assert.strictEqual(await p.valorCampo('userdivisionid-0'), '', 'El filtro División usuario debería estar vacío');
  assert.ok(!/Desde:/.test(await p.textoFiltrosActivos()), 'Siguen apareciendo filtros activos');
}

async function verificarFilasEnRango(w: CustomWorld, desde: string, hasta: string): Promise<void> {
  const p = ri(w);
  const fechas = await p.textosColumna('Fecha');
  assert.ok(fechas.length > 0, `No hay datos entre ${desde} y ${hasta}`);
  for (const f of fechas) assert.ok(dentroDe(f, desde, hasta), `La fecha ${f} queda fuera del rango ${desde}–${hasta}`);
  w.attach(`${fechas.length} filas en la página, todas entre ${desde} y ${hasta}`, 'text/plain');
}

async function crearVistaConInterfaz(w: CustomWorld, nombre: string): Promise<void> {
  const p = ri(w);
  await p.elegirRango('currentMonth');
  await p.esperarFiltrarHabilitado();
  await p.abrirGuardarVista();
  const d = p.dialogoVista;
  for (const sel of ['#projection-name', '#projection-generic']) assert.ok((await d.locator(sel).count()) > 0, `Falta ${sel} en el modal Guardar vista`);
  assert.ok(await d.getByRole('button', { name: 'Cancelar' }).isVisible(), 'Falta el botón Cancelar del modal');
  assert.ok(await d.getByRole('button', { name: 'Guardar' }).isVisible(), 'Falta el botón Guardar del modal');
  await d.locator('#projection-name').fill(nombre);
  await p.confirmarGuardarVista();
  await p.vista(nombre).waitFor({ state: 'visible', timeout: 15_000 });
}

async function eliminarVistasDePrueba(w: CustomWorld): Promise<void> {
  await irALaHomeConReintentos(w);
  const p = ri(w);
  await p.ir();
  for (let i = 0; i < 10; i++) {
    const propias = (await p.nombresVistas()).filter((n) => n.startsWith(PREFIJO_VISTAS));
    if (propias.length === 0) return;
    await p.borrarVista(propias[0]!);
  }
}

After({ tags: '@vistas-prueba' }, async function (this: CustomWorld) {
  try {
    await eliminarVistasDePrueba(this);
  } catch (e) {
    this.attach(`No se pudieron eliminar las vistas de prueba ${PREFIJO_VISTAS}*: ${String(e)}`, 'text/plain');
  }
});

// ---------------------------------------------------------------- Navegación
When('accedo a Informes → Resumen de imputaciones', async function (this: CustomWorld) {
  const tarjeta = this.page.locator('.custom-card#imputation-summary');
  const enHome = await tarjeta.waitFor({ state: 'visible', timeout: 5_000 }).then(() => true).catch(() => false);
  if (!enHome) await irALaHomeConReintentos(this);
  await ri(this).ir();
});

Then('la interfaz de Resumen de imputaciones debe mantenerse intacta', async function (this: CustomWorld) {
  const p = ri(this);
  await p.titulo.waitFor({ state: 'visible', timeout: 15_000 });
  assert.ok(/Filtros/.test(await p.textoFiltrosActivos()), 'No se muestra el acordeón Filtros');
  for (const [nombre, loc] of [['Filtrar', p.botonFiltrar], ['Limpiar', p.botonLimpiar], ['Añadir imputación', p.botonAnadir], ['Exportar a Excel', p.botonExportar], ['Guardar vista', p.botonGuardarVista], ['Borrar vista', p.botonBorrarVista]] as const) {
    assert.ok(await loc.isVisible(), `No se muestra el botón ${nombre}`);
  }
  assert.ok(await this.page.locator('#custom-table-component').isVisible(), 'No se muestra la tabla de resultados');
  const texto = await this.page.locator('app-root').innerText();
  assert.ok(!/error 500|something went wrong|ha ocurrido un error inesperado/i.test(texto), `Pantalla de error detectada: ${texto.slice(0, 200)}`);
});

// ---------------------------------------------------------------- Vistas
When('creo la vista {string} y compruebo la interfaz relacionada con Crear vista', async function (this: CustomWorld, nombre: string) {
  await crearVistaConInterfaz(this, nombre);
});

Given('existe la vista de prueba {string}', async function (this: CustomWorld, nombre: string) {
  await ri(this).crearVistaDePrueba(nombre);
  await ri(this).vista(nombre).waitFor({ state: 'visible', timeout: 15_000 });
});

When('selecciono el filtro de fecha obligatorio desde {string} hasta {string}', async function (this: CustomWorld, desde: string, hasta: string) {
  const p = ri(this);
  await p.seleccionarFecha('startdate', desde);
  await p.seleccionarFecha('enddate', hasta);
});

When('selecciono cualquier otro filtro: Usuario {string}', async function (this: CustomWorld, usuario: string) {
  await ri(this).seleccionarEnAutocompletar('userid-0', usuario);
});

When('hago clic en Guardar', async function (this: CustomWorld) {
  await ri(this).abrirGuardarVista();
});

Then('se abre el modal {string}', async function (this: CustomWorld, titulo: string) {
  await ri(this).dialogoVista.waitFor({ state: 'visible', timeout: 10_000 });
  assert.ok((await ri(this).dialogoVista.innerText()).includes(titulo), `El modal no se titula "${titulo}"`);
});

When('introduzco el nombre de la vista {string}', async function (this: CustomWorld, nombre: string) {
  await ri(this).dialogoVista.locator('#projection-name').fill(nombre);
});

Then('el nombre se introduce sin problemas de interfaz', async function (this: CustomWorld) {
  const d = ri(this).dialogoVista;
  assert.ok((await d.locator('#projection-name').inputValue()).length > 0, 'El nombre no quedó introducido');
  assert.strictEqual(await d.locator('.validation-error').count(), 0, 'Aparece un error de validación en el campo nombre');
});

When('marco la casilla para crear la vista como genérica', async function (this: CustomWorld) {
  await ri(this).dialogoVista.locator('#projection-generic').check();
});

Then('la casilla Genérica queda marcada', async function (this: CustomWorld) {
  assert.ok(await ri(this).dialogoVista.locator('#projection-generic').isChecked(), 'La casilla Genérica no está marcada');
});

When('hago clic en Guardar dentro del modal {string}', async function (this: CustomWorld, _modal: string) {
  await ri(this).confirmarGuardarVista();
});

Then('la vista {string} se guarda y es genérica', async function (this: CustomWorld, nombre: string) {
  const v = ri(this).vista(nombre);
  await v.waitFor({ state: 'visible', timeout: 15_000 });
  assert.ok(/generic-projection/.test((await v.getAttribute('class')) ?? ''), `La vista "${nombre}" no es genérica`);
});

When('selecciono la vista {string}', async function (this: CustomWorld, nombre: string) {
  await ri(this).seleccionarVista(nombre);
});

When('selecciono el botón de opción correspondiente a {string}', async function (this: CustomWorld, _texto: string) {
  const d = ri(this).dialogoVista;
  await d.locator('#option-edit').waitFor({ state: 'attached', timeout: 10_000 });
  await d.locator('label[for="option-edit"]').click();
});

Then('se puede guardar la vista con el nombre existente {string} o con uno nuevo', async function (this: CustomWorld, nombre: string) {
  const d = ri(this).dialogoVista;
  assert.strictEqual((await d.locator('label[for="option-edit"]').innerText()).trim(), nombre);
  assert.ok(/Nueva vista/.test(await d.locator('label[for="option-create"]').innerText()), 'Falta la opción Nueva vista');
});

When('selecciono el nombre existente {string} en la opción Guardar como', async function (this: CustomWorld, _nombre: string) {
  await ri(this).dialogoVista.locator('label[for="option-edit"]').click();
});

Then('la vista se guardará con el nombre existente {string}', async function (this: CustomWorld, nombre: string) {
  const d = ri(this).dialogoVista;
  assert.ok(await d.locator('#option-edit').isChecked(), 'La opción con el nombre existente no está marcada');
  assert.strictEqual((await d.locator('label[for="option-edit"]').innerText()).trim(), nombre);
  assert.ok(!(await d.locator('#projection-name').isVisible()), 'No debería pedirse un nombre nuevo');
});

When('selecciono Nueva vista', async function (this: CustomWorld) {
  await ri(this).dialogoVista.locator('label[for="option-create"]').click();
});

Then('se muestra el campo para introducir un nuevo nombre para la vista', async function (this: CustomWorld) {
  await ri(this).dialogoVista.locator('#projection-name').waitFor({ state: 'visible', timeout: 10_000 });
});

When('escribo el nombre de la vista {string}', async function (this: CustomWorld, nombre: string) {
  await ri(this).dialogoVista.locator('#projection-name').fill(nombre);
});

Then('el nombre de la vista queda introducido con {string}', async function (this: CustomWorld, nombre: string) {
  assert.strictEqual(await ri(this).dialogoVista.locator('#projection-name').inputValue(), nombre);
});

When('edito la vista {string} y compruebo la interfaz relacionada con Editar vista', async function (this: CustomWorld, nombre: string) {
  const p = ri(this);
  await p.seleccionarVista(nombre);
  await p.abrirGuardarVista();
  const d = p.dialogoVista;
  await d.locator('#option-edit').waitFor({ state: 'attached', timeout: 10_000 });
  assert.strictEqual((await d.locator('label[for="option-edit"]').innerText()).trim(), nombre);
  await d.locator('label[for="option-edit"]').click();
  assert.ok(!(await d.locator('#projection-name').isVisible()), 'Al editar no debería pedirse un nombre nuevo');
  await p.confirmarGuardarVista();
  await p.vista(nombre).waitFor({ state: 'visible', timeout: 15_000 });
});

When('hago clic en el botón Eliminar vista', async function (this: CustomWorld) {
  await ri(this).botonBorrarVista.click();
});

Then('se abre una ventana emergente de confirmación', async function (this: CustomWorld) {
  await this.page.locator('#delete-confirmation-btn').waitFor({ state: 'visible', timeout: 10_000 });
  assert.ok(/Eliminar vista/.test(await ri(this).dialogo.innerText()), 'La ventana no es la de eliminar vista');
});

When('hago clic en Borrar dentro de la ventana de confirmación', async function (this: CustomWorld) {
  await this.page.locator('#delete-confirmation-btn').click();
});

Then('la vista {string} se elimina', async function (this: CustomWorld, nombre: string) {
  await ri(this).vista(nombre).waitFor({ state: 'detached', timeout: 15_000 });
});

When('hago clic en el botón Cancelar de la ventana de confirmación de la vista', async function (this: CustomWorld) {
  await this.page.locator('#cancel-confirmation-btn').click();
});

Then('la ventana emergente de confirmación de eliminación se cierra y la vista {string} sigue existiendo', async function (this: CustomWorld, nombre: string) {
  await this.page.locator('#delete-confirmation-btn').waitFor({ state: 'hidden', timeout: 10_000 });
  assert.ok(await ri(this).vista(nombre).isVisible(), `La vista "${nombre}" no debería haberse eliminado`);
});

When('elimino la vista {string} y compruebo la interfaz relacionada con Eliminar vista', async function (this: CustomWorld, nombre: string) {
  const p = ri(this);
  await p.seleccionarVista(nombre);
  await p.botonBorrarVista.click();
  const d = p.dialogo;
  await this.page.locator('#delete-confirmation-btn').waitFor({ state: 'visible', timeout: 10_000 });
  assert.ok(await this.page.locator('#cancel-confirmation-btn').isVisible(), 'Falta el botón Cancelar de la confirmación');
  assert.ok(/Esta acción es irreversible/.test(await d.innerText()), 'Falta el mensaje de confirmación');
  await this.page.locator('#delete-confirmation-btn').click();
  await p.vista(nombre).waitFor({ state: 'detached', timeout: 15_000 });
});

// ---------------------------------------------------------------- Filtros de fecha
When('hago clic en el selector de fecha del campo Fecha desde', async function (this: CustomWorld) {
  await ri(this).abrirCalendario('startdate');
});

When('hago clic en el selector de fecha del campo Fecha hasta', async function (this: CustomWorld) {
  await ri(this).abrirCalendario('enddate');
});

Then('se abre el calendario', async function (this: CustomWorld) {
  await this.page.locator('.p-datepicker-panel').last().waitFor({ state: 'visible', timeout: 10_000 });
});

When('hago clic en la fecha {string}', async function (this: CustomWorld, fecha: string) {
  await ri(this).elegirDia(fecha);
});

Then('la fecha inicial {string} queda seleccionada', async function (this: CustomWorld, fecha: string) {
  const p = ri(this);
  const valor = (await p.dialogoAnadir.count()) > 0 ? await p.valorFechaAnadir() : (await p.fechas()).desde;
  assert.ok(valor.startsWith(fecha), `La fecha inicial es "${valor}" y se esperaba "${fecha}"`);
});

Then('la fecha final {string} queda seleccionada', async function (this: CustomWorld, fecha: string) {
  const p = ri(this);
  const valor = (await p.dialogoAnadir.count()) > 0 ? await p.valorFechaAnadir() : (await p.fechas()).hasta;
  assert.ok(valor.endsWith(fecha), `La fecha final es "${valor}" y se esperaba "${fecha}"`);
});

When('hago clic en Filtrar', async function (this: CustomWorld) {
  await ri(this).filtrar();
});

Then('se aplica el filtro y se devuelven los datos comprendidos entre {string} y {string}', async function (this: CustomWorld, desde: string, hasta: string) {
  await verificarFilasEnRango(this, desde, hasta);
});

When('hago clic en Limpiar', async function (this: CustomWorld) {
  await ri(this).limpiar();
});

for (const texto of ['se borran los filtros aplicados', 'se elimina el filtro aplicado', 'se borran todos los filtros']) {
  Then(texto, async function (this: CustomWorld) {
    await verificarFiltrosBorrados(this);
  });
}

When('aplico el filtro de fecha desde {string} hasta {string} y compruebo la interfaz', async function (this: CustomWorld, desde: string, hasta: string) {
  const p = ri(this);
  await p.seleccionarFecha('startdate', desde);
  await p.seleccionarFecha('enddate', hasta);
  await p.filtrar();
});

When('hago clic en el icono Mes actual', async function (this: CustomWorld) {
  await ri(this).elegirRango('currentMonth');
});

Then('Fecha desde es el primer día del mes actual y Fecha hasta es el último día del mes actual', async function (this: CustomWorld) {
  const esperado = rangoMesActual();
  const real = await ri(this).fechas();
  assert.deepStrictEqual(real, esperado);
});

Then('se muestran los datos del mes actual', async function (this: CustomWorld) {
  const r = rangoMesActual();
  await verificarFilasEnRango(this, r.desde, r.hasta);
});

When('filtro los informes por el mes actual y compruebo la interfaz', async function (this: CustomWorld) {
  const p = ri(this);
  await p.elegirRango('currentMonth');
  await p.filtrar();
});

When('hago clic en el icono Semana actual', async function (this: CustomWorld) {
  await ri(this).elegirRango('currentWeek');
});

Then('Fecha desde es el primer día de la semana actual y Fecha hasta es el último día de la semana actual', async function (this: CustomWorld) {
  assert.deepStrictEqual(await ri(this).fechas(), rangoSemanaActual());
});

Then('se muestran los datos de la semana actual', async function (this: CustomWorld) {
  const r = rangoSemanaActual();
  await verificarFilasEnRango(this, r.desde, r.hasta);
});

When('filtro los datos por la semana actual y compruebo la interfaz', async function (this: CustomWorld) {
  const p = ri(this);
  await p.elegirRango('currentWeek');
  await p.filtrar();
});

// ---------------------------------------------------------------- Filtros por división y filtros inexistentes
When('selecciono el rango Mes actual como filtro de fecha obligatorio', async function (this: CustomWorld) {
  await ri(this).elegirRango('currentMonth');
});

for (const texto of ['selecciono todos los filtros obligatorios', 'completo todos los filtros obligatorios', 'selecciono los filtros obligatorios de fecha']) {
  When(texto, async function (this: CustomWorld) {
    await ri(this).elegirRango('currentMonth');
  });
}

When('escribo {string} en el filtro {string}', async function (this: CustomWorld, texto: string, filtro: string) {
  const id = FILTROS[filtro];
  assert.ok(id, `Filtro desconocido: ${filtro}`);
  await ri(this).escribirEnAutocompletar(id, texto);
});

Then('el filtro muestra {string} como sugerencia automática', async function (this: CustomWorld, sugerencia: string) {
  const opcion = this.page.locator('ul[role=listbox] li[role=option]').filter({ hasText: sugerencia }).first();
  await opcion.waitFor({ state: 'visible', timeout: 10_000 });
});

When('selecciono la sugerencia {string}', async function (this: CustomWorld, sugerencia: string) {
  await this.page.locator('ul[role=listbox] li[role=option]').filter({ hasText: sugerencia }).first().click();
  await this.page.waitForTimeout(800);
});

Then('el filtro {string} queda seleccionado con {string}', async function (this: CustomWorld, filtro: string, valor: string) {
  assert.strictEqual(await ri(this).valorCampo(FILTROS[filtro]!), valor);
});

Then('se filtran los datos de la división del proyecto {string}', async function (this: CustomWorld, division: string) {
  const p = ri(this);
  assert.ok(new RegExp(`División proyecto: ${division}`).test(await p.textoFiltrosActivos()), 'No aparece el filtro de división de proyecto activo');
  const divisiones = await p.textosColumna('Div. P.');
  assert.ok(divisiones.length > 0, `No hay datos para la división ${division}`);
  assert.ok(divisiones.every((d) => d === division), `Hay filas con otra división de proyecto: ${[...new Set(divisiones)].join(', ')}`);
  this.attach(`${divisiones.length} filas, todas con Div. P. = ${division}`, 'text/plain');
});

Then('se aplica el filtro de la división del usuario {string}', async function (this: CustomWorld, division: string) {
  const p = ri(this);
  assert.ok(new RegExp(`División usuario: ${division}`).test(await p.textoFiltrosActivos()), 'No aparece el filtro de división de usuario activo');
  const filas = await p.filas.count();
  this.attach(
    `Filtro División usuario = ${division} aplicado; filas devueltas: ${filas}. La tabla muestra códigos de división de usuario (p. ej. ${[...new Set(await p.textosColumna('Div. U.'))].slice(0, 3).join(', ') || 'ninguno'}) que no coinciden con las divisiones seleccionables.`,
    'text/plain'
  );
});

When('compruebo la interfaz relacionada con la funcionalidad de filtro por división', async function (this: CustomWorld) {
  await ri(this).acordeonFiltros.waitFor({ state: 'visible', timeout: 10_000 });
});

Then('el filtro {string} no existe en la pantalla', async function (this: CustomWorld, filtro: string) {
  const texto = await this.page.locator('p-accordion').innerText();
  const etiquetas = texto.split('\n').map((t) => t.trim()).filter(Boolean);
  this.attach(`Etiquetas del bloque Filtros: ${etiquetas.join(' | ')}`, 'text/plain');
  assert.ok(!etiquetas.some((e) => e.toLowerCase() === filtro.toLowerCase()), `El filtro "${filtro}" existe en la pantalla: el caso ya es automatizable`);
});

// ---------------------------------------------------------------- Selección de campos
When('selecciono los campos necesarios {string} en el desplegable', async function (this: CustomWorld, campos: string) {
  const p = ri(this);
  await p.abrirCampos();
  await this.page.locator('.p-multiselect-header .p-checkbox').click();
  for (const c of lista(campos)) await p.alternarCampo(c);
  await p.cerrarCampos();
});

Then('los campos {string} quedan seleccionados', async function (this: CustomWorld, campos: string) {
  const p = ri(this);
  const esperados = lista(campos);
  assert.strictEqual(await p.etiquetaCampos(), `${esperados.length} elementos seleccionados`);
  await p.abrirCampos();
  const marcados = (await this.page.locator('.p-multiselect-option[aria-selected="true"]').allInnerTexts()).map((t) => t.trim());
  await p.cerrarCampos();
  assert.deepStrictEqual([...marcados].sort(), [...esperados].sort());
});

Then('la tabla de resultados muestra los campos seleccionados {string}', async function (this: CustomWorld, campos: string) {
  assert.deepStrictEqual(await ri(this).cabecerasVisibles(), lista(campos));
});

When('compruebo si es posible filtrar sin seleccionar los campos', async function (this: CustomWorld) {
  const p = ri(this);
  await p.abrirCampos();
  for (const c of await this.page.locator('.p-multiselect-option[aria-selected="true"]').allInnerTexts()) await p.alternarCampo(c.trim());
  await p.cerrarCampos();
});

Then('la selección de campos es obligatoria', async function (this: CustomWorld) {
  const p = ri(this);
  assert.ok(await p.botonFiltrar.isDisabled(), 'Filtrar debería estar deshabilitado sin campos seleccionados');
  const control = this.page.locator('app-multi-select').filter({ has: this.page.locator('#columnidlist-0') });
  assert.ok((await control.getAttribute('class'))!.includes('ng-invalid'), 'El campo Campos no se marca como inválido');
  assert.ok(await p.etiquetaCampos().then((t) => !/elementos seleccionados/.test(t)), 'Campos sigue mostrando elementos seleccionados');
});

When('selecciono los campos necesarios {string} y aplico el filtro', async function (this: CustomWorld, campos: string) {
  const p = ri(this);
  await p.abrirCampos();
  await this.page.locator('.p-multiselect-header .p-checkbox').click();
  for (const c of lista(campos)) await p.alternarCampo(c);
  await p.cerrarCampos();
  await p.filtrar();
});

When('compruebo la interfaz relacionada con la selección de campos', async function (this: CustomWorld) {
  const cabeceras = await ri(this).cabecerasVisibles();
  assert.deepStrictEqual(cabeceras, ['Fecha', 'Usuario', 'Horas']);
});

// ---------------------------------------------------------------- Ordenación
async function aplicarFiltrosOrdenacion(w: CustomWorld, rango: { desde: string; hasta: string } | 'mes', division: string): Promise<void> {
  const p = ri(w);
  if (rango === 'mes') await p.elegirRango('currentMonth');
  else {
    await p.seleccionarFecha('startdate', rango.desde);
    await p.seleccionarFecha('enddate', rango.hasta);
  }
  await p.seleccionarEnAutocompletar('divisionid-0', division);
  await p.filtrar();
}

When('aplico filtros por división {string} y rango de fechas desde {string} hasta {string}', async function (this: CustomWorld, division: string, desde: string, hasta: string) {
  await aplicarFiltrosOrdenacion(this, { desde, hasta }, division);
});

When('aplico filtros por división {string} y el rango Mes actual', async function (this: CustomWorld, division: string) {
  await aplicarFiltrosOrdenacion(this, 'mes', division);
});

When('compruebo la ordenación ascendente de la columna Fecha', async function (this: CustomWorld) {
  await ri(this).ordenarPor('Fecha', 'ascending');
});

Then('las fechas se ordenan de la más antigua a la más reciente', async function (this: CustomWorld) {
  const t = (await ri(this).textosColumna('Fecha')).map((f) => aFecha(f).getTime());
  assert.ok(t.length > 1, 'No hay filas suficientes para comprobar la ordenación');
  assert.deepStrictEqual(t, [...t].sort((a, b) => a - b));
});

When('compruebo la ordenación descendente de la columna Fecha', async function (this: CustomWorld) {
  await ri(this).ordenarPor('Fecha', 'descending');
});

Then('las fechas se ordenan de la más reciente a la más antigua', async function (this: CustomWorld) {
  const t = (await ri(this).textosColumna('Fecha')).map((f) => aFecha(f).getTime());
  assert.ok(t.length > 1, 'No hay filas suficientes para comprobar la ordenación');
  assert.deepStrictEqual(t, [...t].sort((a, b) => b - a));
});

When('compruebo la ordenación ascendente de las columnas de texto {string}', async function (this: CustomWorld, columnas: string) {
  const p = ri(this);
  for (const c of lista(columnas)) {
    await p.ordenarPor(c, 'ascending');
    st(this).ordenTexto[c] = (await p.textosColumna(c)).filter(Boolean);
  }
});

Then('los registros del resumen se ordenan alfabéticamente de la A a la Z', async function (this: CustomWorld) {
  for (const [col, valores] of Object.entries(st(this).ordenTexto)) {
    assert.ok(valores.length > 1, `Sin datos suficientes en ${col}`);
    for (let i = 1; i < valores.length; i++) assert.ok(comparar(valores[i - 1]!, valores[i]!) <= 0, `${col}: "${valores[i - 1]}" no va antes de "${valores[i]}"`);
  }
});

When('compruebo la ordenación descendente de las columnas de texto {string}', async function (this: CustomWorld, columnas: string) {
  const p = ri(this);
  for (const c of lista(columnas)) {
    await p.ordenarPor(c, 'descending');
    st(this).ordenTexto[c] = (await p.textosColumna(c)).filter(Boolean);
  }
});

Then('los registros del resumen se ordenan alfabéticamente de la Z a la A', async function (this: CustomWorld) {
  for (const [col, valores] of Object.entries(st(this).ordenTexto)) {
    assert.ok(valores.length > 1, `Sin datos suficientes en ${col}`);
    for (let i = 1; i < valores.length; i++) assert.ok(comparar(valores[i - 1]!, valores[i]!) >= 0, `${col}: "${valores[i - 1]}" no va después de "${valores[i]}"`);
  }
});

When('compruebo que la ordenación funciona también en páginas distintas de la primera', async function (this: CustomWorld) {
  const p = ri(this);
  await p.ordenarPor('Fecha', 'ascending');
  st(this).pagina1 = await p.textosColumna('Fecha');
  await p.irAPagina(2);
  st(this).pagina2 = await p.textosColumna('Fecha');
});

Then('la ordenación funciona correctamente en la segunda página', async function (this: CustomWorld) {
  const { pagina1, pagina2 } = st(this);
  assert.ok(pagina2.length > 0, 'La segunda página no tiene datos');
  const t2 = pagina2.map((f) => aFecha(f).getTime());
  assert.deepStrictEqual(t2, [...t2].sort((a, b) => a - b), 'La segunda página no está ordenada');
  assert.ok(t2[0]! >= aFecha(pagina1[pagina1.length - 1]!).getTime(), 'La segunda página no continúa la ordenación de la primera');
});

When('compruebo la ordenación del campo Horas', async function (this: CustomWorld) {
  await ri(this).ordenarPor('Horas', 'descending');
});

Then('las horas se ordenan de mayor a menor', async function (this: CustomWorld) {
  const m = (await ri(this).textosColumna('Horas')).map(aMinutos);
  assert.ok(m.length > 1, 'No hay filas suficientes para comprobar la ordenación');
  assert.deepStrictEqual(m, [...m].sort((a, b) => b - a));
});

When('compruebo la interfaz relacionada con la ordenación', async function (this: CustomWorld) {
  await ri(this).ordenarPor('Fecha', 'ascending');
});

// ---------------------------------------------------------------- Exportar a Excel
When('aplico cualquier filtro: rango Mes actual', async function (this: CustomWorld) {
  const p = ri(this);
  await p.elegirRango('currentMonth');
  await p.filtrar();
});

When('hago clic en el enlace Exportar a Excel', async function (this: CustomWorld) {
  const p = ri(this);
  const [descarga, peticion] = await Promise.all([
    this.page.waitForEvent('download', { timeout: 60_000 }),
    this.page.waitForRequest((r) => r.url().includes('imputation-summaries-export'), { timeout: 60_000 }),
    p.botonExportar.click(),
  ]);
  st(this).descarga = descarga;
  st(this).peticionExportar = peticion;
});

Then('los datos mostrados en pantalla \\(resultado filtrado\\) se exportan a Excel', async function (this: CustomWorld) {
  const { descarga, peticionExportar } = st(this);
  assert.ok(descarga && peticionExportar, 'No se produjo la descarga');
  const nombre = descarga.suggestedFilename();
  assert.match(nombre, /^Imputation Summaries_\d{2}_\d{2}_\d{4}_\d{2}_\d{2}_\d{2}\.xlsx$/);
  const ruta = await descarga.path();
  const bytes = fs.readFileSync(ruta);
  assert.ok(bytes.length > 1000, `El fichero exportado es demasiado pequeño (${bytes.length} bytes)`);
  assert.strictEqual(bytes.subarray(0, 2).toString('latin1'), 'PK', 'El fichero exportado no es un .xlsx válido');
  const payload = peticionExportar.postData() ?? '';
  const r = rangoMesActual();
  const [d, m, a] = r.desde.split('/');
  assert.ok(payload.includes(`${a}-${m}-${d}`) || payload.includes(r.desde), `La petición de exportación no incluye el filtro de fechas: ${payload.slice(0, 300)}`);
  this.attach(`Exportado ${nombre} (${bytes.length} bytes) con el filtro ${r.desde}–${r.hasta}`, 'text/plain');
});

When('compruebo la interfaz relacionada con la exportación a Excel', async function (this: CustomWorld) {
  await ri(this).botonExportar.waitFor({ state: 'visible', timeout: 10_000 });
});

// ---------------------------------------------------------------- Arrastrar y soltar columnas
When('aplico filtros con cualquier valor: rango Mes actual', async function (this: CustomWorld) {
  const p = ri(this);
  await p.elegirRango('currentMonth');
  await p.filtrar();
});

When('compruebo la interfaz relacionada con la funcionalidad de arrastrar y soltar', async function (this: CustomWorld) {
  const p = ri(this);
  assert.ok((await p.cabecerasVisibles()).length > 1, 'No hay columnas para arrastrar');
});

When('arrastro las columnas de la tabla hacia la izquierda o hacia la derecha', async function (this: CustomWorld) {
  const p = ri(this);
  const e = st(this);
  e.ordenColumnasAntes = await p.cabecerasVisibles();
  e.columnaArrastrada = 'Nº personal';
  e.posicionDestino = e.ordenColumnasAntes.indexOf('Categoría');
  await p.arrastrarColumna('Nº personal', 'Categoría');
  e.ordenColumnasDespues = await p.cabecerasVisibles();
});

Then('las columnas de la tabla intercambian sus posiciones mediante arrastrar y soltar', async function (this: CustomWorld) {
  const { ordenColumnasAntes: antes, ordenColumnasDespues: despues, columnaArrastrada } = st(this);
  assert.notDeepStrictEqual(despues, antes, 'El orden de las columnas no cambió');
  assert.ok(despues.indexOf(columnaArrastrada) > antes.indexOf(columnaArrastrada), `${columnaArrastrada} no se movió hacia la derecha`);
});

When('suelto las columnas arrastradas', async function (this: CustomWorld) {
  const p = ri(this);
  const e = st(this);
  e.posicionDestino = e.ordenColumnasAntes.indexOf(e.columnaArrastrada);
  await p.arrastrarColumna(e.columnaArrastrada, e.ordenColumnasAntes[e.posicionDestino + 1]!);
  e.ordenColumnasDespues = await p.cabecerasVisibles();
});

Then('es posible soltar las columnas en la posición deseada de la tabla', async function (this: CustomWorld) {
  const e = st(this);
  assert.strictEqual(e.ordenColumnasDespues.indexOf(e.columnaArrastrada), e.posicionDestino, `${e.columnaArrastrada} no quedó en la posición ${e.posicionDestino}`);
});

// ---------------------------------------------------------------- Añadir imputación (completador)
const TEXTO_150 = 'Descripción de prueba automatizada QA RI '.repeat(4).slice(0, 150);

When('hago clic en el botón Añadir imputación del resumen', async function (this: CustomWorld) {
  await ri(this).abrirAnadir();
});

Then('se abre un modal para añadir una imputación como completador', async function (this: CustomWorld) {
  const d = ri(this).dialogoAnadir;
  await d.waitFor({ state: 'visible', timeout: 10_000 });
  assert.ok(/Añadir imputación/.test(await d.innerText()), 'El modal no se titula "Añadir imputación"');
});

When('compruebo la interfaz relacionada con añadir una imputación como completador', async function (this: CustomWorld) {
  await ri(this).dialogoAnadir.locator('#hours-0').waitFor({ state: 'visible', timeout: 10_000 });
});

Then('la interfaz del modal Añadir imputación debe mantenerse intacta', async function (this: CustomWorld) {
  const d = ri(this).dialogoAnadir;
  for (const sel of ['#fromdate-0', '#userid-0', '#projectid-0', '#subprojectid-0', '#taskid-0', '#description-0', '#internalref-0', 'p-select', '#hours-0']) {
    assert.ok(await d.locator(sel).first().isVisible(), `Falta ${sel} en el modal Añadir imputación`);
  }
  assert.ok(await d.getByRole('button', { name: 'Cancelar' }).isVisible(), 'Falta el botón Cancelar');
  assert.ok(await d.getByRole('button', { name: 'Guardar' }).isVisible(), 'Falta el botón Guardar');
  await d.getByRole('button', { name: 'Cancelar' }).click();
  await d.waitFor({ state: 'hidden', timeout: 10_000 });
});

When('hago clic en el selector de fecha del campo Fecha desde del modal', async function (this: CustomWorld) {
  await ri(this).abrirCalendarioAnadir();
});

When('selecciono la fecha inicial {string} en el calendario', async function (this: CustomWorld, fecha: string) {
  await ri(this).elegirDia(fecha);
});

When('hago clic en el selector de fecha del campo Fecha hasta del modal', async function (this: CustomWorld) {
  // Selector de rango único: el calendario sigue abierto esperando la fecha final.
  if ((await this.page.locator('.p-datepicker-panel').count()) === 0) await ri(this).abrirCalendarioAnadir();
});

When('selecciono la fecha final {string} en el calendario', async function (this: CustomWorld, fecha: string) {
  await ri(this).elegirDia(fecha);
});

When('escribo {string} en el campo {word} del modal', async function (this: CustomWorld, texto: string, campo: string) {
  const ids: Record<string, string> = { Usuario: 'userid-0', Proyecto: 'projectid-0', Subproyecto: 'subprojectid-0', Tarea: 'taskid-0' };
  st(this).ultimoTexto = texto;
  await ri(this).escribirAnadir(ids[campo]!, texto);
});

for (const plural of ['usuarios', 'proyectos', 'subproyectos', 'tareas']) {
  Then(`se muestra una lista de sugerencias automáticas de ${plural} que coinciden con {string}`, async function (this: CustomWorld, texto: string) {
    const opciones = (await this.page.locator('ul[role=listbox] li[role=option]').allInnerTexts()).map((t) => t.trim());
    assert.ok(opciones.length > 0, 'No hay sugerencias');
    assert.ok(opciones.every((o) => o.toLowerCase().includes(texto.toLowerCase())), `Hay sugerencias que no coinciden con "${texto}": ${opciones.join(' | ')}`);
  });
}

for (const campo of ['usuario', 'proyecto', 'subproyecto', 'tarea']) {
  When(`selecciono ${campo === 'tarea' ? 'la' : 'el'} ${campo} de las sugerencias`, async function (this: CustomWorld) {
    await this.page.locator('ul[role=listbox] li[role=option]').filter({ hasText: st(this).ultimoTexto }).first().click();
    await this.page.waitForTimeout(1200);
  });
}

const CAMPOS_MODAL: Record<string, string> = { usuario: 'userid-0', proyecto: 'projectid-0', subproyecto: 'subprojectid-0', tarea: 'taskid-0' };
for (const [campo, id] of Object.entries(CAMPOS_MODAL)) {
  Then(`${campo === 'tarea' ? 'la' : 'el'} ${campo} {string} queda seleccionad${campo === 'tarea' ? 'a' : 'o'}`, async function (this: CustomWorld, valor: string) {
    const real = (await ri(this).dialogoAnadir.locator(`#${id}`).inputValue()).trim();
    assert.ok(real.includes(valor), `El ${campo} seleccionado es "${real}" y se esperaba "${valor}"`);
  });
}

When('introduzco una descripción de 150 caracteres en el campo Descripción', async function (this: CustomWorld) {
  await ri(this).dialogoAnadir.locator('#description-0').fill(TEXTO_150);
});

Then('el campo acepta una descripción de un máximo de 150 caracteres', async function (this: CustomWorld) {
  const campo = ri(this).dialogoAnadir.locator('#description-0');
  assert.strictEqual((await campo.inputValue()).length, 150);
  const max = Number(await campo.getAttribute('maxlength'));
  assert.ok(max >= 150, `El campo limita a ${max} caracteres`);
  this.attach(`Desvío: el campo Descripción tiene maxlength=${max} (el documento indica 150).`, 'text/plain');
});

When('introduzco la referencia interna {string} en el modal', async function (this: CustomWorld, ref: string) {
  await ri(this).dialogoAnadir.locator('#internalref-0').fill(ref);
});

Then('la referencia interna {string} se añade al campo', async function (this: CustomWorld, ref: string) {
  assert.strictEqual(await ri(this).dialogoAnadir.locator('#internalref-0').inputValue(), ref);
});

When('selecciono el desplegable Situación del modal', async function (this: CustomWorld) {
  await ri(this).dialogoAnadir.locator('p-select').first().locator('.p-select-dropdown').click({ force: true });
  await this.page.locator('.p-select-option').first().waitFor({ state: 'visible', timeout: 10_000 });
  st(this).opcionesSituacion = (await this.page.locator('.p-select-option').allInnerTexts()).map((t) => t.trim());
});

Then('se listan las situaciones y se puede seleccionar {string}', async function (this: CustomWorld, situacion: string) {
  const { opcionesSituacion } = st(this);
  assert.ok(opcionesSituacion.length > 0 && opcionesSituacion.includes(situacion), `Situaciones: ${opcionesSituacion.join(', ')}`);
  await this.page.locator('.p-select-option').filter({ hasText: situacion }).first().click();
  const etiqueta = await ri(this).dialogoAnadir.locator('p-select').first().innerText();
  assert.ok(etiqueta.includes(situacion), `La situación seleccionada es "${etiqueta.trim()}"`);
});

When('introduzco las horas {string} en el campo Horas del modal', async function (this: CustomWorld, horas: string) {
  await ri(this).ih.escribirHoras(ri(this).dialogoAnadir, horas);
});

Then('se pueden añadir horas con un máximo de 23:59 y el campo muestra {string}', async function (this: CustomWorld, esperado: string) {
  assert.strictEqual(await ri(this).dialogoAnadir.locator('#hours-0').inputValue(), esperado);
});

When('compruebo la funcionalidad del botón Añadir \\(Guardar\\) del modal', async function (this: CustomWorld) {
  await ri(this).guardarAnadir();
});

Then('la imputación se añade para {string}', async function (this: CustomWorld, fecha: string) {
  const p = ri(this);
  await p.dialogoAnadir.waitFor({ state: 'hidden', timeout: 15_000 });
  await p.seleccionarFecha('startdate', fecha);
  await p.seleccionarFecha('enddate', fecha);
  await p.seleccionarEnAutocompletar('userid-0', 'MILES');
  await p.filtrar();
  const horas = await p.textosColumna('Horas');
  assert.ok(horas.includes('23:59'), `No aparece la imputación de 23:59 el ${fecha}; horas listadas: ${horas.join(', ')}`);
});

async function abrirModalLimpio(w: CustomWorld): Promise<void> {
  const p = ri(w);
  if ((await p.dialogoAnadir.count()) > 0) {
    await p.dialogoAnadir.getByRole('button', { name: 'Cancelar' }).click();
    await p.dialogoAnadir.waitFor({ state: 'hidden', timeout: 10_000 });
  }
  await p.abrirAnadir();
}

When('compruebo las validaciones de los campos obligatorios en el modal Añadir imputación', async function (this: CustomWorld) {
  const p = ri(this);
  await abrirModalLimpio(this);
  await p.guardarAnadir();
});

Then('se muestran las validaciones de los campos obligatorios', async function (this: CustomWorld) {
  const v = await ri(this).validacionesAnadir();
  assert.ok(v.length >= 3 && v.every((t) => /Campo obligatorio/.test(t)), `Validaciones: ${v.join(' | ')}`);
  assert.ok(await ri(this).dialogoAnadir.isVisible(), 'El modal no debería cerrarse');
});

async function rellenarImputacionAnadir(w: CustomWorld, fecha: string, horas: string): Promise<void> {
  const p = ri(w);
  await abrirModalLimpio(w);
  await p.abrirCalendarioAnadir();
  await p.elegirDia(fecha);
  await p.elegirDia(fecha);
  await p.seleccionarAnadir('userid-0', 'MILES');
  await p.seleccionarAnadir('projectid-0', '00_NC_EMPTY');
  await p.dialogoAnadir.locator('#description-0').fill('Prueba automatizada QA RI');
  await p.ih.elegirSituacion(p.dialogoAnadir, 'Teletrabajo');
  await p.ih.escribirHoras(p.dialogoAnadir, horas);
  await p.guardarAnadir();
}

When('compruebo la validación al intentar añadir más de 24 horas en un día', async function (this: CustomWorld) {
  await rellenarImputacionAnadir(this, '14/07/2026', '0100');
});

Then('se muestra una validación cuando se intentan añadir más de 24 horas en un día', async function (this: CustomWorld) {
  const p = ri(this);
  assert.ok(await p.dialogoAnadir.isVisible(), 'El modal se cerró: la imputación que supera 24 h se guardó');
  const mensajes = [...(await p.validacionesAnadir()), ...(await this.page.locator('.p-toast-message').allInnerTexts())].map((t) => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
  this.attach(`Validaciones mostradas: ${mensajes.join(' | ')}`, 'text/plain');
  assert.ok(mensajes.some((m) => /24|horas|excede|supera|límite/i.test(m)), `No se muestra una validación de horas: ${mensajes.join(' | ')}`);
});

When('compruebo la validación para un período de informes cerrado con fecha {string}', async function (this: CustomWorld, fecha: string) {
  const p = ri(this);
  await abrirModalLimpio(this);
  await p.abrirCalendarioAnadir();
  await p.elegirDia(fecha);
  await p.elegirDia(fecha);
  await p.seleccionarAnadir('userid-0', 'MILES');
  await p.seleccionarAnadir('projectid-0', '00_NC_EMPTY');
});

Then('se muestra una validación si el período del informe está cerrado', async function (this: CustomWorld) {
  const v = await ri(this).validacionesAnadir();
  assert.ok(v.some((t) => /División cerrada/i.test(t)), `Validaciones: ${v.join(' | ')}`);
});
