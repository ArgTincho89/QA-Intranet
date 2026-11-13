import type { Locator, Page } from 'playwright';
import { ImputacionHorasPage } from './imputacion-horas.page';

export type CampoFecha = 'startdate' | 'enddate';
export type RangoFechas = 'dateRange' | 'currentMonth' | 'currentWeek';

export const COLUMNAS = [
  'Fecha', 'Div. U.', 'Nº personal', 'Usuario', 'Categoría', 'Div. P.', 'Proyecto', 'Subproyecto',
  'Tarea', 'Descripción', 'Situación', 'Horas', 'Gastos', 'Creador', 'Editor',
] as const;

/** Clave `data-col-key` de cada columna de la tabla de resultados. */
export const CLAVE_COLUMNA: Record<string, string> = {
  'Fecha': 'date', 'Div. U.': 'userdivision', 'Nº personal': 'externalworkernumber', 'Usuario': 'user',
  'Categoría': 'category', 'Div. P.': 'division', 'Proyecto': 'project', 'Subproyecto': 'subproject',
  'Tarea': 'task', 'Descripción': 'description', 'Situación': 'situation', 'Horas': 'hours',
  'Gastos': 'expenses', 'Creador': 'creator', 'Editor': 'editor',
};

export function formatoFecha(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/** "dd/mm/yyyy" → Date (hora local, mediodía para evitar saltos de zona horaria). */
export function aFecha(texto: string): Date {
  const m = texto.trim().match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!m) throw new Error(`Fecha no reconocida: "${texto}"`);
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), 12);
}

export function rangoMesActual(hoy = new Date()): { desde: string; hasta: string } {
  return {
    desde: formatoFecha(new Date(hoy.getFullYear(), hoy.getMonth(), 1)),
    hasta: formatoFecha(new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)),
  };
}

/** Semana de lunes a domingo, igual que el botón "Semana actual" de la pantalla. */
export function rangoSemanaActual(hoy = new Date()): { desde: string; hasta: string } {
  const offset = (hoy.getDay() + 6) % 7;
  const lunes = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - offset);
  const domingo = new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate() + 6);
  return { desde: formatoFecha(lunes), hasta: formatoFecha(domingo) };
}

export class ResumenImputacionesPage {
  readonly ih: ImputacionHorasPage;

  constructor(private readonly page: Page) {
    this.ih = new ImputacionHorasPage(page);
  }

  // ---------- Localizadores ----------
  get titulo(): Locator { return this.page.locator('h3 strong').filter({ hasText: 'Resumen de imputaciones' }); }
  get acordeonFiltros(): Locator { return this.page.locator('p-accordion-header'); }
  get botonFiltrar(): Locator { return this.page.locator('#filter-btn'); }
  get botonLimpiar(): Locator { return this.page.locator('#clear-filter-btn'); }
  get botonExportar(): Locator { return this.page.locator('#export-excel-btn'); }
  get botonAnadir(): Locator { return this.page.locator('#add-imputation-btn'); }
  get botonGuardarVista(): Locator { return this.page.locator('#save-projection-btn'); }
  get botonBorrarVista(): Locator { return this.page.locator('#delete-projection-btn'); }
  get filas(): Locator { return this.page.locator('tbody.p-datatable-tbody tr:has(td[data-col-key])'); }
  get cabeceras(): Locator { return this.page.locator('#custom-table-component thead th'); }
  get dialogo(): Locator { return this.page.locator('.p-dialog').last(); }
  get dialogoAnadir(): Locator { return this.page.locator('.p-dialog.modal-imputation'); }
  get campos(): Locator { return this.page.locator('#multiselect-columnidlist-0'); }

  vista(nombre: string): Locator { return this.page.locator(`.scroller-item[title="${nombre}"]`); }
  campoFecha(campo: CampoFecha): Locator { return this.page.locator(`#${campo}-0`); }
  celdas(columna: string): Locator { return this.filas.locator(`td[data-col-key="${CLAVE_COLUMNA[columna]}"]`); }
  cabecera(columna: string): Locator { return this.cabeceras.filter({ hasText: columna }).first(); }

