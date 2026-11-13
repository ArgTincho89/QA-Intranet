# Suite de pruebas: Resumen de imputaciones

**Origen:** Azure DevOps – Test Plan `03-Rapports`, Suite `Imputations summary` (ID 532).  
**Criterio de extracción:** se excluye el caso raíz `2484 – Rapports-Imputation Summary-Functionality`, tal como se hizo con la suite anterior. Se incluyen todos los casos individuales que aparecen en el PDF: **40 casos** (no 38).  
**Formato:** traducción al castellano de las acciones y resultados esperados. Se conservan los identificadores de Azure DevOps para facilitar su trazabilidad.

> **Importante para desarrollo:** este documento reproduce lo que está definido en Azure DevOps. No se han inventado precondiciones, datos de prueba ni reglas que no aparezcan en el origen. Cuando el caso original tiene un paso sin resultado esperado, una ruta que parece pertenecer a otra funcionalidad o una descripción ambigua, se señala expresamente en “Observaciones”. Las comprobaciones visuales cuyo resultado esperado es únicamente “la interfaz debe mantenerse intacta” necesitan criterios visuales más concretos antes de poder considerarse criterios de aceptación automatizables.

## Observaciones generales detectadas en el origen

- Los casos pertenecen a la suite **Imputations summary**, pero varios títulos y pasos mencionan `Back office`, `Sent Notification`, `Normative History`, `Delivery Notes` y `Expense Summary`. Se mantienen esas referencias; no se presupone que sean errores ni se sustituyen por otras pantallas.
- Los casos `2033`, `2043` y otros presentan discrepancias entre el título y la pantalla indicada en los pasos.
- Algunos pasos no tienen resultado esperado asociado. Se indica como **No especificado en Azure DevOps**.
- Los casos de interfaz usan criterios genéricos (“la interfaz debe mantenerse intacta”), sin indicar componentes, estados, resolución o reglas de diseño concretas.
- El caso `2046` tiene una errata en el título original (`BDelivery Notes`); se conserva el ID y se normaliza el título traducido.
- Los títulos `2097` y `2099` aparecen sin sufijo `Functionality` en el PDF. Por su contenido parecen casos funcionales, pero no se añade ese sufijo como si estuviera confirmado.

---

## TC-RI-01 — Crear vista (UI)
**Azure DevOps ID:** `2027`  
**Título original:** Back office-Sent Notification-Create View-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Back office > Sent Notification**. | No especificado en Azure DevOps. |
| 3 | Crear una vista y comprobar la interfaz relacionada con “Crear vista”. | La interfaz debe mantenerse intacta. |

## TC-RI-02 — Crear vista (Funcionalidad)
**Azure DevOps ID:** `2026`  
**Título original:** Back office-Sent Notification-Create View-Functionality

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Back office > Normative History**. | No especificado en Azure DevOps. |
| 3 | Seleccionar el filtro de fecha (obligatorio). | No especificado en Azure DevOps. |
| 4 | Seleccionar cualquier otro filtro, según se desee. | No especificado en Azure DevOps. |
| 5 | Hacer clic en **Guardar**. | Se debe abrir el modal “Guardar vista”. |
| 6 | Introducir el nombre de la vista. | El nombre debe poder introducirse sin problemas de interfaz. |
| 7 | Marcar la casilla para crear la vista como genérica. | La vista guardada al marcar la casilla debe ser genérica y estar disponible para todos los usuarios. |
| 8 | Hacer clic en **Guardar**. | La vista debe guardarse. |

## TC-RI-03 — Editar vista (Funcionalidad)
**Azure DevOps ID:** `2028`  
**Título original:** Back office-Sent Notification-Edit View-Functionality

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Back office > Sent Notification**. | No especificado en Azure DevOps. |
| 3 | Seleccionar una vista. | No especificado en Azure DevOps. |
| 4 | Seleccionar cualquier otro filtro, según se desee. | No especificado en Azure DevOps. |
| 5 | Hacer clic en **Guardar**. | Se debe abrir el modal “Guardar vista”. |
| 6 | Seleccionar el botón de opción correspondiente a “Guardar como”. | Se debe poder guardar la vista con el nombre existente o con uno nuevo. |
| 7 | Seleccionar el nombre existente en la opción “Guardar como”. | La vista debe guardarse con el nombre existente. |
| 8 | Seleccionar **Nueva vista**. | Debe mostrarse el campo para introducir un nuevo nombre para la vista. |
| 9 | Escribir el nombre de la vista. | El nombre debe quedar introducido. |
| 10 | Marcar la casilla para crear la vista como genérica. | La vista guardada al marcar la casilla debe ser genérica y estar disponible para todos los usuarios. |
| 11 | Hacer clic en **Guardar**. | La vista debe guardarse. |

