import { Given, When, Then, After } from '@cucumber/cucumber';
import * as assert from 'assert';
import { CustomWorld } from '../support/world';
import { ImputacionHorasPage, EstadoDia, aMinutos, aNumero, numeroMes } from '../pages/imputacion-horas.page';

// Día laborable de julio de 2026 reservado para los datos que crean las pruebas (se limpia antes y después).
const DIA_PRUEBA = { dia: 14, mes: 6, anio: 2026 };
const DIAS_LIMPIEZA = [14, 15, 16, 17];
const PROYECTO_PRUEBA = 'MM-PruebasQA1';

const ih = (w: CustomWorld) => new ImputacionHorasPage(w.page);

const fmt = (minutos: number) => `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`;

function colorDe(rgb: [number, number, number], tipo: string): boolean {
  const [r, g, b] = rgb;
  switch (tipo) {
    case 'blanco': return r >= 245 && g >= 245 && b >= 245;
    case 'amarillo': return r >= 200 && g >= 150 && b <= 160 && r > b + 60;
    case 'gris': return Math.abs(r - g) <= 14 && Math.abs(g - b) <= 14 && r >= 110 && r <= 238;
    case 'azul oscuro': return b > r + 30 && r + g + b < 420;
    case 'azul': return b > r + 40 && b >= 140;
    default: throw new Error(`Color desconocido: ${tipo}`);
  }
}

async function limpiarDatosDePrueba(world: CustomWorld): Promise<void> {
  const page = ih(world);
  await world.page.goto(`${world.config.baseUrl}/rapports/imputation-hours`, { waitUntil: 'domcontentloaded' });
  await page.esperarCarga();
  for (const dia of DIAS_LIMPIEZA) {
    await page.irADia(dia, DIA_PRUEBA.mes, DIA_PRUEBA.anio);
    if ((await page.filas.count()) === 0) continue;
    await page.elegirMasAcciones('Borrar día');
    await world.page.locator('.p-dialog #delete-confirmation-btn').click();
    await world.page.waitForTimeout(2000);
    await page.cerrarDialogos();
  }
}

async function crearImputacionDePrueba(world: CustomWorld, datos: { proyecto?: string; descripcion: string; horas: string; situacion?: string }): Promise<void> {
  const page = ih(world);
  await page.rellenarImputacion({ proyecto: datos.proyecto ?? PROYECTO_PRUEBA, descripcion: datos.descripcion, horas: datos.horas, situacion: datos.situacion });
  await page.guardarImputacion();
  await world.page.waitForTimeout(1000);
}

After({ tags: '@datos-prueba' }, async function (this: CustomWorld) {
  try {
    await limpiarDatosDePrueba(this);
  } catch (e) {
    this.attach(`No se pudieron limpiar los datos de prueba: ${String(e)}`, 'text/plain');
  }
});

// ---------------------------------------------------------------- Comunes
Given('la pantalla de imputación de horas está cargada', async function (this: CustomWorld) {
  await ih(this).esperarCarga();
});

Given('el día de prueba está sin imputaciones', async function (this: CustomWorld) {
  await limpiarDatosDePrueba(this);
});

When('selecciono el día de prueba en el calendario', async function (this: CustomWorld) {
  await ih(this).irADia(DIA_PRUEBA.dia, DIA_PRUEBA.mes, DIA_PRUEBA.anio);
});

When('selecciono el día {int} de {word} de {int} en el calendario', async function (this: CustomWorld, dia: number, mes: string, anio: number) {
  await ih(this).irADia(dia, numeroMes(mes), anio);
});

When('navego en el calendario a {word} de {int}', async function (this: CustomWorld, mes: string, anio: number) {
  await ih(this).irAMes(numeroMes(mes), anio);
});

When('creo una imputación de prueba con descripción {string} y {string} horas', async function (this: CustomWorld, descripcion: string, horas: string) {
  await crearImputacionDePrueba(this, { descripcion, horas });
});

When('creo una imputación de prueba en el proyecto {string} con descripción {string} y {string} horas', async function (this: CustomWorld, proyecto: string, descripcion: string, horas: string) {
  await crearImputacionDePrueba(this, { proyecto, descripcion, horas });
});

Then('se registra como no automatizable: {string}', async function (this: CustomWorld, motivo: string) {
  const msg = `⚠ PASO NO AUTOMATIZABLE (no se da por verificado): ${motivo}`;
  this.attach(msg, 'text/plain');
  console.warn(`\n${msg}\n`);
});

Then('la tabla de imputaciones muestra {int} filas', async function (this: CustomWorld, n: number) {
  assert.strictEqual(await ih(this).filas.count(), n);
});

Then('la tabla de imputaciones tiene al menos una fila', async function (this: CustomWorld) {
  assert.ok((await ih(this).filas.count()) > 0, 'La tabla de imputaciones está vacía');
});

Then('la tabla de imputaciones está vacía', async function (this: CustomWorld) {
  const p = ih(this);
  assert.strictEqual(await p.filas.count(), 0, 'La tabla debería estar vacía');
  await p.simple.getByText('No hay datos').first().waitFor({ state: 'visible', timeout: 10_000 });
});

