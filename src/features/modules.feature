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
