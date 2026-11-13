# language: es
# Fuente: Azure DevOps, plan 03-Rapports, suite "Imputations summary" (ID 532), 40 casos TC-RI-01..40
# (documento Test_Cases_Resumen_Imputaciones_ES.md). Cada escenario reproduce, en el mismo orden, la acción
# (Dado/Cuando) y el resultado esperado (Entonces) de cada fila del test case; cuando la fila no tiene
# resultado esperado ("No especificado en Azure DevOps") no se añade "Entonces". No se renumeran ni se
# fusionan pasos salvo que se documente explícitamente por qué.
#
# Datos de prueba (verificados en dev):
#  - Lectura: fechas de 2026 con imputaciones de varios usuarios; 12/05/2026 en Imputación horas para TC-RI-30/32.
#  - Escritura: día 14/07/2026 (laborable, vacío) con el proyecto 00_NC_SUBPROJECT / 00_NC_EMPTY. Se limpia
#    antes y después (@datos-prueba). Periodo cerrado: 15/01/2025 con 00_NC_EMPTY ("División cerrada").
#  - Vistas: solo se crean y borran vistas propias con prefijo QA_RI_ (@vistas-prueba); nunca se tocan las
#    vistas existentes del entorno (2024, PRUEBA, GENERICA, Nayana, pruebaJUAN).
#
# Desvíos documentados respecto al texto del test case (necesarios, no inventados):
#  - TC-RI-02/03: al guardar una vista con algún filtro además de las fechas el modal no ofrece la
#    casilla Genérica (comprobado en vivo con División, Proyecto, División usuario y Usuario): se omite ese paso.
#  - Navegación: los casos mencionan "Back office > Sent Notification", "Normative History", "Delivery Notes >
#    Hours Summary / Expense Summary" (el propio documento advierte que son referencias mezcladas). Todas las
#    funcionalidades descritas (vistas, filtros, selección de campos, ordenación, arrastrar columnas) existen
#    en la pantalla real "Informes > Resumen de imputaciones" (/rapports/imputation-summary), a la que navegan
#    todos los escenarios. TC-RI-29..32 usan "Imputación de horas", como indica el documento.
#  - Filtrar solo se habilita con un rango de fechas: donde el caso no menciona fechas se añade el paso previo
#    "selecciono el rango Mes actual" (marcado con comentario en cada escenario).
#  - Textos de botones reales: "Borrar" (el documento dice "Eliminar"/"Aceptar"), "Guardar" en el modal de
#    añadir imputación (el documento dice "Añadir").
#  - TC-RI-17..26 (corregido 2026-11-13): País, Centro de trabajo, Código, Creador y Cliente NO existen en
#    Resumen de imputaciones, pero sí existen y funcionan en otras pantallas reales de Backoffice a las que el
#    usuario de prueba ya tiene acceso (confirmado leyendo el frontend y verificando en vivo): País y Centro de
#    trabajo en "Histórico normativas" (normative-summary), Código en "Resumen subproyectos" (subproject-summary),
#    Creador en "Notificaciones enviadas" (sent-notification-summary) y Cliente en "Resumen proyectos"
#    (project-summary). Estos 10 escenarios navegan a esas pantallas en vez de a Resumen de imputaciones; el
#    paso 5 de TC-RI-26 (filtro de moneda) sigue sin automatizar porque no se ha localizado en ninguna pantalla.
#  - TC-RI-15/16: la tabla muestra códigos de división de usuario (p. ej. ST20) que no son seleccionables en el
#    filtro (solo V1 y ZZ), y esas divisiones no tienen imputaciones: el filtro se aplica y devuelve "No hay datos".
#  - TC-RI-29/31: los pasos que dependen de datos no disponibles (perfil administrador, Expense Summary, código 25,
#    gastos) se registran como no automatizables igual que en TC-IH-05/07.
#  - TC-RI-31: el documento prueba "Aceptar" y después "Cancelar"; tras aceptar ya no queda imputación sobre la que
#    abrir otro diálogo, por lo que se prueba primero "Cancelar" (igual que TC-IH-07).
#  - TC-RI-27: al vaciar Campos la pantalla no muestra el texto "Campo obligatorio" (el control no pasa a "touched");
#    la obligatoriedad se verifica con Filtrar deshabilitado y el control Campos marcado como inválido.
#  - TC-RI-33: las columnas "nombre, descripción, formato, idioma, tipo y grupo" no existen en esta tabla; se ordenan
#    las columnas de texto reales Usuario, Proyecto y Situación (Descripción, Subproyecto, Tarea y Creador vienen vacíos en los datos de dev).
#  - TC-RI-40: la descripción acepta hasta 500 caracteres (el documento dice 150); el selector de fecha es un único
#    selector de rango (los pasos 4-7 se hacen sobre ese selector); los pasos 12 y 14 se ejecutan sobre los campos
#    Subproyecto y Tarea.