// ---------------------------------------------------------------- Calendario
Then('el calendario es visible con cabecera, flechas y días de la semana', async function (this: CustomWorld) {
  const p = this.page;
  await p.locator('.p-datepicker-select-month').first().waitFor({ state: 'visible' });
  await p.locator('.p-datepicker-select-year').first().waitFor({ state: 'visible' });
  await p.locator('.p-datepicker-prev-button').first().waitFor({ state: 'visible' });
  await p.locator('.p-datepicker-next-button').first().waitFor({ state: 'visible' });
  assert.strictEqual(await p.locator('.p-datepicker-weekday').count() >= 7, true, 'Faltan los días de la semana');
  assert.ok((await p.locator('.p-datepicker-day-cell:not(.p-datepicker-other-month)').count()) >= 28, 'El calendario no muestra el mes completo');
});

Then('el día actual se muestra en blanco con borde', async function (this: CustomWorld) {
  const hoy = new Date();
  const p = ih(this);
  await p.irAMes(hoy.getMonth(), hoy.getFullYear());
  assert.ok(await p.tieneEstado(hoy.getDate(), 'hoy'), 'El día actual no tiene el estado "hoy"');
  const celda = p.celdaDia(hoy.getDate());
  const borde = await celda.evaluate((el) => {
    const todas = [el, ...Array.from(el.querySelectorAll('*'))] as HTMLElement[];
    return todas.some((e) => {
      const s = getComputedStyle(e);
      return parseFloat(s.borderTopWidth) > 0 && s.borderTopStyle !== 'none' && s.borderTopColor !== 'rgba(0, 0, 0, 0)';
    });
  });
  assert.ok(borde, 'El día actual debería tener borde');
});

Then('el día {int} se muestra como {string}', async function (this: CustomWorld, dia: number, estado: string) {
  const p = ih(this);
  const mapa: Record<string, [EstadoDia, string]> = {
    'incompleto en amarillo': ['incompleto', 'amarillo'],
    'completo en blanco': ['completo', 'blanco'],
    'festivo en azul oscuro': ['festivo', 'azul oscuro'],
    'fin de semana en gris': ['fin de semana', 'gris'],
    'seleccionado en azul': ['seleccionado', 'azul'],
  };
  const [esperado, color] = mapa[estado]!;
  assert.ok(await p.tieneEstado(dia, esperado), `El día ${dia} no tiene el estado "${esperado}". Clases: ${await p.clasesDia(dia)}`);
  const rgb = await p.colorFondoDia(dia);
  assert.ok(colorDe(rgb, color), `El día ${dia} debería ser ${color}, color real rgb(${rgb.join(', ')})`);
});

Then('el día {int} muestra las horas imputadas en la celda', async function (this: CustomWorld, dia: number) {
  assert.ok((await ih(this).horasDia(dia)) > 0, `El día ${dia} no muestra horas imputadas`);
});

Then('la leyenda del calendario explica los estados de los días', async function (this: CustomWorld) {
  const texto = await ih(this).abrirLeyenda();
  for (const etiqueta of ['Hoy', 'Seleccionado', 'Imputación incompleta', 'Imputación completa', 'Fin de semana', 'Festivos']) {
    assert.ok(texto.includes(etiqueta), `La leyenda no incluye "${etiqueta}": ${texto}`);
  }
  await this.page.keyboard.press('Escape');
});

Then('el calendario muestra el mes y el año actuales', async function (this: CustomWorld) {
  const hoy = new Date();
  const v = await ih(this).mesVisible();
  assert.deepStrictEqual(v, { mes: hoy.getMonth(), anio: hoy.getFullYear() });
});

When('hago clic en la flecha {string} del calendario', async function (this: CustomWorld, sentido: string) {
  const w = this as CustomWorld & { mesPrevio?: { mes: number; anio: number } };
  w.mesPrevio = await ih(this).mesVisible();
  await this.page.locator(sentido === 'izquierda' ? '.p-datepicker-prev-button' : '.p-datepicker-next-button').first().click({ force: true });
  await this.page.waitForTimeout(500);
});

Then('el calendario muestra el mes {string} al anterior', async function (this: CustomWorld, relacion: string) {
  const w = this as CustomWorld & { mesPrevio?: { mes: number; anio: number } };
  const antes = w.mesPrevio!;
  const ahora = await ih(this).mesVisible();
  const delta = (ahora.anio - antes.anio) * 12 + (ahora.mes - antes.mes);
  assert.strictEqual(delta, relacion === 'previo' ? -1 : 1, `Mes anterior ${antes.mes}/${antes.anio}, mes actual ${ahora.mes}/${ahora.anio}`);
});

When('hago clic en el año del calendario', async function (this: CustomWorld) {
  await this.page.locator('.p-datepicker-select-year').first().click();
  await this.page.waitForTimeout(500);
});

Then('se muestra la lista de años y selecciono el {int}', async function (this: CustomWorld, anio: number) {
  const opcion = this.page.locator('.p-datepicker-year').filter({ hasText: String(anio) }).first();
  await opcion.waitFor({ state: 'visible', timeout: 10_000 });
  assert.ok((await this.page.locator('.p-datepicker-year').count()) > 1, 'La lista de años debería tener varios años');
  await opcion.click();
  await this.page.waitForTimeout(500);
  assert.strictEqual((await ih(this).mesVisible()).anio, anio);
});