## TC-RI-04 — Editar vista (UI)
**Azure DevOps ID:** `2029`  
**Título original:** Back office-Sent Notification-Edit View-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Back office > Sent Notification**. | No especificado en Azure DevOps. |
| 3 | Editar una vista y comprobar la interfaz relacionada con “Editar vista”. | La interfaz debe mantenerse intacta. |

## TC-RI-05 — Eliminar vista (Funcionalidad)
**Azure DevOps ID:** `2030`  
**Título original:** Delivery Notes-Hours Summary-Delete View-Functionality

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Seleccionar una vista. | No especificado en Azure DevOps. |
| 4 | Hacer clic en el botón **Eliminar**. | Se debe abrir una ventana emergente de confirmación. |
| 5 | Hacer clic en **Eliminar** dentro de la ventana de confirmación. | La vista debe eliminarse. |
| 6 | Hacer clic en el botón **Cancelar**. | La ventana emergente de confirmación de eliminación debe cerrarse. |

## TC-RI-06 — Eliminar vista (UI)
**Azure DevOps ID:** `2031`  
**Título original:** Delivery Notes-Hours Summary-Delete View-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Eliminar una vista y comprobar la interfaz relacionada con “Eliminar vista”. | La interfaz debe mantenerse intacta. |

## TC-RI-07 — Filtro de fecha personalizado (Funcionalidad)
**Azure DevOps ID:** `2032`  
**Título original:** Delivery Notes-Expense Summary-Filter-Date-Custom-Functionality

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Expense Summary**. | No especificado en Azure DevOps. |
| 3 | Hacer clic en el selector de fecha del campo **Fecha desde**. | Se debe abrir el calendario. |
| 4 | Hacer clic en una fecha. | La fecha inicial debe quedar seleccionada en el calendario. |
| 5 | Hacer clic en el selector de fecha del filtro **Fecha hasta**. | Se debe abrir el calendario. |
| 6 | Hacer clic en una fecha. | La fecha final debe quedar seleccionada en el calendario. |
| 7 | Hacer clic en **Filtrar**. | Se debe aplicar el filtro y devolver los datos comprendidos entre “Fecha desde” y “Fecha hasta”. |
| 8 | Hacer clic en el botón **Limpiar** de los filtros. | Se deben borrar los filtros aplicados. |

## TC-RI-08 — Filtro de fecha personalizado (UI)
**Azure DevOps ID:** `2033`  
**Título original:** Delivery Notes-Expense Summary-Filter-Date-Custom-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Aplicar un filtro de fecha y comprobar la interfaz. | La interfaz debe mantenerse intacta. |

**Observación:** el título menciona `Expense Summary`, pero el paso 2 indica `Hours Summary`. Se conserva el paso tal como aparece en Azure DevOps.

## TC-RI-09 — Filtro de fecha del mes actual (Funcionalidad)
**Azure DevOps ID:** `2034`  
**Título original:** Delivery Notes-Hours Summary-Filter-Date-Current Month-

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Hacer clic en el icono **Mes actual**, situado debajo de los campos de fecha. | “Fecha desde” debe establecerse en el primer día del mes actual y “Fecha hasta” en el último día del mes actual. |
| 4 | Hacer clic en **Filtrar**. | Se deben mostrar los datos del mes actual. |
| 5 | Hacer clic en **Limpiar**. | Se debe eliminar el filtro aplicado. |

## TC-RI-10 — Filtro de fecha del mes actual (UI)
**Azure DevOps ID:** `2035`  
**Título original:** Delivery Notes-Hours Summary-Filter-Date-Current Month-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Filtrar los informes por el mes actual y comprobar la interfaz. | La interfaz debe mantenerse intacta. |

