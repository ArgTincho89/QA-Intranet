import type { Page } from 'playwright';

export interface ExpectedElement {
  name: string;
  /** Selector CSS; con `text`, el elemento debe además contener ese texto. */
  selector: string;
  text?: string;
}

export interface ModuleSpec {
  /** Id del `div.custom-card` en la home. */
  cardId: string;
  title: string;
  /** Ruta esperada tras el clic (independiente del entorno). */
  path: string;
  elements: ExpectedElement[];
}

/** Catálogo de módulos de la home. Añadir un módulo = una entrada aquí + un escenario TC-MOD-NN. */
export const MODULES: Record<string, ModuleSpec> = {
  'time-record': {
    cardId: 'time-record',
    title: 'Registro horario',
    path: '/time-control/time-record',
    elements: [
      { name: 'título "Registro horario"', selector: 'h3.color-dark-blue strong', text: 'Registro horario' },
      { name: 'bloque de registro del día', selector: '.time-record' },
      { name: 'fecha del registro', selector: '.time-record .time-record-title' },
      { name: 'horas de la jornada', selector: '.time-record .time-record-time' },
      { name: 'subtítulo "Jornada de hoy"', selector: '.time-record .time-record-subtitle', text: 'Jornada de hoy' },
      { name: 'botón de entrada', selector: '#entry-btn' },
      { name: 'tabla de registros', selector: 'table.p-datatable-table' },
      { name: 'columna "Entrada / Salida"', selector: 'table.p-datatable-table thead th', text: 'Entrada / Salida' },
      { name: 'columna "Tipo de registro"', selector: 'table.p-datatable-table thead th', text: 'Tipo de registro' },
      { name: 'columna "Horas"', selector: 'table.p-datatable-table thead th', text: 'Horas' },
    ],
  },
  'record-summary': {
    cardId: 'record-summary',
    title: 'Resumen registros',
    path: '/time-control/record-summary',
    elements: [
      { name: 'título "Resumen de registros"', selector: 'h3.color-dark-blue strong', text: 'Resumen de registros' },
      { name: 'botón "Exportar a Excel"', selector: '#export-excel-btn', text: 'Exportar a Excel' },
      { name: 'cabecera del acordeón "Filtros"', selector: 'p-accordion-header .header-text', text: 'Filtros' },
      { name: 'selector de vistas', selector: 'p-virtualscroller' },
      { name: 'botón "Borrar" vista', selector: '#delete-projection-btn' },
      { name: 'botón "Guardar" vista', selector: '#save-projection-btn' },
      { name: 'filtro "Desde"', selector: '#startdate-0' },
      { name: 'filtro "Hasta"', selector: '#enddate-0' },
      { name: 'filtro "División usuario"', selector: '#divisionid-0' },
      { name: 'filtro "Usuario"', selector: '#userid-0' },
      { name: 'filtro "Estado"', selector: '#multiselect-stateidlist-0' },
      { name: 'filtro "Campos"', selector: '#multiselect-columnidlist-0' },
      { name: 'botón "Limpiar"', selector: '#clear-filter-btn' },
      { name: 'botón "Filtrar"', selector: '#filter-btn' },
      { name: 'tabla de resultados', selector: '#custom-table-component table.p-datatable-table' },
      ...['Fecha', 'Nº personal', 'Usuario', 'Entrada', 'Comida', 'Salida', 'Estado', 'Horas trabajadas'].map((h) => ({
        name: `columna "${h}"`,
        selector: '#custom-table-component table.p-datatable-table thead th',
        text: h,
      })),
    ],
  },
  'imputation-hours': {
    cardId: 'imputation-hours',
    title: 'Imputación horas',
    path: '/rapports/imputation-hours',
    elements: [
      { name: 'título "Imputación horas"', selector: 'h3.color-dark-blue strong', text: 'Imputación horas' },
      { name: 'calendario', selector: '.p-datepicker-panel-inline .p-datepicker-calendar' },
      { name: 'botón "Mes anterior"', selector: '.p-datepicker-prev-button' },
      { name: 'botón "Mes siguiente"', selector: '.p-datepicker-next-button' },
      { name: 'selector de mes', selector: '.p-datepicker-select-month' },
      { name: 'selector de año', selector: '.p-datepicker-select-year' },
      { name: 'día de hoy resaltado', selector: '.p-datepicker-today' },
      { name: 'formulario "Añadir imputación"', selector: '.imputation-wrapper-card .title', text: 'Añadir imputación' },
      { name: 'campo "Proyecto"', selector: '#projectid-0' },
      { name: 'campo "Subproyecto"', selector: '#subprojectid-0' },
      { name: 'campo "Tarea"', selector: '#taskid-0' },
      { name: 'campo "Descripción"', selector: '#description-0' },
      { name: 'campo "Ref. interna"', selector: '#internalref-0' },
      { name: 'campo "Situación"', selector: '#select-situationid-0' },
      { name: 'campo "Horas"', selector: '#hours-0' },
      { name: 'botón "Más acciones"', selector: '#more-actions', text: 'Más acciones' },
      { name: 'botón "Limpiar"', selector: '#cancel-imputation-btn', text: 'Limpiar' },
      { name: 'botón "Guardar"', selector: '#save-imputation-btn', text: 'Guardar' },
      { name: 'tabla de imputaciones', selector: 'table.p-datatable-table' },
      ...['Proyecto', 'Subproyecto', 'Tarea', 'Descripción', 'Horas', 'Gastos', 'Situación', 'Creador', 'Editor', 'Acciones'].map((h) => ({
        name: `columna "${h}"`,
        selector: 'table.p-datatable-table thead th',
        text: h,
      })),
    ],
  },
  'imputation-summary': {
    cardId: 'imputation-summary',
    title: 'Resumen imputaciones',
    path: '/rapports/imputation-summary',
    elements: [
      { name: 'título "Resumen de imputaciones"', selector: 'h3.color-dark-blue strong', text: 'Resumen de imputaciones' },
      { name: 'botón "Exportar a Excel"', selector: '#export-excel-btn', text: 'Exportar a Excel' },
      { name: 'cabecera del acordeón "Filtros"', selector: 'p-accordion-header .header-text', text: 'Filtros' },
      { name: 'botón "Borrar" vista', selector: '#delete-projection-btn' },
      { name: 'botón "Guardar" vista', selector: '#save-projection-btn' },
      { name: 'filtro "Desde"', selector: '#startdate-0' },
      { name: 'filtro "Hasta"', selector: '#enddate-0' },
      { name: 'filtro "División proyecto"', selector: '#autocomplete-divisionid-0' },
      { name: 'filtro "Proyecto"', selector: '#projectid-0' },
      { name: 'filtro "Subproyecto"', selector: '#subprojectid-0' },
      { name: 'filtro "Tarea"', selector: '#taskid-0' },
      { name: 'filtro "División usuario"', selector: '#userdivisionid-0' },
      { name: 'filtro "Usuario"', selector: '#userid-0' },
      { name: 'filtro "Ref. interna"', selector: '#internalref-0' },
      { name: 'filtro "Campos"', selector: '#multiselect-columnidlist-0' },
      { name: 'botón "Limpiar"', selector: '#clear-filter-btn' },
      { name: 'botón "Filtrar"', selector: '#filter-btn' },
      { name: 'leyenda "* Varias monedas"', selector: '.table-legend', text: 'Varias monedas' },
      { name: 'botón "Añadir imputación"', selector: '#add-imputation-btn' },
      { name: 'tabla de resultados', selector: '#custom-table-component table.p-datatable-table' },
      ...['Fecha', 'Div. U.', 'Nº personal', 'Usuario', 'Categoría', 'Div. P.', 'Proyecto', 'Subproyecto', 'Tarea', 'Descripción', 'Situación', 'Horas', 'Gastos', 'Creador', 'Editor', 'Acciones'].map((h) => ({
        name: `columna "${h}"`,
        selector: '#custom-table-component table.p-datatable-table thead th',
        text: h,
      })),
    ],
  },
  'expense-summary': {
    cardId: 'expense-summary',
    title: 'Resumen gastos',
    path: '/rapports/expense-summary',
    elements: [
      { name: 'título "Resumen de gastos"', selector: 'h3.color-dark-blue strong', text: 'Resumen de gastos' },
      { name: 'botón "Exportar a Excel"', selector: '#export-excel-btn', text: 'Exportar a Excel' },
      { name: 'cabecera del acordeón "Filtros"', selector: 'p-accordion-header .header-text', text: 'Filtros' },
      { name: 'botón "Borrar" vista', selector: '#delete-projection-btn' },
      { name: 'botón "Guardar" vista', selector: '#save-projection-btn' },
      { name: 'filtro "Desde"', selector: '#startdate-0' },
      { name: 'filtro "Hasta"', selector: '#enddate-0' },
      { name: 'filtro "División usuario"', selector: '#autocomplete-divisionid-0' },
      { name: 'filtro "Proyecto"', selector: '#projectid-0' },
      { name: 'filtro "Subproyecto"', selector: '#subprojectid-0' },
      { name: 'filtro "Tarea"', selector: '#taskid-0' },
      { name: 'filtro "Usuario"', selector: '#userid-0' },
      { name: 'filtro "Tipo de gasto"', selector: '#select-expensetypeid-0' },
      { name: 'filtro "Campos"', selector: '#multiselect-columnidlist-0' },
      { name: 'botón "Limpiar"', selector: '#clear-filter-btn' },
      { name: 'botón "Filtrar"', selector: '#filter-btn' },
      // Dos botones comparten el id #download-tickets-btn: se distinguen por su texto.
      { name: 'botón "Descargar tickets"', selector: '#download-tickets-btn', text: 'Descargar tickets' },
      { name: 'botón "Completar gastos"', selector: '#download-tickets-btn', text: 'Completar gastos' },
      { name: 'tabla de resultados', selector: '#custom-table-component table.p-datatable-table' },
      ...['Fecha', 'Proyecto', 'Subproyecto', 'Tarea', 'Div. P.', 'Nº personal', 'Usuario', 'Tipo de gasto', 'Ticket', 'Importe', 'Creador', 'Editor', 'Acciones'].map((h) => ({
        name: `columna "${h}"`,
        selector: '#custom-table-component table.p-datatable-table thead th',
        text: h,
      })),
    ],
  },
  'pending-rapports-summary': {
    cardId: 'pending-rapports-summary',
    title: 'Resumen pendientes',
    path: '/rapports/pending-rapports-summary',
    elements: [
      { name: 'título "Resumen de rapports pendientes"', selector: 'h3.color-dark-blue strong', text: 'Resumen de rapports pendientes' },
      { name: 'botón "Exportar a Excel"', selector: '#export-excel-btn', text: 'Exportar a Excel' },
      { name: 'cabecera del acordeón "Filtros"', selector: 'p-accordion-header .header-text', text: 'Filtros' },
      { name: 'selector de vistas', selector: 'p-virtualscroller' },
      { name: 'vista "New view"', selector: '.scroller-item', text: 'New view' },
      { name: 'botón "Borrar" vista', selector: '#delete-projection-btn' },
      { name: 'botón "Guardar" vista', selector: '#save-projection-btn' },
      { name: 'filtro "Desde"', selector: '#startdate-0' },
      { name: 'filtro "Hasta"', selector: '#enddate-0' },
      { name: 'filtro "División usuario"', selector: '#autocomplete-divisionid-0' },
      { name: 'filtro "Usuario"', selector: '#userid-0' },
      { name: 'filtro "Campos"', selector: '#multiselect-columnidlist-0' },
      { name: 'botón "Limpiar"', selector: '#clear-filter-btn' },
      { name: 'botón "Filtrar"', selector: '#filter-btn' },
      { name: 'tabla de resultados', selector: '#custom-table-component table.p-datatable-table' },
      ...['Id.', 'Nº personal', 'Nombre', 'Fecha', 'División', 'Oficina', 'Categoría', 'Fecha baja'].map((h) => ({
        name: `columna "${h}"`,
        selector: '#custom-table-component table.p-datatable-table thead th',
        text: h,
      })),
    ],
  },
};