@resumen-imputaciones
Característica: Resumen imputaciones

  # ===================================================== Vistas
  @vistas-prueba
  Escenario: TC-RI-01 - Crear vista (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    Cuando creo la vista "QA_RI_UI" y compruebo la interfaz relacionada con Crear vista
    Entonces la interfaz de Resumen de imputaciones debe mantenerse intacta

  @vistas-prueba
  Escenario: TC-RI-02 - Crear vista (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    Cuando selecciono el filtro de fecha obligatorio desde "05/01/2026" hasta "20/01/2026"
    # DESVÍO: se omite "cualquier otro filtro" porque con cualquier filtro además de las fechas el modal no ofrece Genérica
    Y hago clic en Guardar
    Entonces se abre el modal "Guardar vista"
    Cuando introduzco el nombre de la vista "QA_RI_FUNC"
    Entonces el nombre se introduce sin problemas de interfaz
    Cuando marco la casilla para crear la vista como genérica
    Entonces la casilla Genérica queda marcada
    Cuando hago clic en Guardar dentro del modal "Guardar vista"
    Entonces la vista "QA_RI_FUNC" se guarda y es genérica

  @vistas-prueba
  Escenario: TC-RI-03 - Editar vista (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    # Para no modificar vistas compartidas del entorno se parte de una vista propia creada como precondición.
    Y existe la vista de prueba "QA_RI_EDIT"
    Cuando selecciono la vista "QA_RI_EDIT"
    # DESVÍO: se omite "cualquier otro filtro" porque con cualquier filtro además de las fechas el modal no ofrece Genérica
    Y hago clic en Guardar
    Entonces se abre el modal "Guardar vista"
    Cuando selecciono el botón de opción correspondiente a "Guardar como"
    Entonces se puede guardar la vista con el nombre existente "QA_RI_EDIT" o con uno nuevo
    Cuando selecciono el nombre existente "QA_RI_EDIT" en la opción Guardar como
    Entonces la vista se guardará con el nombre existente "QA_RI_EDIT"
    Cuando selecciono Nueva vista
    Entonces se muestra el campo para introducir un nuevo nombre para la vista
    Cuando escribo el nombre de la vista "QA_RI_EDIT2"
    Entonces el nombre de la vista queda introducido con "QA_RI_EDIT2"
    Cuando marco la casilla para crear la vista como genérica
    Entonces la casilla Genérica queda marcada
    Cuando hago clic en Guardar dentro del modal "Guardar vista"
    Entonces la vista "QA_RI_EDIT2" se guarda y es genérica

  @vistas-prueba
  Escenario: TC-RI-04 - Editar vista (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    Y existe la vista de prueba "QA_RI_EDITUI"
    Cuando edito la vista "QA_RI_EDITUI" y compruebo la interfaz relacionada con Editar vista
    Entonces la interfaz de Resumen de imputaciones debe mantenerse intacta

  @vistas-prueba
  Escenario: TC-RI-05 - Eliminar vista (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    # Se crean dos vistas propias: tras confirmar el borrado de la primera se necesita otra para abrir de nuevo
    # la confirmación y probar Cancelar (el documento lo prueba a continuación en el mismo caso).
    Y existe la vista de prueba "QA_RI_DEL1"
    Y existe la vista de prueba "QA_RI_DEL2"
    Cuando selecciono la vista "QA_RI_DEL1"
    Y hago clic en el botón Eliminar vista
    Entonces se abre una ventana emergente de confirmación
    Cuando hago clic en Borrar dentro de la ventana de confirmación
    Entonces la vista "QA_RI_DEL1" se elimina
    Cuando selecciono la vista "QA_RI_DEL2"
    Y hago clic en el botón Eliminar vista
    Y hago clic en el botón Cancelar de la ventana de confirmación de la vista
    Entonces la ventana emergente de confirmación de eliminación se cierra y la vista "QA_RI_DEL2" sigue existiendo

  @vistas-prueba
  Escenario: TC-RI-06 - Eliminar vista (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    Y existe la vista de prueba "QA_RI_DELUI"
    Cuando elimino la vista "QA_RI_DELUI" y compruebo la interfaz relacionada con Eliminar vista
    Entonces la interfaz de Resumen de imputaciones debe mantenerse intacta

  # ===================================================== Filtros de fecha
  Escenario: TC-RI-07 - Filtro de fecha personalizado (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    Cuando hago clic en el selector de fecha del campo Fecha desde
    Entonces se abre el calendario
    Cuando hago clic en la fecha "05/01/2026"
    Entonces la fecha inicial "05/01/2026" queda seleccionada
    Cuando hago clic en el selector de fecha del campo Fecha hasta
    Entonces se abre el calendario
    Cuando hago clic en la fecha "20/01/2026"
    Entonces la fecha final "20/01/2026" queda seleccionada
    Cuando hago clic en Filtrar
    Entonces se aplica el filtro y se devuelven los datos comprendidos entre "05/01/2026" y "20/01/2026"
    Cuando hago clic en Limpiar
    Entonces se borran los filtros aplicados

  Escenario: TC-RI-08 - Filtro de fecha personalizado (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    Cuando aplico el filtro de fecha desde "05/01/2026" hasta "20/01/2026" y compruebo la interfaz
    Entonces la interfaz de Resumen de imputaciones debe mantenerse intacta

  Escenario: TC-RI-09 - Filtro de fecha del mes actual (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    Cuando hago clic en el icono Mes actual
    Entonces Fecha desde es el primer día del mes actual y Fecha hasta es el último día del mes actual
    Cuando hago clic en Filtrar
    Entonces se muestran los datos del mes actual
    Cuando hago clic en Limpiar
    Entonces se elimina el filtro aplicado

  Escenario: TC-RI-10 - Filtro de fecha del mes actual (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    Cuando filtro los informes por el mes actual y compruebo la interfaz
    Entonces la interfaz de Resumen de imputaciones debe mantenerse intacta

  Escenario: TC-RI-11 - Filtro de fecha de la semana actual (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    Cuando hago clic en el icono Semana actual
    Entonces Fecha desde es el primer día de la semana actual y Fecha hasta es el último día de la semana actual
    Cuando hago clic en Filtrar
    Entonces se muestran los datos de la semana actual
    Cuando hago clic en Limpiar
    Entonces se elimina el filtro aplicado

  Escenario: TC-RI-12 - Filtro de fecha de la semana actual (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    Cuando filtro los datos por la semana actual y compruebo la interfaz
    Entonces la interfaz de Resumen de imputaciones debe mantenerse intacta

  # ===================================================== Filtros por división
  Escenario: TC-RI-13 - Filtro por división del proyecto (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    # Paso añadido: Filtrar exige fechas.
    Y selecciono el rango Mes actual como filtro de fecha obligatorio
    Cuando escribo "V1" en el filtro "División proyecto"
    Entonces el filtro muestra "V1 - Opentrends Tecnologia" como sugerencia automática
    Cuando selecciono la sugerencia "V1 - Opentrends Tecnologia"
    Entonces el filtro "División proyecto" queda seleccionado con "V1 - Opentrends Tecnologia"
    Cuando hago clic en Filtrar
    Entonces se filtran los datos de la división del proyecto "V1"
    Cuando hago clic en Limpiar
    Entonces se borran todos los filtros

  Escenario: TC-RI-14 - Filtro por división del proyecto (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    # Paso añadido: Filtrar exige fechas.
    Y selecciono el rango Mes actual como filtro de fecha obligatorio
    Cuando escribo "V1" en el filtro "División proyecto"
    Entonces el filtro muestra "V1 - Opentrends Tecnologia" como sugerencia automática
    Cuando selecciono la sugerencia "V1 - Opentrends Tecnologia"
    Entonces el filtro "División proyecto" queda seleccionado con "V1 - Opentrends Tecnologia"
    Cuando hago clic en Filtrar
    # El documento dice "división del usuario" en este resultado esperado aunque el caso es de división del proyecto.
    Entonces se filtran los datos de la división del proyecto "V1"
    Cuando compruebo la interfaz relacionada con la funcionalidad de filtro por división
    Entonces la interfaz de Resumen de imputaciones debe mantenerse intacta

  Escenario: TC-RI-15 - Filtro por división del usuario (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    # Paso añadido: Filtrar exige fechas.
    Y selecciono el rango Mes actual como filtro de fecha obligatorio
    Cuando escribo "V1" en el filtro "División usuario"
    Entonces el filtro muestra "V1 - Opentrends Tecnologia" como sugerencia automática
    Cuando selecciono la sugerencia "V1 - Opentrends Tecnologia"
    Entonces el filtro "División usuario" queda seleccionado con "V1 - Opentrends Tecnologia"
    Cuando hago clic en Filtrar
    Entonces se aplica el filtro de la división del usuario "V1"
    Cuando hago clic en Limpiar
    Entonces se borran todos los filtros

  Escenario: TC-RI-16 - Filtro por división del usuario (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    # Paso añadido: Filtrar exige fechas.
    Y selecciono el rango Mes actual como filtro de fecha obligatorio
    Cuando escribo "V1" en el filtro "División usuario"
    Entonces el filtro muestra "V1 - Opentrends Tecnologia" como sugerencia automática
    Cuando selecciono la sugerencia "V1 - Opentrends Tecnologia"
    Entonces el filtro "División usuario" queda seleccionado con "V1 - Opentrends Tecnologia"
    Cuando hago clic en Filtrar
    Entonces se aplica el filtro de la división del usuario "V1"
    Cuando compruebo la interfaz relacionada con la funcionalidad de filtro por división
    Entonces la interfaz de Resumen de imputaciones debe mantenerse intacta

  # ===================================================== País, Centro de trabajo, Código, Creador y Cliente
  # Estos 10 casos (TC-RI-17..26) se corrigieron el 2026-11-13: el filtro País/Centro de trabajo vive en
  # Backoffice > Histórico normativas, Código en Backoffice > Resumen subproyectos, Creador en Backoffice >
  # Notificaciones enviadas y Cliente en Backoffice > Resumen proyectos (ver cabecera del archivo y
  # GUIA_COPILOT_NUEVAS_FEATURES.md §5.1). Verificado en vivo que los 5 filtros existen y funcionan ahí.
  Escenario: TC-RI-17 - Filtro por país (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Backoffice → "Histórico normativas"
    Cuando escribo "Alemania" en el filtro "País"
    Entonces el filtro muestra "Alemania" como sugerencia automática
    Cuando selecciono la sugerencia "Alemania"
    Entonces el filtro "País" queda seleccionado con "Alemania"
    Cuando hago clic en Filtrar
    Entonces se filtran los datos del país "Alemania"
    Cuando hago clic en Limpiar
    Entonces se borran todos los filtros

  Escenario: TC-RI-18 - Filtro por país (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Backoffice → "Histórico normativas"
    Cuando compruebo la interfaz de la pantalla "Histórico normativas"
    Entonces la interfaz de la pantalla "Histórico normativas" debe mantenerse intacta

  Escenario: TC-RI-19 - Filtro por centro de trabajo (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Backoffice → "Histórico normativas"
    Cuando escribo "ANDORRA" en el filtro "Centro de trabajo"
    Entonces el filtro muestra "SEIDOR ANDORRA" como sugerencia automática
    Cuando selecciono la sugerencia "SEIDOR ANDORRA"
    Entonces el filtro "Centro de trabajo" queda seleccionado con "AD01 - SEIDOR ANDORRA"
    Cuando hago clic en Filtrar
    Entonces se filtran los datos del centro de trabajo "AD01 - SEIDOR ANDORRA"
    Cuando hago clic en Limpiar
    Entonces se borran todos los filtros

  Escenario: TC-RI-20 - Filtro por centro de trabajo (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Backoffice → "Histórico normativas"
    Cuando compruebo la interfaz de la pantalla "Histórico normativas"
    Entonces la interfaz de la pantalla "Histórico normativas" debe mantenerse intacta

  Escenario: TC-RI-21 - Filtro por código de subproyecto (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Backoffice → "Resumen subproyectos"
    Cuando escribo "project1" en el filtro "Código"
    Y hago clic en Filtrar
    Entonces se filtra el subproyecto con el código "project1"
    Cuando hago clic en Limpiar
    Entonces se borran todos los filtros

  Escenario: TC-RI-22 - Filtro por código de subproyecto (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Backoffice → "Resumen subproyectos"
    Cuando escribo "project1" en el filtro "Código"
    Y hago clic en Filtrar
    Entonces se filtra el subproyecto con el código "project1"
    Cuando compruebo la interfaz de la pantalla "Resumen subproyectos"
    Entonces la interfaz de la pantalla "Resumen subproyectos" debe mantenerse intacta

  Escenario: TC-RI-23 - Filtro por creador (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Backoffice → "Notificaciones enviadas"
    # Paso del documento: "seleccionar los filtros obligatorios de fecha".
    Y selecciono el rango Mes actual como filtro de fecha obligatorio
    Cuando escribo "MILES" en el filtro "Creador"
    Entonces el filtro muestra "MILES, MARTIN" como sugerencia automática
    Cuando selecciono la sugerencia "MILES, MARTIN"
    Entonces el filtro "Creador" queda seleccionado con "MILES, MARTIN"
    Cuando hago clic en Filtrar
    Entonces se listan las notificaciones cuyo creador coincide con "MILES, MARTIN"
    Cuando hago clic en Limpiar
    Entonces se borran todos los filtros

  Escenario: TC-RI-24 - Filtro por creador (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Backoffice → "Notificaciones enviadas"
    Cuando compruebo la interfaz de la pantalla "Notificaciones enviadas"
    Entonces la interfaz de la pantalla "Notificaciones enviadas" debe mantenerse intacta

  Escenario: TC-RI-25 - Filtro por cliente (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Backoffice → "Resumen proyectos"
    Cuando escribo "ANTEL" en el filtro "Cliente"
    Entonces el filtro muestra "ANTEL" como sugerencia automática
    Cuando selecciono la sugerencia "ANTEL"
    Entonces el filtro "Cliente" queda seleccionado con "ANTEL"
    Cuando hago clic en Filtrar
    Entonces se listan los proyectos asociados al cliente "ANTEL"
    Cuando hago clic en Limpiar
    Entonces se borran todos los filtros

  Escenario: TC-RI-26 - Filtro por cliente (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Backoffice → "Resumen proyectos"
    Cuando escribo "ANTEL" en el filtro "Cliente"
    Y selecciono la sugerencia "ANTEL"
    Y hago clic en Filtrar
    Entonces se listan los proyectos asociados al cliente "ANTEL"
    Cuando compruebo la interfaz de la pantalla "Resumen proyectos"
    Entonces la interfaz de la pantalla "Resumen proyectos" debe mantenerse intacta
    # El paso 5 original (comprobar la interfaz del filtro de moneda) no se automatiza: Resumen proyectos no
    # tiene filtro de moneda y, a diferencia de País/Centro/Código/Creador, no se ha localizado en ninguna otra
    # pantalla real del portal qué filtro de moneda describe este paso.
    Y se registra como no automatizable: "paso 5 (comprobar la interfaz del filtro de moneda): no existe un filtro de moneda en Resumen proyectos ni se ha identificado en qué otra pantalla real del portal se encuentra"

  # ===================================================== Selección de campos
  Escenario: TC-RI-27 - Selección de campos (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    Cuando selecciono los campos necesarios "Fecha, Usuario, Horas" en el desplegable
    Entonces los campos "Fecha, Usuario, Horas" quedan seleccionados
    # Paso añadido: Filtrar exige fechas.
    Cuando selecciono el rango Mes actual como filtro de fecha obligatorio
    Y hago clic en Filtrar
    Entonces la tabla de resultados muestra los campos seleccionados "Fecha, Usuario, Horas"
    Cuando compruebo si es posible filtrar sin seleccionar los campos
    Entonces la selección de campos es obligatoria
    Cuando hago clic en Limpiar
    Entonces se borran todos los filtros

  Escenario: TC-RI-28 - Selección de campos (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    # Paso añadido: Filtrar exige fechas.
    Y selecciono el rango Mes actual como filtro de fecha obligatorio
    Cuando selecciono los campos necesarios "Fecha, Usuario, Horas" y aplico el filtro
    Entonces la interfaz de Resumen de imputaciones debe mantenerse intacta
    Cuando compruebo la interfaz relacionada con la selección de campos

  # ===================================================== Editar / eliminar imputación (Imputación de horas)
  @datos-prueba
  Escenario: TC-RI-29 - Editar imputación (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Imputación de horas
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
    Y se registra como no automatizable: "creador 'reporter' cuando un administrador registra la imputación para otro usuario: requiere perfil administrador"
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
    Y se registra como no automatizable: "actualización de proyectos/subproyectos/tareas editados en Expense Summary: el resumen de gastos vive en otro módulo, fuera del alcance de esta imputación"
    Y se registra como no automatizable: "edición de proyectos con código 25 (imputación 0) con proyectos normales y validación de tiempo cero: no se ha localizado en el entorno de pruebas un proyecto de ese tipo"
    Y se registra como no automatizable: "los gastos asociados no se eliminan al editar los proyectos: requiere añadir antes un gasto a esta misma imputación y no está comprobado en este escenario"

  Escenario: TC-RI-30 - Editar imputación (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Imputación de horas
    Cuando selecciono en el calendario una fecha que tenga imputaciones
    Entonces debe mostrarse la lista de imputaciones
    Cuando hago clic en las opciones adicionales de una imputación
    Entonces deben mostrarse las opciones disponibles
    Cuando selecciono la opción Editar imputación
    Entonces debe abrirse el diálogo de edición de imputación
    Cuando verifico la interfaz de la pantalla
    Entonces la interfaz debe mostrarse correctamente

  @datos-prueba
  Escenario: TC-RI-31 - Eliminar imputación (Funcionalidad)
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

  Escenario: TC-RI-32 - Eliminar imputación (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Imputación de horas
    Cuando selecciono en el calendario una fecha que tenga imputaciones
    Entonces debe mostrarse la lista de imputaciones
    Cuando hago clic en las opciones adicionales de una imputación
    Entonces deben mostrarse las opciones disponibles
    # El documento describe aquí la apertura del modal de edición (posible error de copia); se conserva tal cual.
    Cuando selecciono la opción Editar imputación
    Entonces debe abrirse el diálogo de edición de imputación
    Cuando verifico la interfaz de la pantalla
    Entonces la interfaz debe mostrarse correctamente

  # ===================================================== Ordenación
  Escenario: TC-RI-33 - Ordenación (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    Cuando aplico filtros por división "V1" y rango de fechas desde "01/01/2026" hasta "31/12/2026"
    Y compruebo la ordenación ascendente de la columna Fecha
    Entonces las fechas se ordenan de la más antigua a la más reciente
    Cuando compruebo la ordenación descendente de la columna Fecha
    Entonces las fechas se ordenan de la más reciente a la más antigua
    Cuando compruebo la ordenación ascendente de las columnas de texto "Usuario, Proyecto, Situación"
    Entonces los registros del resumen se ordenan alfabéticamente de la A a la Z
    Cuando compruebo la ordenación descendente de las columnas de texto "Usuario, Proyecto, Situación"
    Entonces los registros del resumen se ordenan alfabéticamente de la Z a la A
    Cuando compruebo que la ordenación funciona también en páginas distintas de la primera
    Entonces la ordenación funciona correctamente en la segunda página
    Cuando compruebo la ordenación del campo Horas
    Entonces las horas se ordenan de mayor a menor

  Escenario: TC-RI-34 - Ordenación (UI)
    Dado que abro el portal de Seidor Intranet
    Entonces la interfaz debe mostrarse correctamente
    Cuando accedo a Informes → Resumen de imputaciones
    Y aplico filtros por división "V1" y el rango Mes actual
    Y compruebo la interfaz relacionada con la ordenación
    Entonces la interfaz de Resumen de imputaciones debe mantenerse intacta

  # ===================================================== Exportar a Excel
  Escenario: TC-RI-35 - Exportar a Excel (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    Cuando aplico cualquier filtro: rango Mes actual
    Y hago clic en el enlace Exportar a Excel
    Entonces los datos mostrados en pantalla (resultado filtrado) se exportan a Excel
    Cuando compruebo la interfaz relacionada con la exportación a Excel
    Entonces la interfaz de Resumen de imputaciones debe mantenerse intacta

  Escenario: TC-RI-36 - Exportar a Excel (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    Cuando aplico cualquier filtro: rango Mes actual
    Y hago clic en el enlace Exportar a Excel
    Entonces los datos mostrados en pantalla (resultado filtrado) se exportan a Excel

  # ===================================================== Arrastrar y soltar columnas
  Escenario: TC-RI-37 - Arrastrar y soltar columnas
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    Cuando aplico filtros con cualquier valor: rango Mes actual
    Y arrastro las columnas de la tabla hacia la izquierda o hacia la derecha
    Entonces las columnas de la tabla intercambian sus posiciones mediante arrastrar y soltar
    Cuando suelto las columnas arrastradas
    Entonces es posible soltar las columnas en la posición deseada de la tabla

  Escenario: TC-RI-38 - Arrastrar y soltar columnas (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    Cuando aplico filtros con cualquier valor: rango Mes actual
    Y arrastro las columnas de la tabla hacia la izquierda o hacia la derecha
    Entonces las columnas de la tabla intercambian sus posiciones mediante arrastrar y soltar
    Cuando suelto las columnas arrastradas
    Entonces es posible soltar las columnas en la posición deseada de la tabla
    Cuando compruebo la interfaz relacionada con la funcionalidad de arrastrar y soltar
    Entonces la interfaz de Resumen de imputaciones debe mantenerse intacta

  # ===================================================== Añadir imputación como completador
  Escenario: TC-RI-39 - Añadir imputación como completador (UI)
    Dado que abro el portal de Seidor Intranet
    Y accedo a Informes → Resumen de imputaciones
    Cuando hago clic en el botón Añadir imputación del resumen
    Entonces se abre un modal para añadir una imputación como completador
    Cuando compruebo la interfaz relacionada con añadir una imputación como completador
    Entonces la interfaz del modal Añadir imputación debe mantenerse intacta

  @datos-prueba
  Escenario: TC-RI-40 - Añadir imputación como completador (Funcionalidad)
    Dado que abro el portal de Seidor Intranet
    # Precondición: el día de prueba (14/07/2026) no tiene imputaciones, para que el límite diario sea determinista.
    Y el día de prueba está sin imputaciones
    Y accedo a Informes → Resumen de imputaciones
    Cuando hago clic en el botón Añadir imputación del resumen
    Entonces se abre un modal para añadir una imputación como completador
    Cuando hago clic en el selector de fecha del campo Fecha desde del modal
    Entonces se abre el calendario
    Cuando selecciono la fecha inicial "14/07/2026" en el calendario
    Entonces la fecha inicial "14/07/2026" queda seleccionada
    Cuando hago clic en el selector de fecha del campo Fecha hasta del modal
    Entonces se abre el calendario
    Cuando selecciono la fecha final "14/07/2026" en el calendario
    Entonces la fecha final "14/07/2026" queda seleccionada
    Cuando escribo "MILES" en el campo Usuario del modal
    Entonces se muestra una lista de sugerencias automáticas de usuarios que coinciden con "MILES"
    Cuando selecciono el usuario de las sugerencias
    Entonces el usuario "MILES, MARTIN" queda seleccionado
    Cuando escribo "00_NC_SUBPROJECT" en el campo Proyecto del modal
    Entonces se muestra una lista de sugerencias automáticas de proyectos que coinciden con "00_NC_SUBPROJECT"
    Cuando selecciono el proyecto de las sugerencias
    Entonces el proyecto "00_NC_SUBPROJECT" queda seleccionado
    Cuando escribo "00_NC_SUBPROJECT_TASK" en el campo Subproyecto del modal
    Entonces se muestra una lista de sugerencias automáticas de subproyectos que coinciden con "00_NC_SUBPROJECT_TASK"
    Cuando selecciono el subproyecto de las sugerencias
    Entonces el subproyecto "00_NC_SUBPROJECT_TASK" queda seleccionado
    Cuando escribo "TestTask7" en el campo Tarea del modal
    Entonces se muestra una lista de sugerencias automáticas de tareas que coinciden con "TestTask7"
    Cuando selecciono la tarea de las sugerencias
    Entonces la tarea "TestTask7" queda seleccionada
    Cuando introduzco una descripción de 150 caracteres en el campo Descripción
    Entonces el campo acepta una descripción de un máximo de 150 caracteres
    Cuando introduzco la referencia interna "QA-RI-REF" en el modal
    Entonces la referencia interna "QA-RI-REF" se añade al campo
    Cuando selecciono el desplegable Situación del modal
    Entonces se listan las situaciones y se puede seleccionar "Teletrabajo"
    Cuando introduzco las horas "2359" en el campo Horas del modal
    Entonces se pueden añadir horas con un máximo de 23:59 y el campo muestra "23:59"
    Cuando compruebo la funcionalidad del botón Añadir (Guardar) del modal
    Entonces la imputación se añade para "14/07/2026"
    Cuando compruebo las validaciones de los campos obligatorios en el modal Añadir imputación
    Entonces se muestran las validaciones de los campos obligatorios
    Cuando compruebo la validación al intentar añadir más de 24 horas en un día
    Entonces se muestra una validación cuando se intentan añadir más de 24 horas en un día
    Cuando compruebo la validación para un período de informes cerrado con fecha "15/01/2025"
    Entonces se muestra una validación si el período del informe está cerrado