## TC-RI-11 — Filtro de fecha de la semana actual (Funcionalidad)
**Azure DevOps ID:** `2036`  
**Título original:** Delivery Notes-Hours Summary-Filter-Date-Current Week-

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Hacer clic en el icono **Semana actual**, situado debajo de los campos de fecha. | “Fecha desde” debe establecerse en el primer día de la semana actual y “Fecha hasta” en el último día de la semana actual. |
| 4 | Hacer clic en **Filtrar**. | Se deben mostrar los datos de la semana actual. |
| 5 | Hacer clic en **Limpiar**. | Se debe eliminar el filtro aplicado. |

## TC-RI-12 — Filtro de fecha de la semana actual (UI)
**Azure DevOps ID:** `2037`  
**Título original:** Delivery Notes-Hours Summary-Filter-Date-Current week-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Filtrar los datos por la semana actual y comprobar la interfaz. | La interfaz debe mantenerse intacta. |

## TC-RI-13 — Filtro por división del proyecto (Funcionalidad)
**Azure DevOps ID:** `2038`  
**Título original:** Delivery Notes-Hours Summary-Filter-Division-Project-Functionality

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Escribir la división del proyecto en el campo **División**. | La división debe aparecer como sugerencia automática. |
| 4 | Seleccionar la división. | La división debe quedar seleccionada. |
| 5 | Hacer clic en **Filtrar**. | Se deben filtrar los datos correspondientes a la división del proyecto indicada. |
| 6 | Hacer clic en **Limpiar**. | Se deben borrar todos los filtros. |

## TC-RI-14 — Filtro por división del proyecto (UI)
**Azure DevOps ID:** `2039`  
**Título original:** Delivery Notes-Hours Summary-Filter-Division-Project-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Escribir la división del proyecto en el campo **División**. | La división debe aparecer como sugerencia automática. |
| 4 | Seleccionar la división. | La división debe quedar seleccionada. |
| 5 | Hacer clic en **Filtrar**. | Se deben filtrar los datos correspondientes a la división del usuario. |
| 6 | Comprobar la interfaz relacionada con la funcionalidad de filtro por división. | La interfaz debe mantenerse intacta. |

**Observación:** el resultado esperado del paso 5 menciona la división del usuario, aunque el título del caso se refiere a la división del proyecto.

## TC-RI-15 — Filtro por división del usuario (Funcionalidad)
**Azure DevOps ID:** `2040`  
**Título original:** Delivery Notes-Hours Summary-Filter-Division-User-Functionality

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Escribir la división del usuario en el campo **División**. | La división debe aparecer como sugerencia automática. |
| 4 | Seleccionar la división. | La división debe quedar seleccionada. |
| 5 | Hacer clic en **Filtrar**. | Se deben filtrar los datos correspondientes a la división del usuario. |
| 6 | Hacer clic en **Limpiar**. | Se deben borrar todos los filtros. |

## TC-RI-16 — Filtro por división del usuario (UI)
**Azure DevOps ID:** `2041`  
**Título original:** Delivery Notes-Hours Summary-Filter-Division-User-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Escribir la división del usuario en el campo **División**. | La división debe aparecer como sugerencia automática. |
| 4 | Seleccionar la división. | La división debe quedar seleccionada. |
| 5 | Hacer clic en **Filtrar**. | Se deben filtrar los datos correspondientes a la división del usuario. |
| 6 | Comprobar la interfaz relacionada con la funcionalidad de filtro por división. | La interfaz debe mantenerse intacta. |

## TC-RI-17 — Filtro por país (Funcionalidad)
**Azure DevOps ID:** `2042`  
**Título original:** Delivery Notes-Hours Summary-Filter-Country-Functionality

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Seleccionar todos los filtros obligatorios. | No especificado en Azure DevOps. |
| 4 | Ir al campo **País**. | No especificado en Azure DevOps. |
| 5 | Buscar y seleccionar el país. | No especificado en Azure DevOps. |
| 6 | Hacer clic en **Filtrar**. | Se deben filtrar los datos del país seleccionado. |
| 7 | Hacer clic en **Limpiar**. | Se deben borrar todos los filtros. |

