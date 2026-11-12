// cucumber.js — perfiles de ejecución. El JSON nativo (con capturas incrustadas) alimenta el dashboard.
const path = require('path');

// Lo fija scripts/run.mjs; el fallback permite lanzar `npx cucumber-js` a mano.
const RAW_DIR = process.env.RAW_DIR || path.join(__dirname, '.raw', process.env.TEST_ENV || 'dev');

const COMMON = {
  requireModule: ['ts-node/register'],
  require: ['src/support/**/*.ts', 'src/pages/**/*.ts', 'src/steps/**/*.ts'],
  paths: ['src/features/**/*.feature'],
  publishQuiet: true,
  formatOptions: { snippetInterface: 'async-await' },
  // Un reintento filtra ruido transitorio (lentitud del entorno) sin ocultar fallos reales.
  retry: Number(process.env.RETRY || 1),
  format: ['progress-bar', `json:${path.join(RAW_DIR, 'cucumber.json')}`],
};

module.exports = {
  default: { ...COMMON, tags: 'not @wip' },
  smoke: { ...COMMON, tags: '@smoke and not @wip' },
  // Orden fijo para la ejecución completa: primero el recorrido de los 32 módulos (rápido, ~1-2 min),
  // luego Imputación horas. `order: 'defined'` (por defecto en Cucumber) respeta este orden de `paths`.
  suite: {
    ...COMMON,
    paths: ['src/features/modules.feature', 'src/features/imputacion-horas.feature'],
    tags: 'not @wip',
  },
};
