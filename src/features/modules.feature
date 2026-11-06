# language: es
Característica: Módulos de la Intranet
  Desde la home se accede a cada módulo y se comprueba: navegación correcta, endpoints en 200,
  consola sin errores y elementos básicos renderizados.

  @smoke
  Escenario: TC-MOD-01 Registro horario
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "time-record"
    Entonces navego a la URL del módulo "time-record"
    Y se renderizan los elementos básicos del módulo "time-record"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-02 Resumen registros
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "record-summary"
    Entonces navego a la URL del módulo "record-summary"
    Y se renderizan los elementos básicos del módulo "record-summary"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-03 Imputación horas
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "imputation-hours"
    Entonces navego a la URL del módulo "imputation-hours"
    Y se renderizan los elementos básicos del módulo "imputation-hours"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-04 Resumen imputaciones
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "imputation-summary"
    Entonces navego a la URL del módulo "imputation-summary"
    Y se renderizan los elementos básicos del módulo "imputation-summary"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-05 Resumen gastos
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "expense-summary"
    Entonces navego a la URL del módulo "expense-summary"
    Y se renderizan los elementos básicos del módulo "expense-summary"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-06 Resumen pendientes
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "pending-rapports-summary"
    Entonces navego a la URL del módulo "pending-rapports-summary"
    Y se renderizan los elementos básicos del módulo "pending-rapports-summary"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-07 Resumen horas
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "hour-delivery-notes-summary"
    Entonces navego a la URL del módulo "hour-delivery-notes-summary"
    Y se renderizan los elementos básicos del módulo "hour-delivery-notes-summary"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-08 Edición horas
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "hour-delivery-notes-edition"
    Entonces navego a la URL del módulo "hour-delivery-notes-edition"
    Y se renderizan los elementos básicos del módulo "hour-delivery-notes-edition"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-09 Resumen gastos (albaranes)
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "expense-delivery-notes-summary"
    Entonces navego a la URL del módulo "expense-delivery-notes-summary"
    Y se renderizan los elementos básicos del módulo "expense-delivery-notes-summary"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-10 Edición gastos
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "expense-delivery-notes-edition"
    Entonces navego a la URL del módulo "expense-delivery-notes-edition"
    Y se renderizan los elementos básicos del módulo "expense-delivery-notes-edition"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-11 Home de la intranet (SAP)
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "external-home"
    Entonces navego a la URL del módulo "external-home"
    Y se renderizan los elementos básicos del módulo "external-home"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-12 Listado de viajes (SAP)
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "external-trips"
    Entonces navego a la URL del módulo "external-trips"
    Y se renderizan los elementos básicos del módulo "external-trips"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-13 Documentos (SAP)
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "external-documents"
    Entonces navego a la URL del módulo "external-documents"
    Y se renderizan los elementos básicos del módulo "external-documents"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-14 CMS (SharePoint)
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "external-cms"
    Entonces navego a la URL del módulo "external-cms"
    Y se renderizan los elementos básicos del módulo "external-cms"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-15 Homologación de proveedores (SharePoint)
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "external-providers-homologation"
    Entonces navego a la URL del módulo "external-providers-homologation"
    Y se renderizan los elementos básicos del módulo "external-providers-homologation"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-16 Documentos generales
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "documents"
    Entonces navego a la URL del módulo "documents"
    Y se renderizan los elementos básicos del módulo "documents"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-17 Documentos mi área personal
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "documents-personal"
    Entonces navego a la URL del módulo "documents-personal"
    Y se renderizan los elementos básicos del módulo "documents-personal"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-18 Documentos mi área personal managers
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "documents-manager"
    Entonces navego a la URL del módulo "documents-manager"
    Y se renderizan los elementos básicos del módulo "documents-manager"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-19 Normativas pendientes de aceptar
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "normatives"
    Entonces navego a la URL del módulo "normatives"
    Y se renderizan los elementos básicos del módulo "normatives"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-20 Resumen proyectos
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "project-summary"
    Entonces navego a la URL del módulo "project-summary"
    Y se renderizan los elementos básicos del módulo "project-summary"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-21 Resumen subproyectos
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "subproject-summary"
    Entonces navego a la URL del módulo "subproject-summary"
    Y se renderizan los elementos básicos del módulo "subproject-summary"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-22 Resumen tareas
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "task-summary"
    Entonces navego a la URL del módulo "task-summary"
    Y se renderizan los elementos básicos del módulo "task-summary"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-23 Histórico normativas
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "normative-summary"
    Entonces navego a la URL del módulo "normative-summary"
    Y se renderizan los elementos básicos del módulo "normative-summary"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-24 Permisos usuario
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "user-permissions"
    Entonces navego a la URL del módulo "user-permissions"
    Y se renderizan los elementos básicos del módulo "user-permissions"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-25 Roles y accesos
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "user-roles-access"
    Entonces navego a la URL del módulo "user-roles-access"
    Y se renderizan los elementos básicos del módulo "user-roles-access"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-26 Roles y accesos multiusuario
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "multiuser-roles-access"
    Entonces navego a la URL del módulo "multiuser-roles-access"
    Y se renderizan los elementos básicos del módulo "multiuser-roles-access"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-27 Asignaciones categoría
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "category-assignments"
    Entonces navego a la URL del módulo "category-assignments"
    Y se renderizan los elementos básicos del módulo "category-assignments"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-28 Gestión documental
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "documentation-management"
    Entonces navego a la URL del módulo "documentation-management"
    Y se renderizan los elementos básicos del módulo "documentation-management"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-29 Gestión notificaciones
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "notification-management"
    Entonces navego a la URL del módulo "notification-management"
    Y se renderizan los elementos básicos del módulo "notification-management"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-30 Notificaciones enviadas
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "sent-notification-summary"
    Entonces navego a la URL del módulo "sent-notification-summary"
    Y se renderizan los elementos básicos del módulo "sent-notification-summary"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-31 Resumen de proyectos (GEP)
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "gep-project-summary"
    Entonces navego a la URL del módulo "gep-project-summary"
    Y se renderizan los elementos básicos del módulo "gep-project-summary"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola

  @smoke
  Escenario: TC-MOD-32 Categorías
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "categories"
    Entonces navego a la URL del módulo "categories"
    Y se renderizan los elementos básicos del módulo "categories"
    Y todos los endpoints del módulo responden 200
    Y no hay errores en la consola