## TC-RI-18 — Filtro por país (UI)
**Azure DevOps ID:** `2043`  
**Título original:** Delivery Notes-Hours Summary-Filter-Country-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary > Filtro por país**. | No especificado en Azure DevOps. |
| 3 | Comprobar la interfaz relacionada con la funcionalidad de filtro por país. | La interfaz debe mantenerse intacta. |

## TC-RI-19 — Filtro por centro de trabajo (Funcionalidad)
**Azure DevOps ID:** `2044`  
**Título original:** Delivery Notes-Hours Summary-Filter-Work center-Functionality

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Ir al campo **Centro de trabajo** y buscar utilizando cualquier palabra clave. | Se deben mostrar los centros de trabajo disponibles. |
| 4 | Seleccionar el centro de trabajo y hacer clic en **Filtrar**. | Se deben filtrar los datos correspondientes al centro de trabajo indicado. |
| 5 | Hacer clic en **Limpiar**. | Se deben borrar todos los filtros. |

## TC-RI-20 — Filtro por centro de trabajo (UI)
**Azure DevOps ID:** `2045`  
**Título original:** Delivery Notes-Hours Summary-Filter-Work center-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Comprobar la interfaz relacionada con Normative History. | La interfaz debe mantenerse intacta. |

**Observación:** el título se refiere al filtro por centro de trabajo, pero el paso 3 menciona “Normative History”.

## TC-RI-21 — Filtro por código de subproyecto (Funcionalidad)
**Azure DevOps ID:** `2046`  
**Título original:** BDelivery Notes-Hours Summary-Filter-code-Functionality

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Escribir el código del subproyecto en el campo **Código**. | No especificado en Azure DevOps. |
| 4 | Hacer clic en **Filtrar**. | Se debe filtrar el subproyecto que tenga el código indicado. |
| 5 | Hacer clic en **Limpiar**. | Se deben borrar todos los filtros. |

## TC-RI-22 — Filtro por código de subproyecto (UI)
**Azure DevOps ID:** `2047`  
**Título original:** Delivery Notes-Hours Summary-Filter-Code-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Completar todos los filtros obligatorios. | No especificado en Azure DevOps. |
| 4 | Escribir el código del subproyecto en el campo **Código**. | No especificado en Azure DevOps. |
| 5 | Hacer clic en **Filtrar**. | Se debe filtrar y seleccionar el subproyecto que tenga el código indicado. |
| 6 | Comprobar la interfaz relacionada con la funcionalidad de filtro por código. | La interfaz debe mantenerse intacta. |

## TC-RI-23 — Filtro por creador (Funcionalidad)
**Azure DevOps ID:** `2048`  
**Título original:** Delivery Notes-Hours Summary-Filter-Creator-Functionality

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Seleccionar los filtros obligatorios de fecha. | No especificado en Azure DevOps. |
| 4 | Ir al campo **Creador**. | No especificado en Azure DevOps. |
| 5 | Escribir en el campo el nombre del creador de la notificación. | No especificado en Azure DevOps. |
| 6 | Hacer clic en **Filtrar**. | Se deben listar las notificaciones cuyo creador coincida con el nombre seleccionado. |
| 7 | Hacer clic en **Limpiar**. | Se deben borrar todos los filtros. |

## TC-RI-24 — Filtro por creador (UI)
**Azure DevOps ID:** `2049`  
**Título original:** Delivery Notes-Hours Summary-Filter-Creator-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Comprobar la interfaz relacionada con la funcionalidad de filtro por creador. | La interfaz debe mantenerse intacta. |

## TC-RI-25 — Filtro por cliente (Funcionalidad)
**Azure DevOps ID:** `2050`  
**Título original:** Delivery Notes-Hours Summary-Filter-Customer-Functionality

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Hacer clic en el campo **Cliente**. | No especificado en Azure DevOps. |
| 4 | Buscar por el nombre del cliente. | Se deben listar los proyectos asociados al cliente buscado. |
| 5 | Hacer clic en **Limpiar**. | Se deben borrar todos los filtros. |