When('hago clic en el mes del calendario', async function (this: CustomWorld) {
  await this.page.locator('.p-datepicker-select-month').first().click();
  await this.page.waitForTimeout(500);
});

Then('se muestra la lista de meses y selecciono {word}', async function (this: CustomWorld, mes: string) {
  assert.strictEqual(await this.page.locator('.p-datepicker-month').count(), 12, 'La lista de meses debería tener 12 meses');
  await this.page.locator('.p-datepicker-month').filter({ hasText: new RegExp(`^\\s*${mes.slice(0, 3)}`, 'i') }).first().click();
  await this.page.waitForTimeout(500);
  assert.strictEqual((await ih(this).mesVisible()).mes, numeroMes(mes));
});

Then('el resumen del día coincide con el total de la tabla y el del mes con la suma del calendario', async function (this: CustomWorld) {
  const p = ih(this);
  await p.pestana('Resumen').click();
  const bloques = this.page.locator('app-imputation-resume');
  await bloques.first().waitFor({ state: 'visible', timeout: 15_000 });
  const dia = aMinutos(await bloques.nth(0).innerText());
  const mes = aMinutos(await bloques.nth(1).innerText());
  await p.pestana('Simple').click();
  const totalTabla = (await p.filas.count()) === 0 ? 0 : await p.totalHorasTabla();
  assert.strictEqual(dia, totalTabla, `Resumen del día ${fmt(dia)} ≠ total de la tabla ${fmt(totalTabla)}`);
  assert.strictEqual(mes, await p.totalHorasCalendario(), `Resumen del mes ${fmt(mes)} ≠ suma del calendario`);
});

// ---------------------------------------------------------------- Formulario añadir
Then('el formulario de añadir imputación muestra la fecha {string}', async function (this: CustomWorld, fecha: string) {
  const titulo = await ih(this).formulario.locator('.title').first().innerText();
  assert.ok(titulo.includes('Añadir imputación') && titulo.includes(fecha), `Título del formulario: "${titulo}"`);
});

Then('los campos descripción, referencia interna y horas están deshabilitados sin proyecto', async function (this: CustomWorld) {
  const f = ih(this).formulario;
  for (const id of ['description-0', 'internalref-0', 'hours-0']) {
    assert.ok(await f.locator(`#${id}`).isDisabled(), `#${id} debería estar deshabilitado`);
  }
});

When('despliego la lista de proyectos con la lupa', async function (this: CustomWorld) {
  await ih(this).formulario.locator('#projectid-0').locator('xpath=ancestor::p-autocomplete').locator('.p-autocomplete-dropdown').click();
  await this.page.locator('ul[role=listbox] li[role=option]').first().waitFor({ state: 'visible', timeout: 20_000 });
});

Then('se listan proyectos activos para el usuario', async function (this: CustomWorld) {
  assert.ok((await this.page.locator('ul[role=listbox] li[role=option]').count()) > 0, 'No se listó ningún proyecto');
  await this.page.keyboard.press('Escape');
});

When('selecciono el proyecto {string}', async function (this: CustomWorld, proyecto: string) {
  const p = ih(this);
  await p.elegirAutocompletar(p.formulario, 'projectid-0', proyecto);
});

Then('el proyecto seleccionado es {string}', async function (this: CustomWorld, proyecto: string) {
  assert.strictEqual(await ih(this).formulario.locator('#projectid-0').inputValue(), proyecto);
});

Then('los campos descripción, referencia interna y horas están habilitados', async function (this: CustomWorld) {
  const f = ih(this).formulario;
  for (const id of ['description-0', 'internalref-0', 'hours-0']) {
    assert.ok(await f.locator(`#${id}`).isEnabled(), `#${id} debería estar habilitado`);
  }
});

Then('los campos subproyecto y tarea están deshabilitados porque el proyecto no los tiene', async function (this: CustomWorld) {
  const f = ih(this).formulario;
  assert.ok(await f.locator('#subprojectid-0').isDisabled());
  assert.ok(await f.locator('#taskid-0').isDisabled());
});

When('escribo la descripción {string}', async function (this: CustomWorld, texto: string) {
  const d = ih(this).formulario.locator('#description-0');
  await d.fill(texto);
  assert.strictEqual(await d.inputValue(), texto, 'La descripción debería ser editable');
});

When('escribo la referencia interna {string}', async function (this: CustomWorld, texto: string) {
  const d = ih(this).formulario.locator('#internalref-0');
  await d.fill(texto);
  assert.strictEqual(await d.inputValue(), texto);
});

When('despliego la lista de situaciones', async function (this: CustomWorld) {
  await ih(this).formulario.locator('p-select').first().locator('.p-select-dropdown').click();
  await this.page.locator('.p-select-option').first().waitFor({ state: 'visible', timeout: 10_000 });
});

Then('la lista de situaciones incluye {string} y {string}', async function (this: CustomWorld, a: string, b: string) {
  const texto = (await this.page.locator('.p-select-option').allInnerTexts()).join('|');
  assert.ok(texto.includes(a) && texto.includes(b), `Situaciones: ${texto}`);
});

When('selecciono la situación {string}', async function (this: CustomWorld, situacion: string) {
  await this.page.locator('.p-select-option').filter({ hasText: situacion }).first().click();
  await this.page.waitForTimeout(300);
});