  async esperarCarga(): Promise<void> {
    await this.page.locator('#startdate-0').waitFor({ state: 'visible', timeout: 60_000 });
    await this.titulo.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async ir(): Promise<void> {
    await this.page.locator('.custom-card#imputation-summary').click({ timeout: 60_000 });
    await this.esperarCarga();
  }

  // ---------- Fechas ----------
  async abrirCalendario(campo: CampoFecha): Promise<void> {
    await this.page.locator(`#calendar-${campo}-0 .p-datepicker-dropdown`).click();
    await this.page.locator('.p-datepicker-panel, .p-datepicker').last().waitFor({ state: 'visible', timeout: 10_000 });
  }

  async calendarioAbierto(): Promise<boolean> {
    return this.page.locator('.p-datepicker-panel, .p-datepicker-calendar-container').first().isVisible();
  }

  async elegirDia(fecha: string): Promise<void> {
    const d = aFecha(fecha);
    await this.ih.irAMes(d.getMonth(), d.getFullYear());
    await this.page
      .locator('.p-datepicker-day-cell:not(.p-datepicker-other-month) span.p-datepicker-day')
      .filter({ hasText: new RegExp(`^\\s*${d.getDate()}\\s*$`) })
      .first()
      .click();
    await this.page.waitForTimeout(500);
  }

  async seleccionarFecha(campo: CampoFecha, fecha: string): Promise<void> {
    await this.abrirCalendario(campo);
    await this.elegirDia(fecha);
  }

  async fechas(): Promise<{ desde: string; hasta: string }> {
    return {
      desde: (await this.campoFecha('startdate').inputValue()).trim(),
      hasta: (await this.campoFecha('enddate').inputValue()).trim(),
    };
  }

  async elegirRango(rango: RangoFechas): Promise<void> {
    const boton = this.page.locator('p-togglebutton').filter({ has: this.page.locator(`#${rango}`) });
    for (let intento = 0; intento < 3; intento++) {
      await boton.click({ force: true });
      await this.page.waitForTimeout(1200);
      if (rango === 'dateRange' || (await this.campoFecha('startdate').inputValue()).trim() !== '') return;
    }
  }

  // ---------- Filtros ----------
  async esperarFiltrarHabilitado(): Promise<void> {
    // El botón se habilita con retardo tras fijar las fechas.
    await this.botonFiltrar.and(this.page.locator(':not([disabled])')).waitFor({ state: 'visible', timeout: 20_000 });
  }

  async filtrar(): Promise<void> {
    await this.esperarFiltrarHabilitado();
    await this.botonFiltrar.click();
    await this.esperarResultados();
  }

  async esperarResultados(): Promise<void> {
    await this.page.waitForTimeout(1500);
    await this.page.locator('tbody.p-datatable-tbody tr').first().waitFor({ state: 'visible', timeout: 30_000 });
  }

  async limpiar(): Promise<void> {
    await this.botonLimpiar.click();
    await this.page.waitForTimeout(2000);
  }

  async textoFiltrosActivos(): Promise<string> {
    return (await this.acordeonFiltros.innerText()).replace(/\s+/g, ' ').trim();
  }

  async escribirEnAutocompletar(id: string, texto: string): Promise<Locator> {
    const campo = this.page.locator(`#${id}`);
    await campo.click();
    await campo.fill('');
    await campo.pressSequentially(texto, { delay: 60 });
    const opcion = this.page.locator('ul[role=listbox] li[role=option]').filter({ hasText: texto }).first();
    await opcion.waitFor({ state: 'visible', timeout: 20_000 });
    return opcion;
  }

  async seleccionarEnAutocompletar(id: string, texto: string): Promise<void> {
    const opcion = await this.escribirEnAutocompletar(id, texto);
    await opcion.click();
    await this.page.waitForTimeout(800);
  }

  async valorCampo(id: string): Promise<string> {
    return (await this.page.locator(`#${id}`).inputValue()).trim();
  }

  // ---------- Selección de campos ----------
  async abrirCampos(): Promise<void> {
    await this.campos.locator('.p-multiselect-dropdown').click();
    await this.page.locator('.p-multiselect-panel, .p-multiselect-overlay').last().waitFor({ state: 'visible', timeout: 10_000 });
  }

  async cerrarCampos(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(500);
  }

  async seleccionarTodosLosCampos(): Promise<void> {
    await this.abrirCampos();
    await this.page.locator('.p-multiselect-header .p-checkbox').click();
    await this.cerrarCampos();
  }

  async alternarCampo(nombre: string): Promise<void> {
    await this.page.locator('.p-multiselect-option').filter({ hasText: new RegExp(`^\\s*${nombre}\\s*$`) }).first().click({ force: true });
    await this.page.waitForTimeout(200);
  }

  async etiquetaCampos(): Promise<string> {
    return (await this.campos.locator('.p-multiselect-label').innerText()).trim();
  }

  // ---------- Tabla ----------
  async textosColumna(columna: string): Promise<string[]> {
    return (await this.celdas(columna).locator('.text-content').allInnerTexts()).map((t) => t.trim());
  }

  async cabecerasVisibles(): Promise<string[]> {
    return (await this.cabeceras.allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim()).filter((t) => t && t !== 'Acciones');
  }

  async ordenarPor(columna: string, sentido: 'ascending' | 'descending'): Promise<void> {
    const th = this.cabecera(columna);
    for (let i = 0; i < 4; i++) {
      if ((await th.getAttribute('aria-sort')) === sentido) return;
      await th.click();
      await this.page.waitForTimeout(2500);
    }
    throw new Error(`No se pudo ordenar "${columna}" en sentido ${sentido}`);
  }

  async arrastrarColumna(origen: string, destino: string): Promise<void> {
    await this.cabecera(origen).dragTo(this.cabecera(destino));
    await this.page.waitForTimeout(800);
  }

  async irAPagina(n: number): Promise<void> {
    await this.page.locator('.p-paginator').first().locator('button.p-paginator-page').filter({ hasText: new RegExp(`^\\s*${n}\\s*$`) }).click();
    await this.page.waitForTimeout(2500);
  }

  // ---------- Vistas ----------
  async abrirGuardarVista(): Promise<void> {
    await this.botonGuardarVista.click();
    await this.page.locator('.p-dialog').filter({ hasText: 'Guardar vista' }).waitFor({ state: 'visible', timeout: 10_000 });
  }

  get dialogoVista(): Locator { return this.page.locator('.p-dialog').filter({ hasText: 'Guardar vista' }); }

  async guardarVistaNueva(nombre: string, generica = false): Promise<void> {
    await this.abrirGuardarVista();
    const d = this.dialogoVista;
    if ((await d.locator('#option-create').count()) > 0) await d.locator('label[for="option-create"]').click();
    await d.locator('#projection-name').fill(nombre);
    if (generica) await d.locator('#projection-generic').click();
    await this.confirmarGuardarVista();
  }

  async confirmarGuardarVista(): Promise<void> {
    const d = this.dialogoVista;
    await d.locator('.btns-block .btn-blue').click();
    await d.waitFor({ state: 'hidden', timeout: 15_000 });
    await this.page.waitForTimeout(1500);
  }

  async seleccionarVista(nombre: string): Promise<void> {
    await this.vista(nombre).click();
    await this.page.waitForTimeout(2000);
  }

  async borrarVista(nombre: string): Promise<void> {
    await this.seleccionarVista(nombre);
    await this.botonBorrarVista.click();
    await this.page.locator('#delete-confirmation-btn').click();
    await this.vista(nombre).waitFor({ state: 'detached', timeout: 15_000 });
  }

  /** Crea una vista mínima (rango del mes actual) con el nombre dado. */
  async crearVistaDePrueba(nombre: string, generica = false): Promise<void> {
    await this.elegirRango('currentMonth');
    await this.esperarFiltrarHabilitado();
    await this.guardarVistaNueva(nombre, generica);
  }

  async nombresVistas(): Promise<string[]> {
    return this.page.locator('.scroller-item').evaluateAll((els) => els.map((e) => e.getAttribute('title') ?? ''));
  }

  // ---------- Añadir imputación ----------
  async abrirAnadir(): Promise<void> {
    await this.botonAnadir.click();
    await this.dialogoAnadir.waitFor({ state: 'visible', timeout: 15_000 });
  }

  async abrirCalendarioAnadir(): Promise<void> {
    await this.dialogoAnadir.locator('#calendar-fromdate-0 .p-datepicker-dropdown').click();
    await this.page.locator('.p-datepicker-panel').last().waitFor({ state: 'visible', timeout: 10_000 });
  }

  async valorFechaAnadir(): Promise<string> {
    return (await this.dialogoAnadir.locator('#fromdate-0').inputValue()).trim();
  }

  async escribirAnadir(id: string, texto: string): Promise<Locator> {
    const campo = this.dialogoAnadir.locator(`#${id}`);
    await campo.click();
    await campo.fill('');
    await campo.pressSequentially(texto, { delay: 60 });
    const opcion = this.page.locator('ul[role=listbox] li[role=option]').filter({ hasText: texto }).first();
    await opcion.waitFor({ state: 'visible', timeout: 20_000 });
    return opcion;
  }

  async seleccionarAnadir(id: string, texto: string): Promise<void> {
    const opcion = await this.escribirAnadir(id, texto);
    await opcion.click();
    await this.page.waitForTimeout(1000);
  }

  async guardarAnadir(): Promise<void> {
    await this.dialogoAnadir.getByRole('button', { name: 'Guardar' }).click();
    await this.page.waitForTimeout(2500);
  }

  async validacionesAnadir(): Promise<string[]> {
    return (await this.dialogoAnadir.locator('.validation-error').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
  }
}