## TC-RI-26 — Filtro por cliente (UI)
**Azure DevOps ID:** `2051`  
**Título original:** Delivery Notes-Hours Summary-Filter-Customer-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Hacer clic en el campo **Cliente**. | No especificado en Azure DevOps. |
| 4 | Buscar por el nombre del cliente. | Se deben listar los proyectos relacionados con el nombre del cliente. |
| 5 | Comprobar la interfaz relacionada con el filtro de moneda. | La interfaz debe mantenerse intacta. |

**Observación:** el paso 5 menciona el filtro de moneda (`currency`), aunque el caso se titula filtro por cliente.

## TC-RI-27 — Selección de campos (Funcionalidad)
**Azure DevOps ID:** `2052`  
**Título original:** Delivery Notes-Hours Summary-Field Selection-Functionality

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Seleccionar los campos necesarios en el desplegable. | Los campos seleccionados deben quedar seleccionados. |
| 4 | Hacer clic en **Filtrar**. | La tabla de resultados debe mostrar los campos seleccionados. |
| 5 | Comprobar si es posible filtrar sin seleccionar los campos. | La selección de campos debe ser obligatoria. |
| 6 | Hacer clic en **Limpiar**. | Se deben borrar todos los filtros. |

## TC-RI-28 — Selección de campos (UI)
**Azure DevOps ID:** `2053`  
**Título original:** Delivery Notes-Hours Summary-Field Selection-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Seleccionar los campos necesarios y aplicar el filtro. | La interfaz debe mantenerse intacta. |
| 4 | Comprobar la interfaz relacionada con la selección de campos. | No especificado en Azure DevOps. |

## TC-RI-29 — Editar imputación (Funcionalidad)
**Azure DevOps ID:** `2157`  
**Título original:** Rapports-Imputation hours -Edit imputation-Functionality

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Abrir **Imputation Hours**. | No especificado en Azure DevOps. |
| 3 | Hacer clic en una fecha del calendario que tenga una imputación registrada. | Se debe mostrar la tabla de imputaciones correspondiente a esa fecha. |
| 4 | Hacer clic en el menú de más opciones de una imputación. | Se deben mostrar las opciones disponibles. |
| 5 | Seleccionar **Editar imputación**. | Se debe abrir el modal de edición de imputación. |
| 6 | Comprobar la fecha en el modal de imputación. | Se debe mostrar la fecha seleccionada. |
| 7 | Comprobar el nombre de usuario en el modal. | Debe aparecer el nombre del usuario para el que se creó la imputación. |
| 8 | Comprobar el campo **Creador** en el modal. | El creador debe ser el propio usuario cuando este haya creado una imputación para sí mismo. |
| 9 | Comprobar el campo **Creador** cuando un administrador haya creado la imputación para el usuario. | El creador debe figurar como “reporter” (informador), según el término utilizado en el caso original. |
| 10 | Comprobar el campo **Categoría**. | La categoría debe corresponder al proyecto seleccionado. |
| 11 | Intentar editar el proyecto. | El proyecto debe poder editarse. |
| 12 | Editar el campo **Subproyecto**. | Se deben poder seleccionar los subproyectos disponibles para el proyecto seleccionado. |
| 13 | Comprobar la edición de la tarea. | Se debe poder seleccionar una tarea disponible para el subproyecto seleccionado. |
| 14 | Comprobar si se puede editar la descripción predeterminada. | La descripción debe ser editable. |
| 15 | Comprobar el campo **Referencia interna**. | La referencia interna debe poder editarse. |
| 16 | Comprobar el funcionamiento del desplegable **Situación**. | La lista de situaciones debe poder editarse/seleccionarse. |
| 17 | Seleccionar una situación. | La situación seleccionada debe quedar marcada. |
| 18 | Comprobar el campo **Horas**. | Las horas deben poder editarse en formato `00:00`. |
| 19 | Comprobar el límite de horas de las imputaciones. | El máximo de horas imputadas para un día debe ser `23:59`. |
| 20 | Comprobar el comportamiento al introducir más de `23:59` horas. | Se debe mostrar una validación para el tiempo no válido. |
| 21 | Hacer clic en **Guardar**. | La imputación editada debe guardarse. |
| 22 | Comprobar que los proyectos, subproyectos y tareas editados se actualizan también en **Expense Summary**. | Los proyectos, subproyectos y tareas editados deben actualizarse también en el resumen de gastos. |
| 23 | Comprobar si se pueden editar proyectos con código 25 (imputación 0) utilizando proyectos normales. | Debe ser posible editar los “proyectos con código 25” con proyectos normales; se espera una validación para el tiempo de imputación igual a cero. |
| 24 | Comprobar que los gastos asociados a la imputación no se eliminan al editar los proyectos. | Los gastos deben permanecer sin cambios al editar la imputación. |

