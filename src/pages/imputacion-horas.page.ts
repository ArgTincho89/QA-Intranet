import type { Locator, Page } from 'playwright';

export const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export type EstadoDia = 'hoy' | 'seleccionado' | 'incompleto' | 'completo' | 'fin de semana' | 'festivo';

const CLASE_ESTADO: Record<Exclude<EstadoDia, 'seleccionado'>, RegExp> = {
  hoy: /state-today/,
  incompleto: /state-incomplete/,
  completo: /state-complete/,
  'fin de semana': /state-weekend/,
  festivo: /state-festive/,
};

export function numeroMes(nombre: string): number {
  const i = MESES.indexOf(nombre.trim().toLowerCase());
  if (i < 0) throw new Error(`Mes desconocido: "${nombre}"`);
  return i;
}

/** "01:30" / "1:30h" → minutos */
export function aMinutos(texto: string): number {
  const m = texto.match(/(\d{1,3}):(\d{2})/);
  if (!m) throw new Error(`Formato de horas no reconocido: "${texto}"`);
  return Number(m[1]) * 60 + Number(m[2]);
}

export function aNumero(texto: string): number {
  const limpio = texto.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  return limpio === '' ? 0 : Number(limpio);
}

export class ImputacionHorasPage {
  constructor(private readonly page: Page) {}

  get simple(): Locator { return this.page.locator('.simple-tab'); }
  get formulario(): Locator { return this.simple.locator('.imputation-wrapper-card').first(); }
  get tabla(): Locator { return this.simple.locator('table.p-datatable-table').first(); }
  get filas(): Locator { return this.tabla.locator('tbody tr.selectable'); }
  get dialogo(): Locator { return this.page.locator('.p-dialog').last(); }
  get dialogoEdicion(): Locator { return this.page.locator('.p-dialog.modal-imputation'); }
  get dialogoCopia(): Locator { return this.page.locator('.p-dialog.modal-day-copy'); }
  get paginador(): Locator { return this.simple.locator('p-paginator, .p-paginator'); }

  pestana(nombre: string): Locator { return this.page.locator('p-tab').filter({ hasText: nombre }).first(); }

  async esperarCarga(): Promise<void> {
    await this.page
      .locator('.p-datepicker-day-cell:not(.p-datepicker-other-month) span.p-datepicker-day')
      .first()
      .waitFor({ state: 'visible', timeout: 60_000 });
    await this.page.waitForTimeout(800);
  }

  // ---------- Calendario ----------
  async mesVisible(): Promise<{ mes: number; anio: number }> {
    const mes = (await this.page.locator('.p-datepicker-select-month').first().innerText()).trim();
    const anio = (await this.page.locator('.p-datepicker-select-year').first().innerText()).trim();
    return { mes: numeroMes(mes), anio: Number(anio) };
  }

  async irAMes(mes: number, anio: number): Promise<void> {
    for (let i = 0; i < 60; i++) {
      const v = await this.mesVisible();
      const diff = (anio - v.anio) * 12 + (mes - v.mes);
      if (diff === 0) return;
      await this.page.locator(diff < 0 ? '.p-datepicker-prev-button' : '.p-datepicker-next-button').first().click({ force: true });
      await this.page.waitForTimeout(350);
    }
    throw new Error(`No se pudo navegar a ${MESES[mes]} de ${anio}`);
  }

  celdaDia(dia: number): Locator {
    return this.page
      .locator('.p-datepicker-day-cell:not(.p-datepicker-other-month)')
      .filter({ has: this.page.locator('span.p-datepicker-day').filter({ hasText: new RegExp(`^\\s*${dia}(\\s|$)`) }) })
      .first();
  }

  async seleccionarDia(dia: number): Promise<void> {
    await this.celdaDia(dia).locator('span.p-datepicker-day').first().click();
    await this.page.waitForTimeout(1500);
  }

  async irADia(dia: number, mes: number, anio: number): Promise<void> {
    await this.irAMes(mes, anio);
    await this.seleccionarDia(dia);
  }

  async clasesDia(dia: number): Promise<string> {
    return this.celdaDia(dia).evaluate((el) => {
      const todas = [el as HTMLElement, ...Array.from(el.querySelectorAll('*'))] as HTMLElement[];
      return todas.map((e) => e.className?.toString() ?? '').join(' ');
    });
  }

  async tieneEstado(dia: number, estado: EstadoDia): Promise<boolean> {
    if (estado === 'seleccionado') return /selected|highlight/.test(await this.clasesDia(dia));
    return CLASE_ESTADO[estado].test(await this.clasesDia(dia));
  }