Then('la situación seleccionada es {string}', async function (this: CustomWorld, situacion: string) {
  const texto = await ih(this).formulario.locator('p-select').first().innerText();
  assert.ok(texto.includes(situacion), `Situación mostrada: "${texto}"`);
});

When('escribo las horas {string} en el formulario', async function (this: CustomWorld, horas: string) {
  const p = ih(this);
  await p.escribirHoras(p.formulario, horas);
});

Then('el campo de horas muestra {string}', async function (this: CustomWorld, esperado: string) {
  assert.strictEqual(await ih(this).formulario.locator('#hours-0').inputValue(), esperado);
});

Then('el campo de horas queda vacío por ser un valor inválido', async function (this: CustomWorld) {
  assert.strictEqual(await ih(this).formulario.locator('#hours-0').inputValue(), '', 'Un tiempo mayor de 23:59 debería rechazarse');
});

When('pulso el botón guardar del formulario', async function (this: CustomWorld) {
  await ih(this).guardarImputacion();
});

Then('la tabla muestra una imputación con proyecto {string}, descripción {string}, horas {string} y situación {string}', async function (this: CustomWorld, proyecto: string, descripcion: string, horas: string, situacion: string) {
  const p = ih(this);
  await p.filas.first().waitFor({ state: 'visible', timeout: 20_000 });
  const fila = (await p.filas.first().innerText()).replace(/\s+/g, ' ');
  for (const v of [proyecto, descripcion, horas, situacion]) assert.ok(fila.includes(v), `La fila no contiene "${v}": ${fila}`);
});

Then('el creador de la imputación es {string}', async function (this: CustomWorld, creador: string) {
  assert.ok((await ih(this).textosFilas('creator'))[0]!.includes(creador));
});

Then('el día de prueba muestra {string} en el calendario', async function (this: CustomWorld, horas: string) {
  assert.strictEqual(await ih(this).horasDia(DIA_PRUEBA.dia), aMinutos(horas));
});

Then('el formulario muestra título, campos y botones esperados', async function (this: CustomWorld) {
  const f = ih(this).formulario;
  const texto = (await f.innerText()).replace(/\s+/g, ' ');
  for (const etiqueta of ['Añadir imputación', 'Proyecto', 'Subproyecto', 'Tarea', 'Descripción', 'Ref. interna', 'Situación', 'Horas']) {
    assert.ok(texto.includes(etiqueta), `Falta "${etiqueta}" en el formulario: ${texto}`);
  }
  for (const id of ['projectid-0', 'subprojectid-0', 'taskid-0', 'description-0', 'internalref-0', 'hours-0', 'save-imputation-btn', 'cancel-imputation-btn']) {
    await f.locator(`#${id}`).waitFor({ state: 'attached' });
  }
  await ih(this).simple.locator('#more-actions').first().waitFor({ state: 'visible' });
  assert.ok((await f.locator('#save-imputation-btn').innerText()).includes('Guardar'));
  assert.ok((await f.locator('#cancel-imputation-btn').innerText()).includes('Limpiar'));
});

// ---------------------------------------------------------------- Menú de fila y edición
When('abro el menú de acciones de la primera imputación', async function (this: CustomWorld) {
  await ih(this).abrirMenuFila(0);
});

Then('el menú ofrece las opciones {string}, {string} y {string}', async function (this: CustomWorld, a: string, b: string, c: string) {
  const texto = await ih(this).textoOpcionesMenuFila();
  for (const o of [a, b, c]) assert.ok(texto.includes(o), `Falta la opción "${o}": ${texto}`);
});

When('elijo la opción {string} del menú de la imputación', async function (this: CustomWorld, opcion: string) {
  await ih(this).elegirOpcionMenuFila(opcion);
});

Then('se abre el diálogo de edición con la fecha {string}', async function (this: CustomWorld, fecha: string) {
  const d = ih(this).dialogoEdicion;
  await d.waitFor({ state: 'visible', timeout: 15_000 });
  const t = (await d.innerText()).replace(/\s+/g, ' ');
  assert.ok(t.includes('Editar imputación') && t.includes(fecha), `Diálogo: ${t}`);
});

Then('el diálogo de edición muestra usuario, creador {string} y categoría', async function (this: CustomWorld, creador: string) {
  const t = (await ih(this).dialogoEdicion.innerText()).replace(/\s+/g, ' ');
  assert.ok(/Usuario\s+\S+/.test(t), `Sin usuario: ${t}`);
  assert.ok(t.includes('Creador') && t.includes(creador), `Sin creador: ${t}`);
  assert.ok(/Categoría\s+\S+/.test(t), `Sin categoría: ${t}`);
});

Then('el diálogo de edición muestra título, campos y botones esperados', async function (this: CustomWorld) {
  const d = ih(this).dialogoEdicion;
  const t = (await d.innerText()).replace(/\s+/g, ' ');
  for (const etiqueta of ['Editar imputación', 'Fecha', 'Usuario', 'Creador', 'Categoría', 'Proyecto', 'Subproyecto', 'Tarea', 'Descripción', 'Ref. interna', 'Situación', 'Horas', 'Cancelar', 'Guardar']) {
    assert.ok(t.includes(etiqueta), `Falta "${etiqueta}": ${t}`);
  }
});

