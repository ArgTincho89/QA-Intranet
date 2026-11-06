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
  /** Si el módulo sale de la intranet (mismo host fijo en todos los entornos), se valida host y prefijo de ruta en vez de `path`. */
  external?: { host: string; pathPrefix: string; hash?: string };
  elements: ExpectedElement[];
}

/** Formulario de login SAP que muestran los módulos externos cuando no hay sesión. */
const SAP_LOGIN_ELEMENTS: ExpectedElement[] = [
  { name: 'formulario de login SAP', selector: 'form#LOGIN_FORM' },
  { name: 'logo SAP', selector: 'form#LOGIN_FORM img.fotoLogo' },
  { name: 'campo "Usuario"', selector: '#USERNAME_FIELD-inner' },
  { name: 'etiqueta "Usuario"', selector: '#USERNAME_LABEL', text: 'Usuario' },
  { name: 'campo "Clave de acceso"', selector: '#PASSWORD_FIELD-inner' },
  { name: 'etiqueta "Clave de acceso"', selector: '#PASSWORD_LABEL', text: 'Clave de acceso' },
  { name: 'selector "Idioma"', selector: '#LANGUAGE_SELECT' },
  { name: 'etiqueta "Idioma"', selector: '#LANGUAGE_LABEL', text: 'Idioma' },
  { name: 'botón "Acceder al sistema"', selector: '#LOGIN_LINK', text: 'Acceder al sistema' },
];

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
  'hour-delivery-notes-summary': {
    cardId: 'hour-delivery-notes-summary',
    title: 'Resumen horas',
    path: '/delivery-notes/hour-delivery-notes-summary',
    elements: [
      { name: 'título "Albaranes de horas"', selector: 'h3.color-dark-blue strong', text: 'Albaranes de horas' },
      { name: 'botón "Exportar a Excel"', selector: '#export-excel-btn', text: 'Exportar a Excel' },
      { name: 'cabecera del acordeón "Filtros"', selector: 'p-accordion-header .header-text', text: 'Filtros' },
      { name: 'selector de vistas', selector: 'p-virtualscroller' },
      { name: 'botón "Borrar" vista', selector: '#delete-projection-btn' },
      { name: 'botón "Guardar" vista', selector: '#save-projection-btn' },
      { name: 'filtro "Desde"', selector: '#startdate-0' },
      { name: 'filtro "Hasta"', selector: '#enddate-0' },
      { name: 'filtro "División proyecto"', selector: '#autocomplete-divisionid-0' },
      { name: 'filtro "Proyecto"', selector: '#autocomplete-projectid-0' },
      { name: 'filtro "Subproyecto"', selector: '#autocomplete-subprojectid-0' },
      { name: 'filtro "Tarea"', selector: '#autocomplete-taskid-0' },
      { name: 'filtro "Usuario"', selector: '#autocomplete-userid-0' },
      { name: 'filtro "Situación"', selector: '#select-situationid-0' },
      { name: 'filtro "Descripción"', selector: '#description-0' },
      { name: 'filtro "Campos"', selector: '#multiselect-columnidlist-0' },
      { name: 'botón "Limpiar"', selector: '#clear-filter-btn' },
      { name: 'botón "Filtrar"', selector: '#filter-btn' },
      { name: 'tabla de resultados', selector: '#custom-table-component table.p-datatable-table' },
      ...['Fecha', 'Div. U.', 'Nº personal', 'Usuario', 'Categoría', 'Div. P.', 'Proyecto', 'Subproyecto', 'Tarea', 'Situación', 'Descripción', 'Horas', 'H. fact.'].map((h) => ({
        name: `columna "${h}"`,
        selector: '#custom-table-component table.p-datatable-table thead th',
        text: h,
      })),
    ],
  },
  'hour-delivery-notes-edition': {
    cardId: 'hour-delivery-notes-edition',
    title: 'Edición horas',
    path: '/delivery-notes/hour-delivery-notes-edition',
    elements: [
      { name: 'título "Edición horas albarán"', selector: 'h5.color-dark-blue strong', text: 'Edición horas albarán' },
      { name: 'contador "Total registros"', selector: 'app-table-info .alert.info', text: 'Total registros' },
      { name: 'selector de vista', selector: '#view-config-select' },
      { name: 'botón "Configuración de vista"', selector: 'app-action-bar button[title="Configuración de vista"]' },
      { name: 'botón "Añadir"', selector: 'app-action-bar button[title="Añadir"]' },
      { name: 'botón "Copiar"', selector: 'app-action-bar button[title="Copiar"]' },
      { name: 'botón "Guardar"', selector: 'app-action-bar button[title="Guardar"]' },
      { name: 'botón "Borrar"', selector: 'app-action-bar button[title="Borrar"]' },
      { name: 'botón "Ordenar ascendente"', selector: 'app-action-bar button[title="Ordenar ascendente"]' },
      { name: 'botón "Ordenar descendente"', selector: 'app-action-bar button[title="Ordenar descendente"]' },
      { name: 'botón "Agrupar"', selector: 'app-action-bar button[title="Agrupar"]' },
      { name: 'botón "Sumatorio"', selector: 'app-action-bar button[title="Sumatorio"]' },
      { name: 'botón "Recargar"', selector: 'app-action-bar button[title="Recargar"]' },
      { name: 'tabla editable', selector: 'app-editable-table table.p-datatable-table' },
      ...['Nº personal', 'Usuario', 'Div. U.', 'Fecha', 'Posición', 'Tipo de proyecto', 'Div. P.', 'Proyecto', 'Subproyecto', 'Tarea', 'Duración', 'HB100', 'Categoría', 'Descripción', 'Situación', 'Duración Rapports', 'HRB100', 'Estado', 'Modificado por', 'Fecha modificación'].map((h) => ({
        name: `columna "${h}"`,
        selector: 'app-editable-table table.p-datatable-table thead th',
        text: h,
      })),
    ],
  },
  'expense-delivery-notes-summary': {
    cardId: 'expense-delivery-notes-summary',
    title: 'Resumen gastos',
    path: '/delivery-notes/expense-delivery-notes-summary',
    elements: [
      { name: 'título "Albaranes de gastos"', selector: 'h3.color-dark-blue strong', text: 'Albaranes de gastos' },
      { name: 'botón "Exportar a Excel"', selector: '#export-excel-btn', text: 'Exportar a Excel' },
      { name: 'cabecera del acordeón "Filtros"', selector: 'p-accordion-header .header-text', text: 'Filtros' },
      { name: 'selector de vistas', selector: 'p-virtualscroller' },
      { name: 'botón "Borrar" vista', selector: '#delete-projection-btn' },
      { name: 'botón "Guardar" vista', selector: '#save-projection-btn' },
      { name: 'filtro "Desde"', selector: '#startdate-0' },
      { name: 'filtro "Hasta"', selector: '#enddate-0' },
      { name: 'filtro "División proyecto"', selector: '#autocomplete-divisionid-0' },
      { name: 'filtro "Proyecto"', selector: '#autocomplete-projectid-0' },
      { name: 'filtro "Subproyecto"', selector: '#autocomplete-subprojectid-0' },
      { name: 'filtro "Tarea"', selector: '#autocomplete-taskid-0' },
      { name: 'filtro "Usuario"', selector: '#autocomplete-userid-0' },
      { name: 'filtro "Descripción"', selector: '#description-0' },
      { name: 'filtro "Moneda"', selector: '#select-currencyid-0' },
      { name: 'filtro "Campos"', selector: '#multiselect-columnidlist-0' },
      { name: 'filtro "Ticket"', selector: '#hasticket-0' },
      { name: 'botón "Limpiar"', selector: '#clear-filter-btn' },
      { name: 'botón "Filtrar"', selector: '#filter-btn' },
      { name: 'tabla de resultados', selector: '#custom-table-component table.p-datatable-table' },
      ...['Fecha', 'Div. U.', 'Nº personal', 'Usuario', 'Div. P.', 'Proyecto', 'Subproyecto', 'Tarea', 'Descripción', 'Total', 'Importe km.', 'Moneda'].map((h) => ({
        name: `columna "${h}"`,
        selector: '#custom-table-component table.p-datatable-table thead th',
        text: h,
      })),
    ],
  },
  'expense-delivery-notes-edition': {
    cardId: 'expense-delivery-notes-edition',
    title: 'Edición gastos',
    path: '/delivery-notes/expense-delivery-notes-edition',
    elements: [
      { name: 'mensaje "Not implemented yet"', selector: 'p.error', text: 'Not implemented yet' },
    ],
  },
  'external-home': {
    cardId: 'external-home',
    title: 'Home de la intranet',
    path: '/sap/bc/ui2/flp',
    external: { host: 'intranet.seidor.es', pathPrefix: '/sap/bc/ui2/flp', hash: 'Shell-home' },
    elements: SAP_LOGIN_ELEMENTS,
  },
  'external-trips': {
    cardId: 'external-trips',
    title: 'Listado de viajes',
    path: '/sap/bc/ui2/flp',
    external: { host: 'intranet.seidor.es', pathPrefix: '/sap/bc/ui2/flp', hash: 'ZTRV_MYTRV-display' },
    elements: SAP_LOGIN_ELEMENTS,
  },
  'external-documents': {
    cardId: 'external-documents',
    title: 'Documentos',
    path: '/sap/bc/ui2/flp',
    external: { host: 'intranet.seidor.es', pathPrefix: '/sap/bc/ui2/flp', hash: 'ZFIORI_ANEXOS-display' },
    elements: SAP_LOGIN_ELEMENTS,
  },
  'external-cms': {
    cardId: 'external-cms',
    title: 'CMS',
    path: '/sites/ComplianceManagementSystemCMS',
    external: { host: 'seidor.sharepoint.com', pathPrefix: '/sites/ComplianceManagementSystemCMS' },
    elements: [
      { name: 'botón de cuenta (Administrador de cuenta)', selector: '#O365_MainLink_Me' },
      { name: 'iniciales del usuario', selector: '#O365_MainLink_MePhoto #meInitialsButton' },
      { name: 'botón "Iniciador de aplicaciones"', selector: '#O365_MainLink_NavMenu[title="Iniciador de aplicaciones"]' },
    ],
  },
  'external-providers-homologation': {
    cardId: 'external-providers-homologation',
    title: 'Homologación de proveedores',
    path: '/sites/FinanzasLegalyCompliance/SitePages/Visualización-proveedores.aspx',
    // Solo la base: los parámetros de query (TeamsCID, xsdata, sdata...) cambian en cada acceso.
    external: { host: 'seidor.sharepoint.com', pathPrefix: '/sites/FinanzasLegalyCompliance/SitePages/Visualización-proveedores.aspx' },
    elements: [
      { name: 'botón "Iniciador de aplicaciones"', selector: '#O365_MainLink_NavMenu[title="Iniciador de aplicaciones"]' },
      { name: 'botón de cuenta (Administrador de cuenta)', selector: '#O365_MainLink_Me' },
      { name: 'iniciales del usuario', selector: '#O365_MainLink_MePhoto #meInitialsButton' },
    ],
  },
  documents: {
    cardId: 'documents',
    title: 'General',
    path: '/documentation/documents',
    elements: [
      { name: 'título "Documentos"', selector: 'app-documents h3', text: 'Documentos' },
      { name: 'contenedor de documentos', selector: 'app-document-wrapper .document-wrapper' },
      { name: 'árbol de carpetas', selector: 'app-document-wrapper p-tree' },
      // El nombre de las carpetas depende de los datos del entorno: solo se exige que haya al menos una.
      { name: 'al menos una carpeta en el árbol', selector: 'app-document-wrapper p-tree li.folder.p-tree-node' },
    ],
  },
  'documents-personal': {
    cardId: 'documents-personal',
    title: 'Mi área personal',
    path: '/documentation/documents-personal',
    elements: [
      { name: 'título "Documentos mi área personal"', selector: 'app-documents h3', text: 'Documentos mi área personal' },
      { name: 'contenedor de documentos', selector: 'app-document-wrapper .document-wrapper' },
      { name: 'árbol de carpetas', selector: 'app-document-wrapper p-tree' },
      // El nombre de las carpetas depende de los datos del usuario: solo se exige que haya al menos una.
      { name: 'al menos una carpeta en el árbol', selector: 'app-document-wrapper p-tree li.folder.p-tree-node' },
    ],
  },
  'documents-manager': {
    cardId: 'documents-manager',
    title: 'Mi área personal managers',
    path: '/documentation/documents-manager',
    elements: [
      { name: 'título "Documentos mi área personal managers"', selector: 'app-documents h3', text: 'Documentos mi área personal managers' },
      { name: 'contenedor de documentos', selector: 'app-document-wrapper .document-wrapper' },
      { name: 'árbol de carpetas', selector: 'app-document-wrapper p-tree' },
      // El nombre de las carpetas depende de los datos del usuario: solo se exige que haya al menos una.
      { name: 'al menos una carpeta en el árbol', selector: 'app-document-wrapper p-tree li.folder.p-tree-node' },
    ],
  },
  normatives: {
    cardId: 'normatives',
    title: 'Normativas pendientes aceptar',
    path: '/documentation/normatives',
    elements: [
      { name: 'título "Normativas pendientes de aceptar"', selector: 'h3.color-dark-blue strong', text: 'Normativas pendientes de aceptar' },
      { name: 'listado de normativas', selector: '.normatives ul.normatives-list' },
      // Los nombres de las normativas dependen de los datos del entorno: solo se exige que haya al menos una.
      { name: 'al menos una normativa', selector: '.normatives-list li.normatives-list-item' },
      { name: 'selector (radio) de normativa', selector: '.normatives-list li.normatives-list-item input[type="radio"][name="normatives-list"]' },
      { name: 'icono PDF de normativa', selector: '.normatives-list li.normatives-list-item i.fa-file-pdf-o' },
    ],
  },
  'project-summary': {
    cardId: 'project-summary',
    title: 'Resumen proyectos',
    path: '/backoffice/project-summary',
    elements: [
      { name: 'cabecera del acordeón "Filtros"', selector: 'p-accordion-header .header-text', text: 'Filtros' },
      { name: 'selector de vistas', selector: 'p-virtualscroller' },
      { name: 'botón "Borrar" vista', selector: '#delete-projection-btn' },
      { name: 'botón "Guardar" vista', selector: '#save-projection-btn' },
      { name: 'filtro "Desde"', selector: '#startdate-0' },
      { name: 'filtro "Hasta"', selector: '#enddate-0' },
      { name: 'filtro "División proyecto"', selector: '#autocomplete-divisionid-0' },
      { name: 'filtro "Cliente"', selector: '#autocomplete-clientid-0' },
      { name: 'filtro "Proyecto"', selector: '#autocomplete-projectid-0' },
      { name: 'filtro "Gerente"', selector: '#autocomplete-customermanagerid-0' },
      { name: 'filtro "Gestor"', selector: '#autocomplete-managerid-0' },
      { name: 'filtro "Comercial"', selector: '#autocomplete-commercialid-0' },
      { name: 'filtro "Descripción"', selector: '#description-0' },
      { name: 'filtro "Campos"', selector: '#multiselect-columnidlist-0' },
      { name: 'botón "Limpiar"', selector: '#clear-filter-btn' },
      { name: 'botón "Filtrar"', selector: '#filter-btn' },
      { name: 'tabla de resultados', selector: '#custom-table-component table.p-datatable-table' },
      ...['Fecha', 'Proyecto', 'Código cliente', 'Cliente', 'División', 'Gerente', 'Gestor', 'Comercial', 'Descripción', 'Bloqueado'].map((h) => ({
        name: `columna "${h}"`,
        selector: '#custom-table-component table.p-datatable-table thead th',
        text: h,
      })),
    ],
  },
  'subproject-summary': {
    cardId: 'subproject-summary',
    title: 'Resumen subproyectos',
    path: '/backoffice/subproject-summary',
    elements: [
      { name: 'título "Resumen de subproyectos"', selector: 'h3.color-dark-blue strong', text: 'Resumen de subproyectos' },
      { name: 'botón "Exportar a Excel"', selector: '#export-excel-btn', text: 'Exportar a Excel' },
      { name: 'cabecera del acordeón "Filtros"', selector: 'p-accordion-header .header-text', text: 'Filtros' },
      { name: 'selector de vistas', selector: 'p-virtualscroller' },
      { name: 'botón "Borrar" vista', selector: '#delete-projection-btn' },
      { name: 'botón "Guardar" vista', selector: '#save-projection-btn' },
      { name: 'filtro "Desde"', selector: '#startdate-0' },
      { name: 'filtro "Hasta"', selector: '#enddate-0' },
      { name: 'filtro "Proyecto"', selector: '#autocomplete-projectid-0' },
      { name: 'filtro "Código"', selector: '#code-0' },
      { name: 'filtro "Responsable"', selector: '#autocomplete-responsibleid-0' },
      { name: 'filtro "Descripción"', selector: '#description-0' },
      { name: 'filtro "Campos"', selector: '#multiselect-columnidlist-0' },
      { name: 'filtro "Activo"', selector: '#isactive-0' },
      { name: 'botón "Limpiar"', selector: '#clear-filter-btn' },
      { name: 'botón "Filtrar"', selector: '#filter-btn' },
      { name: 'botón "Nuevo subproyecto"', selector: '#new-subproject-btn', text: 'Nuevo subproyecto' },
      { name: 'tabla de resultados', selector: '#custom-table-component table.p-datatable-table' },
      ...['Fecha', 'Desde', 'Hasta', 'Código', 'Proyecto', 'Responsable', 'Descripción', 'Activo', 'Estado', 'Tipo proyecto', 'Acciones'].map((h) => ({
        name: `columna "${h}"`,
        selector: '#custom-table-component table.p-datatable-table thead th',
        text: h,
      })),
    ],
  },
  'task-summary': {
    cardId: 'task-summary',
    title: 'Resumen tareas',
    path: '/backoffice/task-summary',
    elements: [
      { name: 'título "Resumen de tareas"', selector: 'h3.color-dark-blue strong', text: 'Resumen de tareas' },
      { name: 'botón "Exportar a Excel"', selector: '#export-excel-btn', text: 'Exportar a Excel' },
      { name: 'cabecera del acordeón "Filtros"', selector: 'p-accordion-header .header-text', text: 'Filtros' },
      { name: 'selector de vistas', selector: 'p-virtualscroller' },
      { name: 'botón "Borrar" vista', selector: '#delete-projection-btn' },
      { name: 'botón "Guardar" vista', selector: '#save-projection-btn' },
      { name: 'filtro "Desde"', selector: '#startdate-0' },
      { name: 'filtro "Hasta"', selector: '#enddate-0' },
      { name: 'filtro "División proyecto"', selector: '#autocomplete-divisionid-0' },
      { name: 'filtro "Proyecto"', selector: '#autocomplete-projectid-0' },
      { name: 'filtro "Subproyecto"', selector: '#autocomplete-subprojectid-0' },
      { name: 'filtro "Código"', selector: '#code-0' },
      { name: 'filtro "Descripción"', selector: '#description-0' },
      { name: 'filtro "Campos"', selector: '#multiselect-columnidlist-0' },
      { name: 'filtro "Activo"', selector: '#isactive-0' },
      { name: 'botón "Limpiar"', selector: '#clear-filter-btn' },
      { name: 'botón "Filtrar"', selector: '#filter-btn' },
      { name: 'botón "Nueva tarea"', selector: '#new-task-btn', text: 'Nueva tarea' },
      { name: 'tabla de resultados', selector: '#custom-table-component table.p-datatable-table' },
      ...['Fecha', 'Desde', 'Hasta', 'Activo', 'Código', 'División', 'Proyecto', 'Subproyecto', 'Descripción', 'Estimación', 'Acciones'].map((h) => ({
        name: `columna "${h}"`,
        selector: '#custom-table-component table.p-datatable-table thead th',
        text: h,
      })),
    ],
  },
  'normative-summary': {
    cardId: 'normative-summary',
    title: 'Histórico normativas',
    path: '/backoffice/normative-summary',
    elements: [
      { name: 'cabecera del acordeón "Filtros"', selector: 'p-accordion-header .header-text', text: 'Filtros' },
      { name: 'selector de vistas', selector: 'p-virtualscroller' },
      { name: 'botón "Borrar" vista', selector: '#delete-projection-btn' },
      { name: 'botón "Guardar" vista', selector: '#save-projection-btn' },
      { name: 'filtro "Desde"', selector: '#startdate-0' },
      { name: 'filtro "Hasta"', selector: '#enddate-0' },
      { name: 'filtro "País"', selector: '#select-countryid-0' },
      { name: 'filtro "Sociedad"', selector: '#autocomplete-societyid-0' },
      { name: 'filtro "División normativa"', selector: '#autocomplete-divisionid-0' },
      { name: 'filtro "Centro"', selector: '#select-workcenterid-0' },
      { name: 'filtro "Nombre"', selector: '#name-0' },
      { name: 'filtro "Usuario"', selector: '#autocomplete-userid-0' },
      { name: 'filtro "Estado"', selector: '#multiselect-states-0' },
      { name: 'filtro "Campos"', selector: '#multiselect-columnidlist-0' },
      { name: 'botón "Limpiar"', selector: '#clear-filter-btn' },
      { name: 'botón "Filtrar"', selector: '#filter-btn' },
      { name: 'tabla de resultados', selector: '#custom-table-component table.p-datatable-table' },
      ...[
        'Nombre fichero', 'Fecha creación', 'Descripción', 'Lectura', 'Fecha lectura', 'Hora lectura',
        'Aceptación', 'Fecha aceptación', 'Hora aceptación', 'Usuario', 'Nombre', 'Fecha alta',
        'Fecha baja', 'Estado', 'Div. U.', 'Sociedad', 'Oficina', 'E-mail',
      ].map((h) => ({
        name: `columna "${h}"`,
        selector: '#custom-table-component table.p-datatable-table thead th',
        text: h,
      })),
    ],
  },
  'user-permissions': {
    cardId: 'user-permissions',
    title: 'Permisos usuario',
    path: '/backoffice/user-permissions',
    elements: [
      { name: 'título "Permisos de usuario"', selector: 'h5.color-dark-blue strong', text: 'Permisos de usuario' },
      { name: 'buscador de usuario', selector: '#autocomplete-userid-0 input#userid-0' },
      { name: 'botón "Añadir"', selector: '.btns-wrapper button[title="Añadir"]' },
      { name: 'botón "Filtrar"', selector: '.btns-wrapper button[title="Filtrar"]' },
      { name: 'botón "Guardar"', selector: '.btns-wrapper button[title="Guardar"]' },
      { name: 'botón "Recargar"', selector: '.btns-wrapper button[title="Recargar"]' },
      { name: 'tabla de permisos', selector: 'app-permission-table p-treetable' },
      ...['Permisos sobre:', 'READ', 'CREATE', 'UPDATE', 'DELETE', 'READ EXT.', 'CREATE EXT.', 'UPDATE EXT.', 'DELETE EXT.'].map((h) => ({
        name: `columna "${h}"`,
        selector: 'app-permission-table .p-treetable-thead th',
        text: h,
      })),
      { name: 'mensaje "Sin permisos"', selector: 'app-permission-table tr.empty-msg .no-results-text', text: 'Sin permisos' },
    ],
  },
  'user-roles-access': {
    cardId: 'user-roles-access',
    title: 'Roles y accesos',
    path: '/backoffice/user-roles-access',
    elements: [
      { name: 'título "Roles y accesos"', selector: 'app-user-roles-access h3 strong', text: 'Roles y accesos' },
      { name: 'buscador de usuario', selector: '#autocomplete-userid-0 input#userid-0' },
      { name: 'botón de guardar', selector: '#save-user-role-btn' },
      ...['Datos', 'Roles', 'Accesos'].map((h) => ({
        name: `sección "${h}"`,
        selector: 'app-user-roles-access h6 strong',
        text: h,
      })),
      ...['Id.', 'Nombre', 'Nº personal', 'Sociedad', 'División', 'Categoría', 'E-mail', 'Ubicación'].map((l) => ({
        name: `dato "${l}"`,
        selector: 'app-user-roles-access .user-data span, app-user-roles-access span',
        text: l,
      })),
      { name: 'árbol de roles y accesos', selector: 'app-user-roles-access p-tree' },
      ...['Manager', 'Administrator', 'backoffice', 'documentation', 'gep'].map((n) => ({
        name: `nodo "${n}"`,
        selector: 'app-user-roles-access p-tree .p-tree-node-label',
        text: n,
      })),
    ],
  },
  'multiuser-roles-access': {
    cardId: 'multiuser-roles-access',
    title: 'Roles y accesos multiusuario',
    path: '/backoffice/multiuser-roles-access',
    elements: [
      { name: 'título "Roles y accesos"', selector: 'app-user-roles-access h3 strong', text: 'Roles y accesos' },
      ...['Filtros', 'Acciones', 'Usuarios', 'Roles', 'Accesos'].map((h) => ({
        name: `sección "${h}"`,
        selector: 'app-user-roles-access h6 strong',
        text: h,
      })),
      { name: 'filtro "País"', selector: '#select-countryid-0' },
      { name: 'filtro "Sociedad"', selector: '#autocomplete-societyid-0' },
      { name: 'filtro "División"', selector: '#autocomplete-divisionid-0' },
      { name: 'botón "Limpiar"', selector: '#clear-btn' },
      { name: 'botón "Filtrar"', selector: '#filter-btn' },
      { name: 'acción "Añadir"', selector: '#add-action-btn', text: 'Añadir' },
      { name: 'acción "Quitar"', selector: '#remove-action-btn', text: 'Quitar' },
      { name: 'acción "Modificar"', selector: '#override-action-btn', text: 'Modificar' },
      { name: 'botón de guardar', selector: '#save-user-role-btn' },
      { name: 'árbol de roles y accesos', selector: 'app-user-roles-access p-tree' },
      ...['Manager', 'Administrator', 'backoffice', 'documentation', 'gep'].map((n) => ({
        name: `nodo "${n}"`,
        selector: 'app-user-roles-access p-tree .p-tree-node-label',
        text: n,
      })),
    ],
  },
  'notification-management': {
    cardId: 'notification-management',
    title: 'Gestión notificaciones',
    path: '/backoffice/notification-management',
    elements: [
      { name: 'menú de notificaciones', selector: 'app-nm-menu' },
      ...['Notificaciones', 'Plantillas', 'Notificaciones de sistema'].map((t) => ({
        name: `panel "${t}"`,
        selector: 'app-nm-menu .p-panel-title',
        text: t,
      })),
      ...[
        'Creación de notificación desde cero', 'Creación de notificación desde plantilla',
        'Creación de notificación desde notificación', 'Edición de notificación recurrente', 'Borrado de notificación',
        'Creación de plantilla', 'Edición de plantilla', 'Borrado de plantilla',
        'Creación de notificación de sistema por evento', 'Edición de notificación de sistema por evento',
        'Copia de notificación de sistema por evento', 'Borrado de notificación de sistema por evento',
      ].map((l) => ({
        name: `opción "${l}"`,
        selector: 'app-nm-menu label.form-check-label',
        text: l,
      })),
      { name: 'tipo "Evento"', selector: '#systemEvents-type-btn', text: 'Evento' },
      { name: 'tipo "Disparador"', selector: '#systemTriggers-type-btn', text: 'Disparador' },
    ],
  },
  'sent-notification-summary': {
    cardId: 'sent-notification-summary',
    title: 'Notificaciones enviadas',
    path: '/backoffice/sent-notification-summary',
    elements: [
      { name: 'título "Notificaciones enviadas"', selector: 'h3.color-dark-blue strong', text: 'Notificaciones enviadas' },
      { name: 'cabecera del acordeón "Filtros"', selector: 'p-accordion-header .header-text', text: 'Filtros' },
      { name: 'selector de vistas', selector: 'p-virtualscroller' },
      { name: 'botón "Borrar" vista', selector: '#delete-projection-btn' },
      { name: 'botón "Guardar" vista', selector: '#save-projection-btn' },
      { name: 'filtro "Desde"', selector: '#startdate-0' },
      { name: 'filtro "Hasta"', selector: '#enddate-0' },
      { name: 'filtro "Nombre"', selector: '#name-0' },
      { name: 'filtro "Creador"', selector: '#autocomplete-creatorid-0' },
      { name: 'filtro "Tipo"', selector: '#select-typeid-0' },
      { name: 'filtro "Canal"', selector: '#select-channelid-0' },
      { name: 'filtro "Prioridad"', selector: '#select-priorityid-0' },
      { name: 'filtro "Campos"', selector: '#multiselect-columnidlist-0' },
      { name: 'filtro "Emergente"', selector: '#isemergent-0' },
      { name: 'botón "Limpiar"', selector: '#clear-filter-btn' },
      { name: 'botón "Filtrar"', selector: '#filter-btn' },
      { name: 'tabla de resultados', selector: '#custom-table-component table.p-datatable-table' },
      ...['Fecha envío', 'Nombre', 'Creador', 'Tipo', 'Canal', 'Prioridad', 'Emergente'].map((h) => ({
        name: `columna "${h}"`,
        selector: '#custom-table-component table.p-datatable-table thead th',
        text: h,
      })),
    ],
  },
  'gep-project-summary': {
    cardId: 'gep-project-summary',
    title: 'Resumen de proyectos (GEP)',
    path: '/gep/gep-project-summary',
    elements: [
      { name: 'título "GEP: resumen de proyectos"', selector: 'h3.color-dark-blue strong', text: 'GEP: resumen de proyectos' },
      { name: 'botón de exportar a Excel', selector: '#export-excel-btn' },
      { name: 'cabecera del acordeón "Filtros"', selector: 'p-accordion-header .header-text', text: 'Filtros' },
      { name: 'selector de vistas', selector: 'p-virtualscroller' },
      { name: 'botón "Borrar" vista', selector: '#delete-projection-btn' },
      { name: 'botón "Guardar" vista', selector: '#save-projection-btn' },
      { name: 'filtro "División proyecto"', selector: '#autocomplete-divisionid-0' },
      { name: 'filtro "Cliente"', selector: '#autocomplete-clientid-0' },
      { name: 'filtro "Proyecto"', selector: '#autocomplete-projectid-0' },
      { name: 'filtro "Gerente"', selector: '#autocomplete-customermanagerid-0' },
      { name: 'filtro "Gestor"', selector: '#autocomplete-managerid-0' },
      { name: 'filtro "Comercial"', selector: '#autocomplete-commercialid-0' },
      { name: 'filtro "Descripción"', selector: '#description-0' },
      { name: 'filtro "Campos"', selector: '#multiselect-columnidlist-0' },
      { name: 'filtro "Activo"', selector: '#isactive-0' },
      { name: 'filtro "Validado"', selector: '#isvalidated-0' },
      { name: 'botón "Limpiar"', selector: '#clear-filter-btn' },
      { name: 'botón "Filtrar"', selector: '#filter-btn' },
      { name: 'tabla de resultados', selector: '#custom-table-component table.p-datatable-table' },
      ...['Estado', 'Definición', 'Proyecto', 'Descripción', 'Gerente', 'Precio venta', 'H. ejec. / H. plan. (%)', 'Ingreso', 'Coste', 'Margen', 'Mes valorizado'].map((h) => ({
        name: `columna "${h}"`,
        selector: '#custom-table-component table.p-datatable-table thead th',
        text: h,
      })),
    ],
  },
  categories: {
    cardId: 'categories',
    title: 'Categorías',
    path: '/data-management/categories',
    elements: [
      { name: 'título "Asignación de categorías"', selector: 'app-dm-categories h3 strong', text: 'Asignación de categorías' },
      { name: 'filtro "todas"', selector: '#all' },
      { name: 'filtro "asignadas"', selector: '#assigned' },
      { name: 'filtro "no asignadas"', selector: '#notAssigned' },
      { name: 'filtro "División"', selector: '#autocomplete-divisionid-0' },
      { name: 'filtro "Categoría"', selector: '#category-0' },
      { name: 'campo "Usuario"', selector: '#autocomplete-userid-0' },
      { name: 'campo "Categoría" a asignar', selector: '#autocomplete-gepcategoryid-0' },
      { name: 'botón de guardar asignación', selector: '#dm-user-category-save-btn' },
      ...['División > Categoría', 'Descripción', 'Asignado', 'Precio €'].map((h) => ({
        name: `columna "${h}"`,
        selector: 'app-dm-categories table thead th',
        text: h,
      })),
    ],
  },
  'category-assignments': {
    cardId: 'category-assignments',
    title: 'Asignaciones categoría',
    path: '/backoffice/category-assignments',
    elements: [
      { name: 'título "Asignaciones categoría"', selector: 'h3.color-dark-blue strong', text: 'Asignaciones categoría' },
      { name: 'filtro "División"', selector: '#multiautocompletefilter-divisions-0' },
      { name: 'filtro "Usuario"', selector: '#multiautocompletefilter-users-0' },
      { name: 'filtro "Proyecto"', selector: '#multiautocompletefilter-projects-0' },
      { name: 'filtro "Categoría"', selector: '#multiautocompletefilter-categories-0' },
      { name: 'botón "Limpiar"', selector: '#clear-filter-btn' },
      { name: 'botón "Filtrar"', selector: '#filter-btn' },
      { name: 'botón "Nueva asignación"', selector: '#create-category-assignment-btn', text: 'Nueva asignación' },
      { name: 'tabla de resultados', selector: '#custom-table-component table.p-datatable-table' },
      ...['División', 'Usuario', 'Proyecto', 'Categoría', 'Acciones'].map((h) => ({
        name: `columna "${h}"`,
        selector: '#custom-table-component table.p-datatable-table thead th',
        text: h,
      })),
    ],
  },
  'documentation-management': {
    cardId: 'documentation-management',
    title: 'Gestión documental',
    path: '/backoffice/documentation-management',
    elements: [
      { name: 'título "Gestión documental"', selector: 'h3.color-dark-blue strong', text: 'Gestión documental' },
      ...['Documentos', 'Normativas', 'Grupos de documentos'].map((t) => ({
        name: `pestaña "${t}"`,
        selector: 'p-tab',
        text: t,
      })),
      { name: 'filtro "País"', selector: '#select-countryid-0' },
      { name: 'filtro "Sociedad"', selector: '#autocomplete-societyid-0' },
      { name: 'filtro "División"', selector: '#autocomplete-divisionid-0' },
      { name: 'filtro "Centro"', selector: '#select-workcenterid-0' },
      { name: 'botón "Limpiar"', selector: '#clear-filter-btn' },
      { name: 'botón "Filtrar"', selector: '#filter-btn' },
      { name: 'botón "Nuevo documento"', selector: '#new-document-btn', text: 'Nuevo documento' },
      { name: 'tabla de documentos', selector: '#custom-table-component table.p-datatable-table' },
      ...['Desde', 'Hasta', 'Nombre', 'Descripción', 'Formato', 'Idioma', 'Tipo', 'Grupo', 'Acciones'].map((h) => ({
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

  /** Devuelve la pestaña nueva si el clic abre una (módulos externos); si no, undefined. */
  async openFromHome(spec: ModuleSpec): Promise<Page | undefined> {
    const card = this.card(spec);
    await card.waitFor({ state: 'visible' });
    if (!spec.external) {
      await card.click();
      return undefined;
    }
    const popupPromise = this.page.context().waitForEvent('page', { timeout: 10_000 }).catch(() => undefined);
    await card.click();
    return popupPromise;
  }

  matchesPath(spec: ModuleSpec, url: URL): boolean {
    if (spec.external) {
      const { host, pathPrefix, hash } = spec.external;
      if (url.hostname !== host || !decodeURIComponent(url.pathname).startsWith(decodeURIComponent(pathPrefix))) return false;
      if (!hash) return true;
      // Tras redirigir al login SAP, el fragmento pasa a `_sap-hash` en base64 ("#" + hash, sin relleno).
      const encoded = Buffer.from(`#${hash}`).toString('base64').replace(/=+$/, '');
      return url.hash === `#${hash}` || url.searchParams.get('_sap-hash') === encoded;
    }
    return url.pathname === spec.path || url.pathname === `${spec.path}/`;
  }

  async waitForPath(spec: ModuleSpec): Promise<void> {
    await this.page.waitForURL((url) => this.matchesPath(spec, url));
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
