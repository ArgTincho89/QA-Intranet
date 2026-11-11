# language: es
@imputacion-horas
Característica: Imputación horas
  Automatización de los casos de prueba manuales de la QA (Azure DevOps, suite "Imputation hours", ID 531).
  Se respeta el orden del documento. Los pasos que dependen de datos externos o de otros perfiles
  se registran como "no automatizable" y no se dan por verificados.
  Datos de solo lectura: 12/05/2026 (imputación existente), 01/05 (festivo), 03/05 (domingo) y 14/07/2026 (día laborable sin datos).
  Los casos que crean datos usan el 14/07/2026 y lo limpian antes y después.

  Antecedentes:
    Dado que accedo a la home de la intranet
    Cuando hago clic en la tarjeta del módulo "imputation-hours"
    Entonces la pantalla de imputación de horas está cargada

  # ===================================================== Calendario
  Escenario: TC-IH-01 Calendario - Calendario UI
    Entonces el calendario es visible con cabecera, flechas y días de la semana
    Y el día actual se muestra en blanco con borde
    Cuando navego en el calendario a julio de 2026
    Entonces el día 14 se muestra como "incompleto en amarillo"
    Cuando navego en el calendario a mayo de 2026
    Entonces el día 12 se muestra como "completo en blanco"
    Y el día 12 muestra las horas imputadas en la celda
    Y el día 1 se muestra como "festivo en azul oscuro"
    Y el día 3 se muestra como "fin de semana en gris"
    Cuando selecciono el día 12 de mayo de 2026 en el calendario
    Entonces el día 12 se muestra como "seleccionado en azul"
    Y la leyenda del calendario explica los estados de los días

  Escenario: TC-IH-02 Calendario - Funcionalidad calendario
    Entonces el calendario muestra el mes y el año actuales
    Cuando hago clic en la flecha "izquierda" del calendario
    Entonces el calendario muestra el mes "previo" al anterior
    Cuando hago clic en la flecha "derecha" del calendario
    Entonces el calendario muestra el mes "siguiente" al anterior
    Cuando hago clic en el año del calendario
    Entonces se muestra la lista de años y selecciono el 2026
    Cuando hago clic en el mes del calendario
    Entonces se muestra la lista de meses y selecciono mayo
    Cuando selecciono el día 12 de mayo de 2026 en el calendario
    Entonces la tabla de imputaciones tiene al menos una fila
    Y el resumen del día coincide con el total de la tabla y el del mes con la suma del calendario
    Cuando selecciono el día 14 de julio de 2026 en el calendario
    Entonces la tabla de imputaciones está vacía
    Y el resumen del día coincide con el total de la tabla y el del mes con la suma del calendario

  # ===================================================== Agregar imputación
  # El documento lista primero el caso "Functionality" (ID 1792) y después el "UI" (ID 1793).
  @datos-prueba
  Escenario: TC-IH-03 Agregar imputación - Funcionalidad agregar imputación
    Dado el día de prueba está sin imputaciones
    Cuando selecciono el día de prueba en el calendario
    Entonces el formulario de añadir imputación muestra la fecha "14/07/2026"
    Y los campos descripción, referencia interna y horas están deshabilitados sin proyecto
    Cuando despliego la lista de proyectos con la lupa
    Entonces se listan proyectos activos para el usuario
    Cuando selecciono el proyecto "MM-PruebasQA2"
    Y selecciono el proyecto "MM-PruebasQA1"
    Entonces el proyecto seleccionado es "MM-PruebasQA1"
    Y los campos descripción, referencia interna y horas están habilitados
    Y los campos subproyecto y tarea están deshabilitados porque el proyecto no los tiene
    Cuando escribo la descripción "Descripción editable de prueba automatizada"
    Y escribo la referencia interna "REF-IH-AUTO"
    Y despliego la lista de situaciones
    Entonces la lista de situaciones incluye "Teletrabajo" y "En la oficina"
    Cuando selecciono la situación "Teletrabajo"
    Entonces la situación seleccionada es "Teletrabajo"
    Cuando escribo las horas "0130" en el formulario
    Entonces el campo de horas muestra "01:30"
    Cuando escribo las horas "2359" en el formulario
    Entonces el campo de horas muestra "23:59"
    Cuando escribo las horas "2400" en el formulario
    Entonces el campo de horas queda vacío por ser un valor inválido
    Cuando escribo las horas "2599" en el formulario
    Entonces el campo de horas queda vacío por ser un valor inválido
    Cuando escribo las horas "0130" en el formulario
    Y pulso el botón guardar del formulario
    Entonces la tabla muestra una imputación con proyecto "MM-PruebasQA1", descripción "Descripción editable de prueba automatizada", horas "01:30" y situación "Teletrabajo"
    Y el creador de la imputación es "Usuario"
    Y el día de prueba muestra "01:30" en el calendario
    Y se registra como no automatizable: "creador 'reportero' (requiere un perfil administrador), proyectos bloqueados, tareas caducadas, caracteres especiales en datos SAP y fechas de alta/baja del usuario en la compañía"

  Escenario: TC-IH-04 Agregar imputación - Agregar imputación UI
    Cuando selecciono el día 12 de mayo de 2026 en el calendario
    Entonces el formulario muestra título, campos y botones esperados
    Y el menú más acciones ofrece "Copiar día" y "Borrar día"

  # ===================================================== Editar imputación
  # El documento lista primero el caso "Functionality" (ID 1795) y después el "UI" (ID 1796).
  @datos-prueba
  Escenario: TC-IH-05 Editar imputación - Funcionalidad editar imputación
    Dado el día de prueba está sin imputaciones
    Cuando selecciono el día de prueba en el calendario
    Y creo una imputación de prueba con descripción "Imputación para editar" y "01:00" horas
    Y abro el menú de acciones de la primera imputación
    Entonces el menú ofrece las opciones "Editar imputación", "Borrar imputación" y "Gastos"
    Cuando elijo la opción "Editar imputación" del menú de la imputación
    Entonces se abre el diálogo de edición con la fecha "14/07/2026"
    Y el diálogo de edición muestra usuario, creador "Usuario" y categoría
    Cuando cambio en el diálogo de edición el proyecto a "MM-PruebasQA2"
    Y cambio en el diálogo de edición la descripción a "Imputación editada" y la referencia interna a "REF-EDIT"
    Y cambio en el diálogo de edición la situación a "En la oficina"
    Y escribo en el diálogo de edición las horas "2400"
    Entonces el campo de horas del diálogo de edición queda vacío por ser inválido
    Cuando escribo en el diálogo de edición las horas "0200"
    Entonces el campo de horas del diálogo de edición muestra "02:00"
    Cuando guardo el diálogo de edición
    Entonces la tabla muestra una imputación con proyecto "MM-PruebasQA2", descripción "Imputación editada", horas "02:00" y situación "En la oficina"
    Y se registra como no automatizable: "gastos conservados tras editar, sincronización con el resumen de gastos, proyectos código 25 y edición de imputaciones creadas por un completer (requieren datos o permisos específicos)"

  Escenario: TC-IH-06 Editar imputación - Editar imputación UI
    Cuando selecciono el día 12 de mayo de 2026 en el calendario
    Y abro el menú de acciones de la primera imputación
    Y elijo la opción "Editar imputación" del menú de la imputación
    Entonces el diálogo de edición muestra título, campos y botones esperados
    Cuando cierro el diálogo abierto

  # ===================================================== Eliminar imputación
  @datos-prueba
  Escenario: TC-IH-07 Eliminar imputación - Funcionalidad eliminar imputación
    Dado el día de prueba está sin imputaciones
    Cuando selecciono el día de prueba en el calendario
    Y creo una imputación de prueba con descripción "Imputación para borrar" y "00:45" horas
    Entonces la tabla de imputaciones muestra 1 filas
    Cuando abro el menú de acciones de la primera imputación
    Y elijo la opción "Borrar imputación" del menú de la imputación
    Entonces aparece el diálogo de confirmación de borrado con los botones "Cancelar" y "Borrar"
    Cuando cancelo el borrado en el diálogo de confirmación
    Entonces la tabla de imputaciones muestra 1 filas
    Cuando abro el menú de acciones de la primera imputación
    Y elijo la opción "Borrar imputación" del menú de la imputación
    Y confirmo el borrado en el diálogo de confirmación
    Entonces la tabla de imputaciones está vacía
    Y se registra como no automatizable: "borrado de imputaciones creadas por un completer (requiere permisos extendidos)"

  Escenario: TC-IH-08 Eliminar imputación - Eliminar imputación UI
    Cuando selecciono el día 12 de mayo de 2026 en el calendario
    Y abro el menú de acciones de la primera imputación
    Y elijo la opción "Borrar imputación" del menú de la imputación
    Entonces aparece el diálogo de confirmación de borrado con los botones "Cancelar" y "Borrar"
    Cuando cancelo el borrado en el diálogo de confirmación
    Entonces la tabla de imputaciones tiene al menos una fila

  # ===================================================== Agregar gasto
  @datos-prueba
  Escenario: TC-IH-09 Agregar gasto - Funcionalidad agregar gasto
    Dado el día de prueba está sin imputaciones
    Cuando selecciono el día de prueba en el calendario
    Y creo una imputación de prueba con descripción "Imputación con gasto" y "01:00" horas
    Y abro el detalle de la primera imputación
    Y pulso añadir gasto
    Entonces se abre el diálogo de añadir gasto
    Y el selector de archivo del gasto acepta imágenes jpeg, jpg, png y pdf
    Cuando despliego el tipo de gasto
    Entonces se listan varios tipos de gasto
    Cuando selecciono el tipo de gasto "Taxi"
    Entonces el tipo de gasto seleccionado es "Taxi"
    Y el campo moneda está habilitado
    Cuando escribo el importe "abc12"
    Entonces el importe solo contiene dígitos y separadores
    Cuando escribo el importe "123456789"
    Entonces el importe tiene como máximo 7 dígitos
    Cuando escribo el importe "25"
    Y relleno lugar "Madrid" y descripción "Prueba automatizada gasto" del gasto
    Y guardo el gasto
    Entonces el gasto aparece en la tabla de gastos del detalle con importe "25"
    Y se registra como no automatizable: "lectura de tickets por IA, cálculo de kilómetros y rutas (cuentas externas), subida de tickets reales y límites de 5 MB"

  Escenario: TC-IH-10 Agregar gasto - Agregar gasto UI
    Cuando selecciono el día 12 de mayo de 2026 en el calendario
    Y abro el detalle de la primera imputación
    Y pulso añadir gasto
    Entonces el diálogo de gasto muestra título, datos del cargo, campos y botones esperados
    Cuando cierro el diálogo abierto

  # ===================================================== Página de detalle
  Escenario: TC-IH-11 Página de detalle - Página de detalle UI
    Cuando selecciono el día 12 de mayo de 2026 en el calendario
    Y abro el detalle de la primera imputación
    Entonces el detalle muestra los campos y la tabla de gastos

  Escenario: TC-IH-12 Página de detalle - Funcionalidad página de detalle
    Cuando selecciono el día 12 de mayo de 2026 en el calendario
    Y memorizo los datos de la primera fila de la tabla
    Y abro el detalle de la primera imputación
    Entonces los datos del detalle coinciden con la fila de la tabla
    Cuando pulso añadir gasto
    Entonces se abre el diálogo de añadir gasto
    Cuando cierro el diálogo abierto
    Y cierro el detalle de la imputación
    Entonces el detalle de la imputación ya no está visible

  # ===================================================== Resumen
  Escenario: TC-IH-13 Resumen - Resumen UI
    Cuando selecciono el día 12 de mayo de 2026 en el calendario
    Y abro la pestaña Resumen
    Entonces el resumen muestra el bloque del día y el del mes con horas registradas y total de gastos
    Y el bloque del día muestra la fecha "12 mayo 2026"

  Escenario: TC-IH-14 Resumen - Funcionalidad resumen
    Cuando selecciono el día 12 de mayo de 2026 en el calendario
    Y abro la pestaña Resumen
    Entonces las horas del día en el resumen coinciden con el total de la tabla de la pestaña Simple
    Y las horas del mes en el resumen coinciden con la suma de horas del calendario
    Y los gastos del día en el resumen coinciden con la suma de la columna gastos
    Y los gastos del mes en el resumen son un importe válido no inferior a los del día

  # ===================================================== Copiar día
  Escenario: TC-IH-15 Copiar día - Copiar día UI
    Cuando selecciono el día 12 de mayo de 2026 en el calendario
    Y abro el diálogo de copiar día desde más acciones
    Entonces el diálogo de copiar día muestra la fecha "12/05/2026", las opciones Rango y Días, el calendario y los botones
    Cuando cierro el diálogo abierto

  Escenario: TC-IH-16 Copiar día - Funcionalidad copiar día
    Cuando selecciono el día 12 de mayo de 2026 en el calendario
    Y abro el diálogo de copiar día desde más acciones
    Entonces el diálogo de copiar día muestra la fecha "12/05/2026", las opciones Rango y Días, el calendario y los botones
    Cuando selecciono el modo "Días" en el diálogo de copiar día
    Entonces el modo "Días" queda marcado en el diálogo de copiar día
    Cuando selecciono el modo "Rango" en el diálogo de copiar día
    Entonces el modo "Rango" queda marcado en el diálogo de copiar día
    Cuando cancelo el diálogo de copiar día
    Entonces el diálogo de copiar día está cerrado
    Y se registra como no automatizable: "la copia efectiva (selección de fechas, rango, sobrescritura, validaciones de 31 días, fines de semana y cierre de periodo) no se automatiza por no poder alterar datos de mayo ni verificar el calendario interno del diálogo; pendiente de revisión manual"
  # ===================================================== Eliminar día
  Escenario: TC-IH-17 Eliminar día - Eliminar día UI
    Cuando selecciono el día 12 de mayo de 2026 en el calendario
    Y elijo la opción "Borrar día" del menú más acciones
    Entonces aparece el diálogo de confirmación de borrado de día
    Cuando cancelo el borrado en el diálogo de confirmación
    Entonces la tabla de imputaciones tiene al menos una fila

  @datos-prueba
  Escenario: TC-IH-18 Eliminar día - Funcionalidad eliminar día
    Dado el día de prueba está sin imputaciones
    Cuando selecciono el día de prueba en el calendario
    Y creo una imputación de prueba con descripción "Día a borrar 1" y "01:00" horas
    Y creo una imputación de prueba con descripción "Día a borrar 2" y "00:30" horas
    Entonces la tabla de imputaciones muestra 2 filas
    Cuando elijo la opción "Borrar día" del menú más acciones
    Entonces aparece el diálogo de confirmación de borrado de día
    Cuando cancelo el borrado en el diálogo de confirmación
    Entonces la tabla de imputaciones muestra 2 filas
    Cuando elijo la opción "Borrar día" del menú más acciones
    Y confirmo el borrado en el diálogo de confirmación
    Entonces la tabla de imputaciones está vacía

  # ===================================================== Paginación
  Escenario: TC-IH-19 Paginación - Paginación UI
    Cuando selecciono el día 14 de julio de 2026 en el calendario
    Entonces la tabla de imputaciones está vacía
    Y el paginador no se muestra o no ofrece páginas adicionales
    Cuando selecciono el día 12 de mayo de 2026 en el calendario
    Entonces el número de páginas del paginador, si existe, coincide con las filas existentes

  @datos-prueba
  Escenario: TC-IH-20 Paginación - Funcionalidad paginación
    Dado el día de prueba está sin imputaciones
    Cuando selecciono el día de prueba en el calendario
    Entonces el paginador no se muestra o no ofrece páginas adicionales
    Cuando creo tres imputaciones de prueba con distintas descripciones y horas
    Entonces la tabla de imputaciones muestra 3 filas
    Y la tabla no muestra más filas que 10 por página
    Y el número de páginas del paginador, si existe, coincide con las filas existentes
    Y se registra como no automatizable: "navegación entre páginas (flechas simples/dobles, selector de elementos por página) requiere más de una página de datos; el entorno de pruebas no tiene volumen suficiente"

  # ===================================================== Ordenamiento
  # El documento lista primero el caso "Functionality" (ID 2010) y después el "UI" (ID 2011).
  @datos-prueba
  Escenario: TC-IH-21 Ordenamiento - Funcionalidad ordenamiento
    Dado el día de prueba está sin imputaciones
    Cuando selecciono el día de prueba en el calendario
    Y creo tres imputaciones de prueba con distintas descripciones y horas
    Y ordeno la tabla por la columna "Horas"
    Entonces la columna "Horas" está ordenada en sentido "ascending"
    Y los valores de la columna "Horas" están ordenados de forma "ascendente"
    Cuando ordeno la tabla por la columna "Horas"
    Entonces la columna "Horas" está ordenada en sentido "descending"
    Y los valores de la columna "Horas" están ordenados de forma "descendente"
    Cuando ordeno la tabla por la columna "Descripción"
    Entonces los valores de la columna "Descripción" están ordenados de forma "ascendente"
    Cuando ordeno la tabla por la columna "Descripción"
    Entonces los valores de la columna "Descripción" están ordenados de forma "descendente"

  Escenario: TC-IH-22 Ordenamiento - Ordenamiento UI
    Cuando selecciono el día 12 de mayo de 2026 en el calendario
    Entonces las columnas de la tabla son ordenables y el diseño se mantiene tras ordenar