**Observación:** el paso 23 contiene una formulación ambigua en el original (“Projects with code 25(0 imputation)”). Se ha traducido literalmente sin reinterpretar la regla de negocio.

## TC-RI-30 — Editar imputación (UI)
**Azure DevOps ID:** `2158`  
**Título original:** Rapports-Imputation hours-edit imputation-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Abrir **Imputation Hours**. | No especificado en Azure DevOps. |
| 3 | Hacer clic en una fecha que tenga imputaciones. | Se debe mostrar la lista de imputaciones. |
| 4 | Hacer clic en el menú de más opciones de una imputación. | Se deben mostrar las opciones disponibles. |
| 5 | Hacer clic en la opción **Editar imputación**. | Se debe abrir el modal de edición de imputación. |
| 6 | Comprobar la interfaz de la página. | La interfaz debe mantenerse intacta. |

## TC-RI-31 — Eliminar imputación (Funcionalidad)
**Azure DevOps ID:** `2159`  
**Título original:** Rapports-Imputation hours -Delete imputation-Functionality

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Abrir **Imputation Hours**. | No especificado en Azure DevOps. |
| 3 | Hacer clic en una fecha del calendario que tenga imputaciones. | Se debe mostrar la tabla de imputaciones correspondiente a esa fecha. |
| 4 | Hacer clic en el menú de más opciones de una imputación. | Se deben mostrar las opciones disponibles. |
| 5 | Seleccionar el enlace **Eliminar imputación**. | Debe aparecer una ventana modal de confirmación de eliminación. |
| 6 | Comprobar la funcionalidad del botón **Aceptar** en la ventana de confirmación. | La imputación debe eliminarse. |
| 7 | Comprobar el botón **Cancelar** de la ventana de confirmación. | La ventana modal debe cerrarse. |

## TC-RI-32 — Eliminar imputación (UI)
**Azure DevOps ID:** `2160`  
**Título original:** Rapports-Imputation hours-Delete imputation-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Abrir **Imputation Hours**. | No especificado en Azure DevOps. |
| 3 | Hacer clic en una fecha que tenga imputaciones. | Se debe mostrar la lista de imputaciones. |
| 4 | Hacer clic en el menú de más opciones de una imputación. | Se deben mostrar las opciones disponibles. |
| 5 | Hacer clic en la opción **Editar imputación**. | Se debe abrir el modal de edición de imputación. |
| 6 | Comprobar la interfaz de la página. | La interfaz debe mantenerse intacta. |

**Observación:** aunque el título corresponde a eliminar imputación, los pasos 5 y 6 describen la apertura del modal de edición. Se conserva la definición original; conviene que el responsable funcional confirme si se trata de un error de copia.

## TC-RI-33 — Ordenación (Funcionalidad)
**Azure DevOps ID:** `2058`  
**Título original:** Delivery Notes-Hours Summary-Sorting-Functionality

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Aplicar filtros por división, proyecto, usuario o categoría. | No especificado en Azure DevOps. |
| 4 | Comprobar la ordenación ascendente de la columna **Fecha**. | Las fechas deben ordenarse de la más antigua a la más reciente. |
| 5 | Comprobar la ordenación descendente de la columna **Fecha**. | Las fechas deben ordenarse de la más reciente a la más antigua. |
| 6 | Comprobar la ordenación ascendente de campos como nombre, descripción, formato, idioma, tipo y grupo. | Los registros deben ordenarse alfabéticamente de la A a la Z. |
| 7 | Comprobar la ordenación descendente de campos como nombre, descripción, formato, idioma, tipo y grupo. | Los registros deben ordenarse alfabéticamente de la Z a la A. |
| 8 | Comprobar que la ordenación funciona también en páginas distintas de la primera. | La ordenación debe funcionar correctamente. |
| 9 | Comprobar la ordenación del campo **Horas**. | Las horas deben ordenarse de mayor a menor. |