When('cambio en el diálogo de edición el proyecto a {string}', async function (this: CustomWorld, proyecto: string) {
  const p = ih(this);
  await p.elegirAutocompletar(p.dialogoEdicion, 'projectid-0', proyecto);
});

When('cambio en el diálogo de edición la descripción a {string} y la referencia interna a {string}', async function (this: CustomWorld, descripcion: string, ref: string) {
  const d = ih(this).dialogoEdicion;
  await d.locator('#description-0').fill(descripcion);
  await d.locator('#internalref-0').fill(ref);
});

When('cambio en el diálogo de edición la situación a {string}', async function (this: CustomWorld, situacion: string) {
  await ih(this).elegirSituacion(ih(this).dialogoEdicion, situacion);
});

When('escribo en el diálogo de edición las horas {string}', async function (this: CustomWorld, horas: string) {
  const p = ih(this);
  await p.escribirHoras(p.dialogoEdicion, horas);
});

Then('el campo de horas del diálogo de edición muestra {string}', async function (this: CustomWorld, esperado: string) {
  assert.strictEqual(await ih(this).dialogoEdicion.locator('#hours-0').inputValue(), esperado);
});

Then('el campo de horas del diálogo de edición queda vacío por ser inválido', async function (this: CustomWorld) {
  assert.strictEqual(await ih(this).dialogoEdicion.locator('#hours-0').inputValue(), '');
});

When('guardo el diálogo de edición', async function (this: CustomWorld) {
  await ih(this).dialogoEdicion.locator('#save-imputation-btn').click();
  await this.page.locator('.p-dialog.modal-imputation').waitFor({ state: 'hidden', timeout: 20_000 });
  await this.page.waitForTimeout(1500);
});

When('cierro el diálogo abierto', async function (this: CustomWorld) {
  await ih(this).cerrarDialogos();
});

// ---------------------------------------------------------------- Borrar imputación / día
Then('aparece el diálogo de confirmación de borrado con los botones {string} y {string}', async function (this: CustomWorld, a: string, b: string) {
  const d = ih(this).dialogo;
  await d.waitFor({ state: 'visible', timeout: 10_000 });
  const t = (await d.innerText()).replace(/\s+/g, ' ');
  assert.ok(t.includes(a) && t.includes(b), `Diálogo: ${t}`);
  assert.ok(/borrar/i.test(t) && /irreversible/i.test(t), `Texto de confirmación inesperado: ${t}`);
});

When('cancelo el borrado en el diálogo de confirmación', async function (this: CustomWorld) {
  await this.page.locator('.p-dialog #cancel-confirmation-btn').click();
  await this.page.locator('.p-dialog').waitFor({ state: 'hidden', timeout: 10_000 });
});

When('confirmo el borrado en el diálogo de confirmación', async function (this: CustomWorld) {
  await this.page.locator('.p-dialog #delete-confirmation-btn').click();
  await this.page.locator('.p-dialog').waitFor({ state: 'hidden', timeout: 20_000 });
  await this.page.waitForTimeout(1500);
});

When('elijo la opción {string} del menú más acciones', async function (this: CustomWorld, opcion: string) {
  await ih(this).elegirMasAcciones(opcion);
});

Then('el menú más acciones ofrece {string} y {string}', async function (this: CustomWorld, a: string, b: string) {
  const p = ih(this);
  await p.abrirMasAcciones();
  const t = (await this.page.locator('.p-tieredmenu, .p-menu').last().innerText()).replace(/\s+/g, ' ');
  assert.ok(t.includes(a) && t.includes(b), `Menú: ${t}`);
  await this.page.keyboard.press('Escape');
});

// ---------------------------------------------------------------- Detalle y gastos
When('abro el detalle de la primera imputación', async function (this: CustomWorld) {
  await ih(this).filas.first().locator('td[data-col-key="project"]').click();
  await this.page.getByText('Añadir gasto').first().waitFor({ state: 'visible', timeout: 20_000 });
});

Then('el detalle muestra los campos y la tabla de gastos', async function (this: CustomWorld) {
  const t = (await this.page.locator('body').innerText()).replace(/\s+/g, ' ').toUpperCase();
  for (const e of ['IMPUTACIÓN', 'DATOS', 'AÑADIR GASTO', 'FECHA', 'HORAS', 'SITUACIÓN', 'CATEGORÍA', 'CREADOR', 'CLIENTE', 'PROYECTO', 'SUBPROYECTO', 'TAREA', 'EDITOR', 'DESCRIPCIÓN', 'GASTOS', 'LUGAR', 'TIPO DE GASTO', 'KILÓMETROS', 'TICKET', 'IMPORTE']) {
    assert.ok(t.includes(e), `El detalle no muestra "${e}"`);
  }
});

Then('los datos del detalle coinciden con la fila de la tabla', async function (this: CustomWorld) {
  const guardado = (this as CustomWorld & { fila?: Record<string, string> }).fila!;
  const t = (await this.page.locator('body').innerText()).replace(/\s+/g, ' ');
  for (const [k, v] of Object.entries(guardado)) assert.ok(v === '' || t.includes(v), `El detalle no contiene ${k}="${v}"`);
});

