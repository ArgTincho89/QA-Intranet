# language: es
# Fuente: Azure DevOps, suite "Imputation hours" (plan 529 > suite 531), 22 casos TC-IH-01..22
# proporcionados por la QA del proyecto. Cada escenario reproduce, en el mismo orden, la acción
# (Dado/Cuando) y el resultado esperado (Entonces) de cada fila del test case; cuando la fila no
# tiene resultado esperado ("—") no se añade "Entonces". No se renumeran ni se fusionan pasos salvo
# que se documente explícitamente por qué (desvíos necesarios y lógicos, nunca arbitrarios).
#
# Datos de solo lectura usados como referencia estable: 12/05/2026 (día con imputaciones existentes),
# 01/05/2026 (festivo), 03/05/2026 (fin de semana). Datos de escritura: 14/07/2026, día laborable sin
# imputaciones reservado para los escenarios @datos-prueba, que limpian antes y después de ejecutar.
#
# Desvíos documentados respecto al texto del test case (necesarios, no hallucinados):
#  - TC-IH-03/04: el documento dice "modal" de añadir imputación; la UI real (imputation.component)
#    muestra un formulario embebido en la página al seleccionar un día, no un modal. Se usa
#    "formulario" y se da por abierto al seleccionar el día.
#  - TC-IH-05/06: el documento dice "Resumen de imputaciones" (módulo imputation-summary); esa ruta
#    devuelve 403 en el entorno de dev con el usuario de pruebas. El modal de edición que se
#    verifica es el MISMO componente (ModalImputationComponent/app-imputation) que usa esa pantalla,
#    así que se alcanza editando desde el calendario de Imputación horas, documentado en el escenario.
#  - TC-IH-19/20/21/22: el documento describe una columna "Fecha" y varias páginas de resultados,
#    propias de una tabla multi-fecha (igual que la de "Resumen de imputaciones"); la tabla de
#    Imputación horas está acotada a un solo día y no tiene columna Fecha. Se verifica paginación y
#    ordenación sobre las columnas y datos que sí existen en esa tabla, y se registra como no
#    automatizable lo que exige la vista multi-fecha inaccesible en dev.