## TC-RI-34 — Ordenación (UI)
**Azure DevOps ID:** `2059`  
**Título original:** Delivery Notes-Hours Summary-Sorting-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | La interfaz no debe verse afectada al ordenar. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Aplicar filtros por división, usuario, proyecto o categoría. | No especificado en Azure DevOps. |
| 4 | Comprobar la interfaz relacionada con la ordenación. | No especificado en Azure DevOps. |

## TC-RI-35 — Exportar a Excel (UI)
**Azure DevOps ID:** `2062`  
**Título original:** Rapports-Imputation Summary-Export to Excel -UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Rapports > Imputation Summary**. | No especificado en Azure DevOps. |
| 3 | Aplicar cualquier filtro. | No especificado en Azure DevOps. |
| 4 | Hacer clic en el enlace **Exportar a Excel**. | Los datos mostrados en pantalla (resultado filtrado) deben exportarse a Excel. |
| 5 | Comprobar la interfaz relacionada con la exportación a Excel. | La interfaz debe mantenerse intacta. |

## TC-RI-36 — Exportar a Excel (Funcionalidad)
**Azure DevOps ID:** `2061`  
**Título original:** Rapports-Imputation Summary-Export to Excel -Functionality

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Rapports > Imputation Summary**. | No especificado en Azure DevOps. |
| 3 | Aplicar cualquier filtro. | No especificado en Azure DevOps. |
| 4 | Hacer clic en el enlace **Exportar a Excel**. | Los datos mostrados en pantalla (resultado filtrado) deben exportarse a Excel. |

## TC-RI-37 — Arrastrar y soltar columnas
**Azure DevOps ID:** `2097`  
**Título original:** Delivery Notes-Hours Summary-Drag and Drop of columns-

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Aplicar filtros con cualquier valor. | No especificado en Azure DevOps. |
| 4 | Arrastrar las columnas de la tabla hacia la izquierda o hacia la derecha. | Las columnas de la tabla deben poder intercambiar sus posiciones mediante arrastrar y soltar. |
| 5 | Soltar las columnas arrastradas. | Debe ser posible soltar las columnas en la posición deseada de la tabla. |

## TC-RI-38 — Arrastrar y soltar columnas (UI)
**Azure DevOps ID:** `2098`  
**Título original:** Delivery Notes-Hours Summary-Drag and Drop of columns-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Delivery Notes > Hours Summary**. | No especificado en Azure DevOps. |
| 3 | Aplicar filtros con cualquier valor. | No especificado en Azure DevOps. |
| 4 | Arrastrar las columnas de la tabla hacia la izquierda o hacia la derecha. | Las columnas de la tabla deben poder intercambiar sus posiciones mediante arrastrar y soltar. |
| 5 | Soltar las columnas arrastradas. | Debe ser posible soltar las columnas en la posición deseada de la tabla. |
| 6 | Comprobar la interfaz relacionada con la funcionalidad de arrastrar y soltar. | La interfaz debe mantenerse intacta. |

## TC-RI-39 — Añadir imputación como completador (UI)
**Azure DevOps ID:** `2100`  
**Título original:** Rapports-Imputation Summary-Add imputation as completer-UI

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Imputation Summary**. | No especificado en Azure DevOps. |
| 3 | Hacer clic en el botón **Añadir imputación**. | Se debe abrir un modal para añadir una imputación como completador. |
| 4 | Comprobar la interfaz relacionada con añadir una imputación como completador. | La interfaz debe mantenerse intacta. |

## TC-RI-40 — Añadir imputación como completador (Funcionalidad)
**Azure DevOps ID:** `2099`  
**Título original:** Rapports-Imputation Summary-Add imputation as completer-