  /** Color de fondo efectivo (rgb) del día: el primer fondo no transparente entre el span interior y la celda. */
  async colorFondoDia(dia: number): Promise<[number, number, number]> {
    return this.celdaDia(dia).evaluate((el) => {
      const candidatos = [...Array.from(el.querySelectorAll('*')).reverse(), el] as HTMLElement[];
      for (const e of candidatos) {
        const c = getComputedStyle(e).backgroundColor;
        const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (m && (m[4] === undefined || Number(m[4]) > 0)) return [Number(m[1]), Number(m[2]), Number(m[3])] as [number, number, number];
      }
      return [255, 255, 255] as [number, number, number];
    });
  }

  /**
   * El tiempo imputado no es texto del DOM: se pinta con CSS a partir de una clase `hour-HH-MM`
   * (ver imputation-calendar.component.ts `getClassListByState`), consumida por un `::before`/
   * `::after` con `content: var(--hour-label)`. `innerText()` nunca la ve.
   */
  async horasDia(dia: number): Promise<number> {
    const clases = await this.clasesDia(dia);
    const m = clases.match(/hour-(\d{1,3})-(\d{2})\b/);
    return m ? Number(m[1]) * 60 + Number(m[2]) : 0;
  }

  async totalHorasCalendario(): Promise<number> {
    const clasesPorCelda = await this.page
      .locator('.p-datepicker-day-cell:not(.p-datepicker-other-month)')
      .evaluateAll((els) =>
        els.map((e) => {
          const todas = [e as HTMLElement, ...Array.from(e.querySelectorAll('*'))] as HTMLElement[];
          return todas.map((x) => x.className?.toString() ?? '').join(' ');
        })
      );
    return clasesPorCelda.reduce((acc, clases) => {
      const m = clases.match(/hour-(\d{1,3})-(\d{2})\b/);
      return acc + (m ? Number(m[1]) * 60 + Number(m[2]) : 0);
    }, 0);
  }

  async abrirLeyenda(): Promise<string> {
    await this.page.locator('#info').first().click({ force: true });
    const pop = this.page.locator('.p-popover, .p-overlay, p-popover').last();
    await pop.waitFor({ state: 'visible', timeout: 10_000 });
    return (await pop.innerText()).replace(/\s+/g, ' ');
  }

  // ---------- Tabla ----------
  async textosFilas(columna: string): Promise<string[]> {
    return (await this.filas.locator(`td[data-col-key="${columna}"]`).allInnerTexts()).map((t) => t.trim());
  }

  async totalHorasTabla(): Promise<number> {
    // La etiqueta "Total horas:" y el valor ("0:30h") son nodos de texto hermanos, no el mismo
    // elemento: hay que leer el contenedor padre, no el <span> que solo tiene la etiqueta.
    const t = await this.simple.getByText(/Total horas/).first().locator('xpath=..').innerText();
    return aMinutos(t);
  }

  async abrirMenuFila(indice = 0): Promise<void> {
    await this.filas.nth(indice).locator('.action-wrapper').first().click();
    await this.page.locator('p-tieredmenu, .p-tieredmenu').last().waitFor({ state: 'visible', timeout: 10_000 });
  }

  async elegirOpcionMenuFila(opcion: string): Promise<void> {
    await this.page.locator('.p-tieredmenu').last().getByText(opcion, { exact: true }).first().click();
    await this.page.waitForTimeout(800);
  }

  async textoOpcionesMenuFila(): Promise<string> {
    return (await this.page.locator('.p-tieredmenu').last().innerText()).replace(/\s+/g, ' ');
  }

  // ---------- Formulario ----------
  async elegirAutocompletar(contenedor: Locator, id: string, texto: string): Promise<void> {
    const campo = contenedor.locator(`#${id}`);
    await campo.click();
    await campo.fill('');
    await campo.pressSequentially(texto, { delay: 60 });
    const opcion = this.page.locator('ul[role=listbox] li[role=option]').filter({ hasText: texto }).first();
    await opcion.waitFor({ state: 'visible', timeout: 20_000 });
    await opcion.click();
    await this.page.waitForTimeout(800);
  }

  /** Texto "Categoría X" que muestra el formulario (modo añadir/edición en línea) o el bloque de edición, en cuanto hay un proyecto válido. */
  async categoriaTexto(contenedor: Locator): Promise<string> {
    const texto = (await contenedor.innerText()).replace(/\s+/g, ' ');
    const m = texto.match(/Categor[ií]a\s*:?\s*(\S+)/i);
    return m ? m[1]! : '';
  }