export function moduleSpec(key: string): ModuleSpec {
  const spec = MODULES[key];
  if (!spec) throw new Error(`Módulo "${key}" no definido en src/pages/modules.page.ts (disponibles: ${Object.keys(MODULES).join(', ')}).`);
  return spec;
}

export class ModulesPage {
  constructor(private readonly page: Page) {}

  card(spec: ModuleSpec) {
    return this.page.locator(`div.custom-card#${spec.cardId}`);
  }

  async openFromHome(spec: ModuleSpec): Promise<void> {
    const card = this.card(spec);
    await card.waitFor({ state: 'visible' });
    await card.click();
  }

  async waitForPath(spec: ModuleSpec): Promise<void> {
    await this.page.waitForURL((url) => url.pathname === spec.path || url.pathname === `${spec.path}/`);
  }

  /** Devuelve los elementos esperados que NO están visibles (espera a cada uno). */
  async missingElements(spec: ModuleSpec, timeout = 15_000): Promise<string[]> {
    const missing: string[] = [];
    for (const el of spec.elements) {
      let locator = this.page.locator(el.selector);
      if (el.text) locator = locator.filter({ hasText: el.text });
      const ok = await locator.first().waitFor({ state: 'visible', timeout }).then(() => true).catch(() => false);
      if (!ok) missing.push(`${el.name} (${el.selector}${el.text ? ` con texto "${el.text}"` : ''})`);
    }
    return missing;
  }
}