@imputacion-horas
Característica: Imputación horas

  # ===================================================== Calendario
  @datos-prueba
  Escenario: TC-IH-01 Calendario - Calendario UI
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Imputación de horas
    # El día incompleto de referencia (14/07/2026) debe estar realmente vacío para que el color se
    # pueda verificar de forma determinista; no se puede dar por hecho que ya lo esté.
    Y el día de prueba está sin imputaciones
    Cuando verifico la interfaz del calendario
    Entonces la interfaz del calendario debe mostrarse correctamente
    Cuando verifico la interfaz del día actual
    Entonces el día actual debe mostrarse en color blanco con un borde
    Cuando verifico la interfaz de un día incompleto (sin imputaciones)
    Entonces el día incompleto debe mostrarse en color amarillo
    Cuando verifico la interfaz de un día con imputaciones
    Entonces el día debe mostrarse en color blanco y debe aparecer el tiempo imputado
    Cuando verifico la interfaz de los días festivos
    Entonces los días festivos deben mostrarse en azul oscuro
    Cuando verifico la interfaz de los fines de semana
    Entonces los fines de semana deben mostrarse en gris
    Cuando verifico la interfaz del día seleccionado
    Entonces el día seleccionado debe mostrarse en color azul

  @datos-prueba
  Escenario: TC-IH-02 Calendario - Funcionalidad del calendario
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Imputación de horas
    Y accedo al calendario
    Cuando verifico el mes y año predeterminados
    Entonces el calendario debe mostrar el mes y año actuales
    Cuando verifico el funcionamiento del botón de flecha izquierda
    Entonces se debe navegar al mes anterior
    Cuando verifico el funcionamiento del botón de flecha derecha
    Entonces se debe mostrar el mes siguiente
    Cuando hago clic en el año
    Entonces debe mostrarse una lista de años para seleccionar
    Cuando hago clic en el mes
    Entonces debe mostrarse una lista de meses para seleccionar
    Cuando selecciono un día que tenga imputaciones
    Entonces debe mostrarse la tabla con el detalle de las imputaciones de ese día
    Cuando verifico el resumen al seleccionar un día con imputaciones
    Entonces debe mostrarse el resumen del día seleccionado y el resumen del mes actual
    Cuando selecciono un día que no tenga imputaciones
    Entonces la tabla de imputaciones debe estar vacía
    Cuando verifico el resumen al seleccionar un día sin imputaciones
    Entonces el resumen del día debe mostrar cero y debe mantenerse el resumen del mes actual

  # ===================================================== Añadir imputación
  # El documento lista primero el caso "Funcionalidad" (ID 1792) y después el "UI" (ID 1793).
  @datos-prueba
  Escenario: TC-IH-03 Añadir imputación - Funcionalidad
    Dado que abro el portal de Seidor Intranet
    Y accedo a Imputación de horas
    Y el día de prueba está sin imputaciones
    Cuando hago clic en el botón Añadir imputación
    Entonces debe abrirse el formulario de añadir imputación
    Cuando verifico la fecha en el formulario
    Entonces debe mostrarse la fecha seleccionada
    Cuando verifico el nombre de usuario en el formulario
    Entonces debe mostrarse el nombre del usuario para el que se está añadiendo la imputación
    Cuando verifico el campo Creador cuando el usuario registra su propia imputación
    Entonces el creador debe ser el propio usuario
    Y se registra como no automatizable: "creador 'reportero' cuando un administrador registra la imputación: requiere iniciar sesión con un perfil administrador, no disponible para el usuario de pruebas"
    Cuando despliego la lista de proyectos con la lupa
    Entonces se listan proyectos activos para el usuario
    Cuando selecciono el proyecto "00_NC_SUBPROJECT" de la lista
    Entonces el proyecto seleccionado es "00_NC_SUBPROJECT"
    Y la categoría se asigna según el proyecto seleccionado
    Cuando despliego la lista de subproyectos con la lupa
    Entonces se listan los subproyectos disponibles del proyecto seleccionado
    Cuando selecciono el subproyecto "00_NC_SUBPROJECT_TASK - 02" de la lista
    Entonces el subproyecto seleccionado es "00_NC_SUBPROJECT_TASK - 02"
    Cuando despliego la lista de tareas con la lupa
    Entonces se listan las tareas disponibles del subproyecto seleccionado
    Cuando selecciono la tarea "TestTask7 - 02" de la lista
    Entonces la tarea seleccionada es "TestTask7 - 02"
    Y se carga la descripción predeterminada de la tarea seleccionada
    Cuando edito la descripción a "Descripción editada por la prueba automatizada"
    Entonces la descripción editada se mantiene en el campo
    Cuando escribo la referencia interna "REF-IH-AUTO"
    Entonces la referencia interna queda disponible en el campo
    Cuando despliego la lista de situaciones
    Entonces se muestra la lista de situaciones disponibles
    Cuando selecciono la situación "Teletrabajo"
    Entonces la situación seleccionada es "Teletrabajo"
    Cuando escribo las horas "0130" en el formulario
    Entonces las horas se añaden en formato 00:00 y el campo muestra "01:30"
    Cuando escribo las horas "2359" en el formulario
    Entonces el máximo permitido para un día, "23:59", se acepta en el campo
    Cuando intento escribir las horas "2400" en el formulario
    Entonces el campo de horas no admite un valor fuera de 00:00-23:59
    Cuando escribo las horas "0130" en el formulario
    Y hago clic en el botón Guardar
    Entonces la imputación se guarda correctamente
    Cuando abro un nuevo formulario de añadir imputación y selecciono el proyecto "00_NC_EMPTY" de la lista
    Entonces el proyecto seleccionado es "00_NC_EMPTY"
    Y se registra como no automatizable: "este cambio de proyecto demuestra que el proyecto es editable antes de guardar; el documento sitúa esta verificación después del guardado del paso anterior, por lo que no se guarda esta segunda selección"
    Cuando verifico si se puede añadir una imputación a un proyecto bloqueado
    Entonces se registra como no automatizable: "no se ha localizado en el entorno de pruebas ningún proyecto con el indicador 'bloqueado' (isActive=false); la validación existe en el código (projectBlocked) pero no hay datos para ejercitarla"
    Cuando selecciono el proyecto "00_T_TASK" de la lista
    Entonces la tarea de ese proyecto está caducada y no aparece en la lista de tareas disponibles, por lo que no es posible imputarle horas
    Cuando escribo en el buscador de proyectos los caracteres especiales "Ñ&/%"
    Entonces el campo de búsqueda de proyecto permite introducir caracteres especiales para buscar
    Y se registra como no automatizable: "el documento menciona el campo 'División' de datos SAP, que no existe en este formulario; se verifica el campo de búsqueda SAP equivalente que sí existe aquí (Proyecto)"
    Y se registra como no automatizable: "fechas de alta y baja del usuario en la compañía: requieren modificar datos maestros del usuario de pruebas, fuera del alcance de una prueba de UI"

  Escenario: TC-IH-04 Añadir imputación - UI
    Dado que abro el portal de Seidor Intranet
    Y accedo a Imputación de horas
    Cuando hago clic en el botón Añadir imputación
    Entonces debe abrirse el formulario de añadir imputación
    Cuando verifico la interfaz de la pantalla
    Entonces la interfaz debe mostrarse correctamente

  # ===================================================== Editar imputación
  # El documento lista primero el caso "Funcionalidad" (ID 1795) y después el "UI" (ID 1796).
  @datos-prueba
  Escenario: TC-IH-05 Editar imputación - Funcionalidad
    Dado que abro el portal de Seidor Intranet
    Y accedo al Resumen de imputaciones
    Y el día de prueba está sin imputaciones
    Y creo una imputación de prueba con descripción "Imputación para editar" y horas "01:00"
    Cuando selecciono en el calendario la fecha de prueba, que tiene imputaciones
    Entonces debe mostrarse la tabla de imputaciones correspondiente a esa fecha
    Cuando hago clic en las opciones adicionales de una imputación
    Entonces deben mostrarse las opciones disponibles
    Cuando selecciono Editar imputación
    Entonces debe abrirse el diálogo de edición de imputación
    Cuando verifico la fecha en el diálogo de edición
    Entonces debe mostrarse la fecha seleccionada
    Cuando verifico el nombre de usuario en el diálogo de edición
    Entonces debe mostrarse el nombre del usuario para el que se registró la imputación
    Cuando verifico el campo Creador cuando el usuario registra su propia imputación
    Entonces el creador debe ser el propio usuario
    Y se registra como no automatizable: "creador 'reportero' cuando un administrador registra la imputación para otro usuario: requiere perfil administrador"
    Y la categoría se asigna según el proyecto seleccionado
    Cuando intento editar el proyecto en el diálogo de edición
    Entonces el proyecto es editable
    Cuando edito el subproyecto en el diálogo de edición
    Entonces puede seleccionarse un subproyecto disponible del proyecto seleccionado
    Cuando edito la tarea en el diálogo de edición
    Entonces puede seleccionarse una tarea disponible del subproyecto seleccionado
    Cuando edito la descripción en el diálogo de edición
    Entonces la descripción es editable
    Cuando edito la referencia interna en el diálogo de edición
    Entonces la referencia interna es editable
    Cuando despliego la lista de situaciones en el diálogo de edición
    Entonces la lista de situaciones está disponible para su edición
    Cuando selecciono la situación "En la oficina" en el diálogo de edición
    Entonces la situación seleccionada es "En la oficina"
    Cuando escribo en el diálogo de edición las horas "0200"
    Entonces las horas son editables en formato 00:00 y el campo muestra "02:00"
    Cuando intento escribir en el diálogo de edición las horas "2400"
    Entonces el campo de horas no admite un valor fuera de 00:00-23:59
    Cuando escribo en el diálogo de edición las horas "0200"
    Y hago clic en el botón Guardar del diálogo de edición
    Entonces la imputación editada se guarda correctamente
    Y se registra como no automatizable: "actualización del resumen de gastos tras editar proyecto/subproyecto/tarea: el resumen de gastos vive en el módulo 'Resumen gastos', fuera del alcance de esta imputación"
    Y se registra como no automatizable: "proyectos con código 25 (imputación cero) combinados con proyectos ordinarios: no se ha localizado en el entorno de pruebas un proyecto de ese tipo"
    Y se registra como no automatizable: "los gastos no se eliminan al editar los proyectos: requiere repetir TC-IH-09 (añadir gasto) sobre esta misma imputación antes de editarla, y no está comprobado en este escenario"
    Y se registra como no automatizable: "edición de un informe añadido por el responsable (completer): requiere una imputación creada por otro usuario con rol de responsable, no disponible para el usuario de pruebas"

  Escenario: TC-IH-06 Editar imputación - UI
    Dado que abro el portal de Seidor Intranet
    Y accedo al Resumen de imputaciones
    Cuando selecciono en el calendario una fecha que tenga imputaciones
    Entonces debe mostrarse la lista de imputaciones
    Cuando hago clic en las opciones adicionales de una imputación
    Entonces deben mostrarse las opciones disponibles
    Cuando selecciono la opción Editar imputación
    Entonces debe abrirse el diálogo de edición de imputación
    Cuando verifico la interfaz de la pantalla
    Entonces la interfaz debe mostrarse correctamente

  # ===================================================== Eliminar imputación
  @datos-prueba
  Escenario: TC-IH-07 Eliminar imputación - Funcionalidad
    Dado que abro el portal de Seidor Intranet
    Y accedo a Imputación de horas
    Y el día de prueba está sin imputaciones
    Y creo una imputación de prueba con descripción "Imputación para borrar" y horas "00:45"
    Cuando selecciono en el calendario la fecha de prueba, que tiene imputaciones
    Entonces debe mostrarse la tabla de imputaciones correspondiente a esa fecha
    Cuando hago clic en las opciones adicionales de una imputación
    Entonces deben mostrarse las opciones disponibles
    Cuando selecciono la opción Eliminar imputación
    Entonces debe aparecer una ventana modal solicitando confirmación de la eliminación
    Cuando verifico el funcionamiento del botón Cancelar de la ventana de confirmación
    Entonces la ventana modal debe cerrarse sin eliminar la imputación
    Cuando hago clic en las opciones adicionales de una imputación
    Y selecciono la opción Eliminar imputación
    Y verifico el funcionamiento del botón Aceptar en la ventana de confirmación
    Entonces la imputación debe eliminarse
    Y se registra como no automatizable: "eliminar una imputación creada por el responsable (completer): requiere una imputación creada por otro usuario con rol de responsable, no disponible para el usuario de pruebas"

  Escenario: TC-IH-08 Eliminar imputación - UI
    Dado que abro el portal de Seidor Intranet
    Y accedo a Imputación de horas
    Cuando selecciono en el calendario una fecha que tenga imputaciones
    Entonces debe mostrarse la lista de imputaciones
    Cuando hago clic en las opciones adicionales de una imputación
    Entonces deben mostrarse las opciones disponibles
    Cuando selecciono la opción Eliminar imputación
    Entonces debe aparecer una ventana modal solicitando confirmación de la eliminación
    Cuando verifico la interfaz de la pantalla
    Entonces la interfaz debe mostrarse correctamente

  # ===================================================== Añadir gasto
  @datos-prueba
  Escenario: TC-IH-09 Añadir gasto - Funcionalidad
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Imputación de horas
    Y el día de prueba está sin imputaciones
    Y creo una imputación de prueba con descripción "Imputación con gasto" y horas "01:00"
    Y selecciono en el calendario la fecha de prueba, que tiene imputaciones
    Y selecciono la imputación de la tabla
    Cuando hago clic en el enlace Añadir gasto
    Entonces debe abrirse la ventana para añadir gastos
    # Desvío documentado: el documento sube el justificante antes de elegir el tipo de gasto, pero con
    # el tipo de gasto vacío el backend devuelve 500 al subir el ticket (POST /rapports/tickets ->
    # System.FormatException: "The input string '' was not in a correct format", confirmado en dev).
    # Se elige primero el tipo de gasto para poder ejercitar el resto del paso de forma realista.
    Cuando hago clic en el desplegable Tipo de gasto
    Entonces se abre el desplegable y se muestra la lista de tipos de gasto disponibles
    Cuando selecciono el tipo de gasto "Taxi" del desplegable
    Entonces el tipo de gasto seleccionado es "Taxi"
    Y el campo Moneda está habilitado para un tipo de gasto distinto de Kilómetro
    Cuando hago clic en el icono Seleccionar archivo para elegir una imagen
    Entonces debe ser posible cargar una imagen desde los archivos
    Y se registra como no automatizable: "reconocimiento de los datos de la imagen por IA (factura real) y su comportamiento cuando la IA no puede leerla: requiere un justificante real y un servicio de IA que no se puede ejercitar de forma determinista en una prueba automatizada"
    Entonces el selector de archivo acepta JPEG, PNG, JPG o PDF
    Y se registra como no automatizable: "moneda cuando el tipo de gasto es Kilómetro (debe ser la del perfil del usuario): no se puede alterar la moneda configurada en el perfil del usuario de pruebas"
    Cuando escribo en el campo Importe "abc12"
    Entonces el campo Importe acepta únicamente números
    Cuando escribo en el campo Importe "123456789"
    Entonces el campo Importe permite como máximo 7 dígitos
    Y se registra como no automatizable: "cálculo del importe cuando el tipo de gasto es Kilómetro según la tarifa por kilómetro: depende de un cálculo de ruta con un servicio externo, ver más abajo"
    Cuando escribo en el campo Importe "25"
    Entonces el campo Destino acepta hasta 50 caracteres para el nombre del lugar
    Cuando relleno el campo Destino "Madrid" y la descripción "Prueba automatizada gasto"
    Y se registra como no automatizable: "la dirección se selecciona a partir de resultados de búsqueda, ida y vuelta, añadir parada y calcular km: todos dependen del servicio externo de geocodificación/rutas (tipo de gasto Kilómetro), no determinista en una prueba automatizada"
    Cuando verifico la carga de archivos para un tipo de gasto distinto de Kilómetro
    Entonces se aceptan archivos JPEG, PNG, JPG o PDF de menos de 5 MB
    Y se registra como no automatizable: "no se permite cargar archivos cuando el tipo de gasto es Kilómetro: requiere repetir el flujo con tipo de gasto Kilómetro, ya marcado como no automatizable arriba por depender del cálculo de rutas"
    Cuando hago clic en el botón Guardar del gasto
    Entonces el gasto aparece en la tabla de gastos del detalle con el importe "25"
    # "Añadir gasto" siempre abre un formulario en blanco (no permite reabrir un gasto ya guardado
    # para editarlo); el botón Eliminar se verifica sobre un gasto recién añadido a ese formulario,
    # antes de guardar, tal como describe el propio test case en el paso siguiente (dos o más gastos).
    # Para evitar guardar el formulario sin ninguna línea (caso borde que deja el diálogo en un estado
    # inconsistente), el botón Eliminar se comprueba sobre una línea de sobra mientras queda otra para
    # guardar; de paso cubre también "dos o más justificantes" (paso siguiente del documento).
    Cuando abro de nuevo el formulario de añadir gasto y relleno dos gastos nuevos
    Y hago clic en el botón Eliminar de uno de esos gastos
    Y guardo el formulario de gasto
    Entonces el gasto queda eliminado al guardar el formulario de añadir gasto
    Y es posible añadir más de un justificante y guardarlos
    Y se registra como no automatizable: "número máximo de kilómetros (99999) en el campo Kilómetro: depende del tipo de gasto Kilómetro, no automatizable por el cálculo de rutas"

  Escenario: TC-IH-10 Añadir gasto - UI
    Dado que abro el portal de Seidor Intranet
    Y accedo a Imputación de horas
    Y accedo a Añadir gasto
    Cuando añado un gasto con justificante
    Y verifico la interfaz de usuario
    Entonces la interfaz debe mostrarse correctamente

  # ===================================================== Página de detalle
  Escenario: TC-IH-11 Página de detalle - UI
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Imputación de horas
    Y selecciono en el calendario un día que tenga imputaciones
    Cuando hago clic en una imputación de la tabla
    Entonces se navega a la página de detalle de la imputación
    Y verifico la interfaz de usuario de la página de detalle
    Entonces la interfaz debe mostrarse correctamente

  Escenario: TC-IH-12 Página de detalle - Funcionalidad
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Imputación de horas
    Y selecciono en el calendario un día que tenga imputaciones
    Y memorizo los datos de la primera fila de la tabla
    Cuando hago clic en una imputación de la tabla
    Entonces se navega a la página de detalle de la imputación
    Cuando verifico el funcionamiento del botón Añadir gasto
    Entonces debe abrirse el formulario para añadir gastos
    Cuando cierro el formulario de gasto
    Entonces los datos de la imputación en el detalle son correctos
    Y los gastos son correctos en la página de detalle
    Cuando verifico el funcionamiento del botón Cerrar
    Entonces la página de detalle debe cerrarse

  # ===================================================== Resumen
  Escenario: TC-IH-13 Resumen - UI
    Dado que abro el portal de Seidor Intranet
    Y accedo al formulario de añadir imputación
    Y accedo a la sección Resumen
    Cuando verifico la interfaz de usuario del Resumen
    Entonces la interfaz debe mostrarse correctamente

  Escenario: TC-IH-14 Resumen - Funcionalidad
    Dado que abro el portal de Seidor Intranet
    Y accedo al formulario de añadir imputación
    Y selecciono en el calendario un día que tenga imputaciones
    Y accedo a la sección Resumen
    Cuando verifico el tiempo imputado durante el día
    Entonces el tiempo mostrado en el resumen es correcto
    Cuando verifico el tiempo total del mes
    Entonces la suma total del tiempo del mes es correcta
    Cuando verifico los gastos añadidos durante el día
    Entonces los gastos mostrados en el resumen del día son correctos
    Cuando verifico los gastos añadidos durante el mes
    Entonces los gastos mostrados en el resumen del mes son correctos

  # ===================================================== Copiar día
  Escenario: TC-IH-15 Copiar día - UI
    Dado que abro el portal de Seidor Intranet
    Y accedo a Imputación de horas
    Y selecciono en el calendario un día que tenga imputaciones
    Cuando hago clic en el botón Copiar día
    Entonces se abre el diálogo Copiar día y la interfaz se muestra correctamente

  @datos-prueba
  Escenario: TC-IH-16 Copiar día - Funcionalidad
    Dado que abro el portal de Seidor Intranet
    Y accedo a Imputación de horas
    Y el día de prueba está sin imputaciones
    Y creo una imputación de prueba con descripción "Imputación para copiar" y horas "01:00"
    Y selecciono en el calendario la fecha de prueba, que tiene imputaciones
    Cuando hago clic en el botón Copiar día
    Entonces el diálogo Copiar día se abre
    Cuando verifico la fecha que se va a copiar en el diálogo
    Entonces la fecha que se va a copiar se muestra en el diálogo
    Cuando selecciono el botón de opción Días
    Entonces queda marcado el modo de selección de días aleatorios a los que copiar la imputación
    Y se registra como no automatizable: "seleccionar fechas aleatorias en el calendario del diálogo (incluyendo de distintos meses), quitar una fecha seleccionada con su botón de cierre y navegar con ‹/› ese calendario: es un calendario de selección múltiple embebido en el diálogo, distinto del calendario principal, y no se ha podido automatizar de forma fiable sin arriesgar una copia real de datos sobre otros días del entorno"
    Cuando hago clic en el botón Copiar sin ninguna fecha seleccionada
    Entonces el botón Copiar está deshabilitado
    Cuando selecciono el botón de opción Rango
    Entonces queda marcado el modo de selección de un rango de fechas al que copiar los datos
    Cuando hago clic en el botón Cancelar del diálogo Copiar día
    Entonces el diálogo Copiar día se cierra
    Y se registra como no automatizable: "ejecutar la copia real (botón Copiar con fechas o rango seleccionados), su mensaje de confirmación, la casilla de sobrescritura cuando el periodo ya tiene datos, la restricción de fines de semana y el error al superar 31 días: todo ello depende de completar la selección en ese calendario múltiple, ver el punto anterior; se automatiza en su lugar que el botón Copiar permanece deshabilitado sin selección y que los modos Días/Rango son seleccionables"
    Cuando selecciono en el calendario el día de prueba, sin imputaciones, y verifico el menú más acciones
    Entonces la opción Copiar día está deshabilitada o ausente para un día sin imputaciones
    Y se registra como no automatizable: "validación por cierre del periodo de informes de una división: requiere una división con el periodo de informes cerrado, no disponible para el usuario de pruebas"

  # ===================================================== Eliminar día
  Escenario: TC-IH-17 Eliminar día - UI
    Dado que abro el portal de Seidor Intranet
    Y selecciono en el calendario un día que tenga imputaciones
    Cuando hago clic en el botón Eliminar día dentro de las opciones adicionales
    Entonces aparece el diálogo de confirmación de borrado de día y la interfaz se muestra correctamente

  @datos-prueba
  Escenario: TC-IH-18 Eliminar día - Funcionalidad
    Dado que abro el portal de Seidor Intranet
    Y el día de prueba está sin imputaciones
    Y creo una imputación de prueba con descripción "Día a borrar" y horas "01:00"
    Y selecciono en el calendario la fecha de prueba, que tiene imputaciones
    Cuando hago clic en el botón Eliminar día dentro de las opciones adicionales
    Entonces aparece una ventana de confirmación antes de eliminar
    Cuando hago clic en el botón Cancelar de la ventana de confirmación
    Entonces la ventana de confirmación se cierra sin eliminar el día
    Cuando hago clic en el botón Eliminar día dentro de las opciones adicionales
    Y hago clic en el botón Aceptar de la ventana de confirmación
    Entonces el día y sus horas imputadas se eliminan

  # ===================================================== Paginación
  Escenario: TC-IH-19 Paginación - UI
    Dado que abro el portal de Seidor Intranet
    Entonces la interfaz debe mostrarse correctamente
    Y accedo a Informes → Imputación de horas
    Cuando selecciono en el calendario un día sin imputaciones y verifico la paginación y la interfaz
    Entonces la interfaz debe mostrarse correctamente
    Cuando selecciono en el calendario un día con imputaciones y hago clic en el desplegable de elementos por página
    Entonces la interfaz debe mostrarse correctamente
    Cuando verifico que se pueden seleccionar números de página desde el desplegable
    Entonces la interfaz debe mostrarse correctamente
    Cuando cambio el número de elementos por página
    Entonces la interfaz debe mostrarse correctamente
    Cuando añado o elimino registros y verifico la paginación
    Entonces la interfaz debe mostrarse correctamente
    Cuando ordeno los registros y verifico la paginación
    Entonces la interfaz debe mostrarse correctamente
    Y se registra como no automatizable: "flechas simples/dobles de cambio de página y selección de números de página: el documento describe una tabla multi-fecha con varias páginas de resultados; la tabla de Imputación horas está acotada a un solo día y, con los datos de prueba disponibles, no llega a tener una segunda página"

  @datos-prueba
  Escenario: TC-IH-20 Paginación - Funcionalidad
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Imputación de horas
    Y el día de prueba está sin imputaciones
    Cuando selecciono en el calendario la fecha de prueba, sin imputaciones
    Entonces la paginación no se muestra porque no hay registros en la página
    Cuando creo tres imputaciones de prueba con distintas descripciones y horas
    Entonces la tabla de imputaciones muestra 3 filas
    Y la paginación, si existe, se personaliza según los elementos por página
    Cuando hago clic en el desplegable de elementos por página
    Entonces se muestra el número de elementos disponibles por página
    Y se registra como no automatizable: "seleccionar número de página desde el desplegable, botones de flecha simple/doble y clic en números de página: requieren más de una página de datos; el entorno de pruebas no tiene volumen suficiente para llegar a una segunda página en la tabla de un solo día"

  # ===================================================== Ordenación
  Escenario: TC-IH-21 Ordenación - Funcionalidad
    Dado que abro el portal de Seidor Intranet
    Y accedo a Imputación de horas
    Y el día de prueba está sin imputaciones
    Y creo tres imputaciones de prueba con distintas descripciones y horas
    Y selecciono en el calendario la fecha de prueba, que tiene imputaciones
    Cuando verifico la ordenación ascendente de la columna Horas
    Entonces los valores de la columna Horas se ordenan de forma ascendente
    Cuando verifico la ordenación descendente de la columna Horas
    Entonces los valores de la columna Horas se ordenan de forma descendente
    Cuando verifico la ordenación ascendente del campo Descripción
    Entonces los registros se ordenan alfabéticamente de la A a la Z
    Cuando verifico la ordenación descendente del campo Descripción
    Entonces los registros se ordenan alfabéticamente de la Z a la A
    Y se registra como no automatizable: "ordenación de las columnas Fecha y Gastos, y de los campos Proyecto, Subproyecto, Tarea, Situación y Creador con varios valores distintos, y la ordenación en páginas distintas de la primera: el documento describe una tabla multi-fecha con varias páginas; la tabla de Imputación horas de un solo día no tiene columna Fecha y, con los datos de prueba disponibles, no llega a una segunda página"

  Escenario: TC-IH-22 Ordenación - UI
    Dado que abro el portal de Seidor Intranet
    Y accedo a Imputación de horas
    Y selecciono en el calendario un día que tenga imputaciones
    Cuando ordeno los registros de la tabla
    Entonces la interfaz no se ve afectada al ordenar