  /** Abre el desplegable (lupa) de un autocompletar y devuelve el texto de las opciones listadas ("Sin opciones disponibles" si no hay). */
  async opcionesAutocompletar(contenedor: Locator, id: string): Promise<string[]> {
    await contenedor.locator(`#${id}`).locator('xpath=ancestor::p-autocomplete').locator('.p-autocomplete-dropdown').click();
    await this.page.locator('ul[role=listbox]').first().waitFor({ state: 'visible', timeout: 15_000 });
    return (await this.page.locator('ul[role=listbox] li').allInnerTexts()).map((t) => t.trim());
  }

  async rellenarImputacion(datos: { proyecto: string; descripcion?: string; horas: string; situacion?: string; refInterna?: string }): Promise<void> {
    await this.elegirAutocompletar(this.formulario, 'projectid-0', datos.proyecto);
    if (datos.descripcion !== undefined) {
      const d = this.formulario.locator('#description-0');
      await d.fill(datos.descripcion);
    }
    if (datos.refInterna !== undefined) await this.formulario.locator('#internalref-0').fill(datos.refInterna);
    await this.elegirSituacion(this.formulario, datos.situacion ?? 'Teletrabajo');
    await this.escribirHoras(this.formulario, datos.horas);
  }

  async elegirSituacion(contenedor: Locator, situacion: string): Promise<void> {
    await contenedor.locator('p-select').first().locator('.p-select-dropdown').click();
    await this.page.locator('p-selectitem, .p-select-option').filter({ hasText: situacion }).first().click();
    await this.page.waitForTimeout(300);
  }

  async escribirHoras(contenedor: Locator, horas: string): Promise<void> {
    const campo = contenedor.locator('#hours-0');
    await campo.click();
    await campo.fill('');
    await campo.pressSequentially(horas.replace(':', ''), { delay: 80 });
    await campo.blur();
  }

  async guardarImputacion(): Promise<void> {
    // Guardar/Limpiar son hermanos de .imputation-wrapper-card (bloque .btns-block aparte), no hijos.
    await this.simple.locator('#save-imputation-btn').click();
    await this.page.waitForTimeout(2000);
  }

  // ---------- Más acciones / día ----------
  async abrirMasAcciones(): Promise<void> {
    await this.simple.locator('#more-actions').first().click();
    await this.page.locator('.p-tieredmenu, .p-menu').last().waitFor({ state: 'visible', timeout: 10_000 });
  }

  async elegirMasAcciones(opcion: string): Promise<void> {
    await this.abrirMasAcciones();
    await this.page.locator('.p-tieredmenu, .p-menu').last().getByText(opcion, { exact: true }).first().click();
    await this.page.waitForTimeout(800);
  }

  // ---------- Gastos ----------
  async subirTicket(indice: number, rutaArchivo: string): Promise<void> {
    await this.dialogo.locator('app-expense').nth(indice).locator('input[type=file]').setInputFiles(rutaArchivo);
    await this.page.waitForTimeout(500);
  }

  async eliminarGasto(indice: number): Promise<void> {
    await this.dialogo.locator('.expense-deletebtn').nth(indice).click();
    await this.page.waitForTimeout(300);
  }

  async anadirGasto(): Promise<void> {
    // Deshabilitado mientras la(s) línea(s) de gasto actuales no sean válidas (expensesFormArray.valid).
    // Se consulta el locator en vivo en cada iteración (nunca un elementHandle congelado, que puede
    // quedar obsoleto si Angular reemplaza el nodo entre renders).
    const boton = this.dialogo.locator('.modal-expense-addmore');
    const limite = Date.now() + 30_000;
    while (Date.now() < limite) {
      const clase = await boton.getAttribute('class').catch(() => null);
      if (clase !== null && !clase.includes('disabled')) break;
      await this.page.waitForTimeout(500);
    }
    await boton.click();
    await this.page.waitForTimeout(300);
  }

  // ---------- Diálogos ----------
  async cerrarDialogos(): Promise<void> {
    for (let i = 0; i < 4; i++) {
      if ((await this.page.locator('.p-dialog').count()) === 0) return;
      await this.page
        .locator('.p-dialog #cancel-confirmation-btn, .p-dialog #cancel-imputation-btn, .p-dialog #cancel-expense-btn, .p-dialog .p-dialog-close-button')
        .last()
        .click({ force: true, timeout: 3000 })
        .catch(() => undefined);
      await this.page.waitForTimeout(500);
    }
  }
}