| Paso | Acción | Resultado esperado |
|---:|---|---|
| 1 | Abrir el portal Seidor Intranet. | No especificado en Azure DevOps. |
| 2 | Ir a **Imputation Summary**. | No especificado en Azure DevOps. |
| 3 | Hacer clic en el botón **Añadir imputación**. | Se debe abrir un modal para añadir una imputación como completador. |
| 4 | Hacer clic en el selector de fecha del campo **Fecha desde**. | Se debe abrir el calendario. |
| 5 | Seleccionar la fecha inicial en el calendario. | La fecha inicial debe quedar seleccionada. |
| 6 | Hacer clic en el selector de fecha del campo **Fecha hasta**. | Se debe abrir el calendario. |
| 7 | Seleccionar la fecha final en el calendario. | La fecha final debe quedar seleccionada. |
| 8 | Escribir el nombre de usuario en el campo **Usuario**. | Debe mostrarse una lista de sugerencias automáticas de usuarios que coincidan con el texto introducido. |
| 9 | Seleccionar el usuario de las sugerencias. | El usuario debe quedar seleccionado. |
| 10 | Escribir el nombre del proyecto en el campo **Proyecto**. | Debe mostrarse una lista de sugerencias automáticas de proyectos que coincidan con el texto introducido. |
| 11 | Seleccionar el proyecto de las sugerencias. | El proyecto debe quedar seleccionado. |
| 12 | Escribir el nombre del subproyecto en el campo de proyecto (así aparece indicado en el original). | Debe mostrarse una lista de sugerencias automáticas de subproyectos que coincidan con el texto introducido. |
| 13 | Seleccionar el subproyecto de las sugerencias. | El subproyecto debe quedar seleccionado. |
| 14 | Escribir el nombre de la tarea en el campo de proyecto (así aparece indicado en el original). | Debe mostrarse una lista de sugerencias automáticas que coincidan con el texto introducido. |
| 15 | Seleccionar la tarea de las sugerencias. | La tarea debe quedar seleccionada. |
| 16 | Introducir una descripción en el campo **Descripción**. | El campo debe aceptar una descripción de un máximo de 150 caracteres. |
| 17 | Introducir una referencia interna en el campo correspondiente. | La referencia interna debe añadirse al campo. |
| 18 | Seleccionar el desplegable **Situación**. | Se deben listar las situaciones y debe ser posible seleccionar una. |
| 19 | Introducir las horas en el campo **Horas**. | Se deben poder añadir horas, con un máximo de `23:59` horas. |
| 20 | Comprobar la funcionalidad del botón **Añadir**. | La imputación debe añadirse. |
| 21 | Comprobar las validaciones de los campos obligatorios. | Se deben mostrar las validaciones de los campos obligatorios. |
| 22 | Comprobar la validación al intentar añadir más de 24 horas. | Se debe mostrar una validación cuando se intenten añadir más de 24 horas en un día. |
| 23 | Comprobar la validación para un período de informes cerrado. | Se debe mostrar una validación si el período del informe está cerrado. |

**Observación:** el término “completer” se traduce como “completador” de forma literal. Conviene confirmar con el equipo funcional si es el nombre de un rol específico del producto. Los pasos 12 y 14 mencionan el campo “proyecto” aunque se refieren al subproyecto y a la tarea, respectivamente; se conserva esa particularidad del origen.

---

## Resumen de cobertura

| Bloque funcional | Casos |
|---|---:|
| Crear, editar y eliminar vistas | 6 |
| Filtros de fecha | 6 |
| Filtros por división, país, centro, código, creador y cliente | 14 |
| Selección de campos | 2 |
| Edición y eliminación de imputaciones | 4 |
| Ordenación | 2 |
| Exportación a Excel | 2 |
| Arrastrar y soltar columnas | 2 |
| Añadir imputación como completador | 2 |
| **Total** | **40** |

## Recomendaciones antes de entregar a desarrollo

1. Confirmar las rutas de navegación de los casos que mencionan `Back office`, `Sent Notification`, `Normative History`, `Delivery Notes` y `Rapports`, porque la suite contiene referencias mezcladas.
2. Revisar los casos `2033`, `2039`, `2045`, `2051` y `2160`, cuyos pasos o resultados esperados no coinciden claramente con el título o la funcionalidad.
3. Definir qué significa “la interfaz debe mantenerse intacta” mediante criterios verificables (elementos visibles, estados, mensajes, alineación o comportamiento responsive).
4. Completar los resultados esperados ausentes y concretar datos de prueba para filtros, rangos de fechas, ordenación, permisos y validaciones.
5. Aclarar la regla del proyecto con código 25 y el significado funcional de “completador” antes de convertir esos casos en criterios de aceptación definitivos.