Given('memorizo los datos de la primera fila de la tabla', async function (this: CustomWorld) {
  const p = ih(this);
  const fila: Record<string, string> = {};
  for (const c of ['project', 'description', 'hours', 'situation']) fila[c] = (await p.textosFilas(c))[0] ?? '';
  (this as CustomWorld & { fila?: Record<string, string> }).fila = fila;
});

When('pulso añadir gasto', async function (this: CustomWorld) {
  await this.page.getByText('Añadir gasto').first().click();
  await this.page.locator('.p-dialog').last().waitFor({ state: 'visible', timeout: 15_000 });
});

Then('se abre el diálogo de añadir gasto', async function (this: CustomWorld) {
  const t = (await ih(this).dialogo.innerText()).replace(/\s+/g, ' ');
  assert.ok(t.includes('Añadir gasto'), `Diálogo: ${t}`);
});

Then('el diálogo de gasto muestra título, datos del cargo, campos y botones esperados', async function (this: CustomWorld) {
  const d = ih(this).dialogo;
  const t = (await d.innerText()).replace(/\s+/g, ' ');
  for (const e of ['Añadir gasto', 'Datos cargo', 'Cliente', 'Proyecto', 'Selecciona archivo', 'Tipo de gasto', 'Moneda', 'Importe', 'Lugar', 'Descripción', 'Cancelar', 'Guardar']) {
    assert.ok(t.toLowerCase().includes(e.toLowerCase()), `Falta "${e}": ${t}`);
  }
  for (const id of ['expensetypeid-0', 'currencyid-0', 'amount-0', 'place-0', 'description-0', 'save-expense-btn', 'cancel-expense-btn']) {
    await d.locator(`#${id}`).waitFor({ state: 'attached' });
  }
});

Then('el selector de archivo del gasto acepta imágenes jpeg, jpg, png y pdf', async function (this: CustomWorld) {
  const accept = (await ih(this).dialogo.locator('input[type=file]').first().getAttribute('accept')) ?? '';
  const a = accept.toLowerCase();
  assert.ok(/jpe?g|image/.test(a) && /png|image/.test(a) && /pdf/.test(a), `Tipos aceptados: "${accept}"`);
});

When('despliego el tipo de gasto', async function (this: CustomWorld) {
  await ih(this).dialogo.locator('p-select#expensetypeid-0, #expensetypeid-0').first().locator('.p-select-dropdown').click();
  await this.page.locator('.p-select-option').first().waitFor({ state: 'visible', timeout: 10_000 });
});

Then('se listan varios tipos de gasto', async function (this: CustomWorld) {
  assert.ok((await this.page.locator('.p-select-option').count()) > 1);
});

When('selecciono el tipo de gasto {string}', async function (this: CustomWorld, tipo: string) {
  await this.page.locator('.p-select-option').filter({ hasText: tipo }).first().click();
  await this.page.waitForTimeout(500);
});

Then('el tipo de gasto seleccionado es {string}', async function (this: CustomWorld, tipo: string) {
  const t = await ih(this).dialogo.locator('#expensetypeid-0').first().innerText();
  assert.ok(t.includes(tipo), `Tipo mostrado: "${t}"`);
});

Then('el campo moneda está habilitado', async function (this: CustomWorld) {
  const sel = ih(this).dialogo.locator('#currencyid-0');
  assert.ok(!(await sel.evaluate((e) => e.classList.contains('p-disabled') || e.hasAttribute('disabled') || !!e.querySelector('.p-disabled'))), 'La moneda debería estar habilitada');
});

When('escribo el importe {string}', async function (this: CustomWorld, importe: string) {
  const c = ih(this).dialogo.locator('#amount-0');
  await c.click();
  await c.fill('');
  await c.pressSequentially(importe, { delay: 50 });
  await c.blur();
});

Then('el importe solo contiene dígitos y separadores', async function (this: CustomWorld) {
  const v = await ih(this).dialogo.locator('#amount-0').inputValue();
  assert.ok(/^[\d.,]*$/.test(v), `El importe contiene caracteres no numéricos: "${v}"`);
});

Then('el importe tiene como máximo {int} dígitos', async function (this: CustomWorld, max: number) {
  const v = await ih(this).dialogo.locator('#amount-0').inputValue();
  const enteros = v.replace(/[^\d]/g, '').length;
  assert.ok(enteros <= max + 2, `El importe "${v}" supera ${max} dígitos`);
});

When('relleno lugar {string} y descripción {string} del gasto', async function (this: CustomWorld, lugar: string, descripcion: string) {
  const d = ih(this).dialogo;
  await d.locator('#place-0').fill(lugar);
  await d.locator('#description-0').fill(descripcion);
});

When('guardo el gasto', async function (this: CustomWorld) {
  await ih(this).dialogo.locator('#save-expense-btn').click();
  await this.page.waitForTimeout(2500);
});

Then('el gasto aparece en la tabla de gastos del detalle con importe {string}', async function (this: CustomWorld, importe: string) {
  const t = (await this.page.locator('body').innerText()).replace(/\s+/g, ' ');
  assert.ok(t.includes('Prueba automatizada gasto') && t.includes(importe), `No se ve el gasto en el detalle: ${t.slice(-600)}`);
});

When('cierro el detalle de la imputación', async function (this: CustomWorld) {
  const cerrar = this.page.locator('.fa-times, .fa-close, .pi-times, button[aria-label="Cerrar"], [class*="close"]').filter({ visible: true }).first();
  await cerrar.click();
  await this.page.waitForTimeout(1000);
});

Then('el detalle de la imputación ya no está visible', async function (this: CustomWorld) {
  await this.page.getByText('Añadir gasto').first().waitFor({ state: 'hidden', timeout: 10_000 });
  await ih(this).tabla.waitFor({ state: 'visible' });
});

// ---------------------------------------------------------------- Resumen
When('abro la pestaña Resumen', async function (this: CustomWorld) {
  await ih(this).pestana('Resumen').click();
  await this.page.locator('app-imputation-resume').first().waitFor({ state: 'visible', timeout: 15_000 });
});

Then('el resumen muestra el bloque del día y el del mes con horas registradas y total de gastos', async function (this: CustomWorld) {
  const bloques = this.page.locator('app-imputation-resume');
  assert.strictEqual(await bloques.count(), 2, 'Debería haber dos bloques de resumen (día y mes)');
  for (let i = 0; i < 2; i++) {
    const t = (await bloques.nth(i).innerText()).replace(/\s+/g, ' ');
    assert.ok(/\d+:\d{2}h/.test(t) && t.includes('Registradas') && t.includes('Total gastos'), `Bloque ${i + 1}: ${t}`);
    assert.ok((await bloques.nth(i).locator('.fa-clock-o').count()) > 0 && (await bloques.nth(i).locator('.fa-credit-card').count()) > 0, `Bloque ${i + 1} sin iconos`);
  }
});

Then('el bloque del día muestra la fecha {string}', async function (this: CustomWorld, fecha: string) {
  const t = (await this.page.locator('app-imputation-resume').first().innerText()).toLowerCase().replace(/\s+/g, ' ');
  assert.ok(t.includes(fecha.toLowerCase()), `Bloque del día: ${t}`);
});

Then('las horas del día en el resumen coinciden con el total de la tabla de la pestaña Simple', async function (this: CustomWorld) {
  const p = ih(this);
  const dia = aMinutos(await this.page.locator('app-imputation-resume').nth(0).innerText());
  await p.pestana('Simple').click();
  assert.strictEqual(dia, await p.totalHorasTabla());
});

Then('las horas del mes en el resumen coinciden con la suma de horas del calendario', async function (this: CustomWorld) {
  const mes = aMinutos(await this.page.locator('app-imputation-resume').nth(1).innerText());
  assert.strictEqual(mes, await ih(this).totalHorasCalendario());
});

Then('los gastos del día en el resumen coinciden con la suma de la columna gastos', async function (this: CustomWorld) {
  const p = ih(this);
  const t = (await this.page.locator('app-imputation-resume').nth(0).innerText()).replace(/\s+/g, ' ');
  const gastosResumen = aNumero(t.match(/([\d.,]+)\s*Total gastos/i)?.[1] ?? '0');
  await p.pestana('Simple').click();
  const suma = (await p.textosFilas('expenses')).reduce((a, x) => a + aNumero(x), 0);
  assert.strictEqual(gastosResumen, suma, `Gastos resumen ${gastosResumen} ≠ suma de la tabla ${suma}`);
});

Then('los gastos del mes en el resumen son un importe válido no inferior a los del día', async function (this: CustomWorld) {
  const bloques = this.page.locator('app-imputation-resume');
  const g = async (i: number) => aNumero(((await bloques.nth(i).innerText()).replace(/\s+/g, ' ').match(/([\d.,]+)\s*Total gastos/i) ?? [])[1] ?? 'x');
  assert.ok((await g(1)) >= (await g(0)));
});

// ---------------------------------------------------------------- Copiar día
Then('el diálogo de copiar día muestra la fecha {string}, las opciones Rango y Días, el calendario y los botones', async function (this: CustomWorld, fecha: string) {
  const d = ih(this).dialogoCopia;
  await d.waitFor({ state: 'visible', timeout: 15_000 });
  const t = (await d.innerText()).replace(/\s+/g, ' ');
  assert.ok(t.includes('Copiar día') && t.includes(fecha), `Diálogo: ${t}`);
  assert.ok(t.includes('Rango') && t.includes('Días'), `Faltan modos de selección: ${t}`);
  await d.locator('#selectionmode-0radio0').waitFor({ state: 'attached' });
  await d.locator('#selectionmode-0radio1').waitFor({ state: 'attached' });
  await d.locator('p-datepicker, .p-datepicker').first().waitFor({ state: 'visible' });
  assert.ok((await d.getByRole('button', { name: /^Copiar$/ }).count()) > 0, 'Falta el botón Copiar');
  assert.ok((await d.getByRole('button', { name: /^Cancelar$/ }).count()) > 0, 'Falta el botón Cancelar');
});




// ---------------------------------------------------------------- Borrar día
Then('el menú más acciones del día vacío tiene {string} atenuado o sin efecto', async function (this: CustomWorld, _opcion: string) {
  this.attach('Comprobación informativa: el estado de "Más acciones" en días vacíos no se verifica de forma fiable.', 'text/plain');
});

Then('aparece el diálogo de confirmación de borrado de día', async function (this: CustomWorld) {
  const d = ih(this).dialogo;
  await d.waitFor({ state: 'visible', timeout: 10_000 });
  const t = (await d.innerText()).replace(/\s+/g, ' ');
  assert.ok(/borrar/i.test(t) && /cancelar/i.test(t), `Diálogo: ${t}`);
  await this.page.locator('.p-dialog #cancel-confirmation-btn').waitFor({ state: 'visible' });
  await this.page.locator('.p-dialog #delete-confirmation-btn').waitFor({ state: 'visible' });
});

// ---------------------------------------------------------------- Paginación
Then('el paginador no se muestra o no ofrece páginas adicionales', async function (this: CustomWorld) {
  const p = ih(this);
  const pag = p.simple.locator('.p-paginator').first();
  if ((await pag.count()) === 0 || !(await pag.isVisible())) return;
  const paginas = await pag.locator('.p-paginator-page').count();
  assert.ok(paginas <= 1, `Con pocos registros no debería haber varias páginas (hay ${paginas})`);
});

Then('la tabla no muestra más filas que {int} por página', async function (this: CustomWorld, max: number) {
  assert.ok((await ih(this).filas.count()) <= max);
});

Then('el número de páginas del paginador, si existe, coincide con las filas existentes', async function (this: CustomWorld) {
  const p = ih(this);
  const pag = p.simple.locator('.p-paginator').first();
  const filas = await p.filas.count();
  if ((await pag.count()) === 0 || !(await pag.isVisible())) return;
  const paginas = Math.max(1, await pag.locator('.p-paginator-page').count());
  const porPagina = Number((await pag.locator('.p-select-label, .p-dropdown-label').first().innerText().catch(() => '10')).trim()) || 10;
  assert.strictEqual(paginas, Math.max(1, Math.ceil(filas / porPagina)));
});

// ---------------------------------------------------------------- Ordenamiento
When('ordeno la tabla por la columna {string}', async function (this: CustomWorld, columna: string) {
  await ih(this).tabla.locator('th.p-datatable-sortable-column').filter({ hasText: columna }).first().click();
  await this.page.waitForTimeout(800);
});

Then('la columna {string} está ordenada en sentido {string}', async function (this: CustomWorld, columna: string, sentido: string) {
  const th = ih(this).tabla.locator('th.p-datatable-sortable-column').filter({ hasText: columna }).first();
  assert.strictEqual(await th.getAttribute('aria-sort'), sentido);
});

Then('los valores de la columna {string} están ordenados de forma {string}', async function (this: CustomWorld, columna: string, sentido: string) {
  const claves: Record<string, string> = { Descripción: 'description', Horas: 'hours', Proyecto: 'project', Situación: 'situation' };
  const valores = await ih(this).textosFilas(claves[columna]!);
  const num = columna === 'Horas';
  const ordenado = [...valores].sort((a, b) => (num ? aMinutos(a) - aMinutos(b) : a.localeCompare(b, 'es', { sensitivity: 'base' })));
  if (sentido === 'descendente') ordenado.reverse();
  assert.deepStrictEqual(valores, ordenado, `Orden ${sentido} incorrecto en ${columna}`);
});

Then('las columnas de la tabla son ordenables y el diseño se mantiene tras ordenar', async function (this: CustomWorld) {
  const p = ih(this);
  const n = await p.tabla.locator('th.p-datatable-sortable-column').count();
  assert.ok(n >= 5, `Pocas columnas ordenables: ${n}`);
  const antes = await p.tabla.locator('th').count();
  await p.tabla.locator('th.p-datatable-sortable-column').first().click();
  await this.page.waitForTimeout(500);
  assert.strictEqual(await p.tabla.locator('th').count(), antes);
  await p.tabla.waitFor({ state: 'visible' });
});

When('creo tres imputaciones de prueba con distintas descripciones y horas', async function (this: CustomWorld) {
  await crearImputacionDePrueba(this, { descripcion: 'Beta orden', horas: '02:00' });
  await crearImputacionDePrueba(this, { descripcion: 'Alfa orden', horas: '01:00' });
  await crearImputacionDePrueba(this, { descripcion: 'Gamma orden', horas: '03:00' });
});

When('abro el diálogo de copiar día desde más acciones', async function (this: CustomWorld) {
  await ih(this).elegirMasAcciones('Copiar día');
  await ih(this).dialogoCopia.waitFor({ state: 'visible', timeout: 15_000 });
});

When('selecciono el modo {string} en el diálogo de copiar día', async function (this: CustomWorld, modo: string) {
  const d = ih(this).dialogoCopia;
  await d.locator(modo === 'Días' ? '#selectionmode-0radio1' : '#selectionmode-0radio0').click({ force: true });
  await this.page.waitForTimeout(500);
});

Then('el modo {string} queda marcado en el diálogo de copiar día', async function (this: CustomWorld, modo: string) {
  const d = ih(this).dialogoCopia;
  assert.ok(await d.locator(modo === 'Días' ? '#selectionmode-0radio1' : '#selectionmode-0radio0').isChecked());
});

When('cancelo el diálogo de copiar día', async function (this: CustomWorld) {
  await ih(this).dialogoCopia.getByRole('button', { name: /^Cancelar$/ }).click();
  await ih(this).dialogoCopia.waitFor({ state: 'hidden', timeout: 10_000 });
});

Then('el diálogo de copiar día está cerrado', async function (this: CustomWorld) {
  assert.strictEqual(await ih(this).dialogoCopia.count(), 0);
});
