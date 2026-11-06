#!/usr/bin/env node
// Dashboard HTML (multiple-cucumber-html-reporter) a partir del JSON nativo de Cucumber:
// pasos en Gherkin, captura de pantalla y log del error incrustados en el paso fallido.
// Uso: node scripts/build-dashboard.mjs --env dev --scope full-suite
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import report from 'multiple-cucumber-html-reporter';
import { arg, prepareEnvironment, projectRoot } from './env.mjs';

const envName = prepareEnvironment();
const scope = arg('scope', 'full-suite');
const runDate = arg('date', new Date().toISOString().slice(0, 10));
const jsonPath = arg('json', path.join(projectRoot, '.raw', envName, 'cucumber.json'));

if (!fs.existsSync(jsonPath) || fs.readFileSync(jsonPath, 'utf-8').trim() === '') {
  console.warn(`[dashboard] No hay JSON de Cucumber en ${jsonPath} — se genera un reporte de aviso.`);
  const outDir = path.join(projectRoot, 'reports', runDate, envName, scope, 'dashboard');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'index.html'),
    `<!doctype html><meta charset="utf-8"><title>Intranet - Pruebas</title>
<body style="font-family:sans-serif;max-width:720px;margin:3rem auto">
<h1>Sin resultados de Cucumber</h1>
<p>La ejecución (${envName.toUpperCase()}, ${scope}, ${new Date().toLocaleString('es-ES')}) no produjo el JSON de resultados:
probablemente se interrumpió antes de terminar o falló en el arranque (BeforeAll). Revisa la salida de la terminal.</p></body>`
  );
  console.log(`[dashboard] HTML -> ${path.join(outDir, 'index.html')}`);
  process.exit(0);
}

const reportDir = path.join(projectRoot, 'reports', runDate, envName, scope);
const dashboardDir = path.join(reportDir, 'dashboard');
// jsonDir aislado: el reporter fusiona TODOS los .json de un directorio, y solo queremos esta ejecución.
const jsonDir = path.join(reportDir, 'dashboard-json-input');
fs.rmSync(jsonDir, { recursive: true, force: true });
fs.mkdirSync(jsonDir, { recursive: true });
fs.copyFileSync(jsonPath, path.join(jsonDir, 'cucumber.json'));
fs.mkdirSync(dashboardDir, { recursive: true });

report.generate({
  jsonDir,
  reportPath: dashboardDir,
  displayDuration: true,
  displayReportTime: true,
  openReportInBrowser: false,
  pageTitle: 'Intranet - Pruebas',
  reportName: 'Intranet | Pruebas E2E',
  customData: {
    title: 'Ejecución',
    data: [
      { label: 'Entorno', value: `${envName.toUpperCase()} (${process.env.BASE_URL})` },
      { label: 'Ejecutado por', value: os.userInfo().username },
      { label: 'Fecha', value: new Date().toLocaleString('es-ES') },
      { label: 'Alcance', value: scope },
    ],
  },
  metadata: {
    browser: { name: 'chrome', version: 'latest' },
    device: os.hostname(),
    platform: { name: os.platform(), version: os.release() },
  },
});

fs.rmSync(jsonDir, { recursive: true, force: true });
autoExpandFailures(dashboardDir);
console.log(`[dashboard] HTML -> ${path.join(dashboardDir, 'index.html')}`);

// El reporter oculta los pasos y el error tras paneles colapsados de Bootstrap. Se fuerzan
// abiertos (solo en escenarios fallidos) con CSS !important, que no compite con collapse.js.
function autoExpandFailures(dir) {
  const featuresDir = path.join(dir, 'features');
  if (!fs.existsSync(featuresDir)) return;
  const injected = `
<style>
  .x_panel:has(.step.failed-background) .x_content { display: block !important; }
  .x_panel:has(.step.failed-background) .scenario-step-collapse.collapse {
    display: block !important; height: auto !important; visibility: visible !important;
  }
</style>
<script>
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.x_panel').forEach(function (panel) {
      if (!panel.querySelector('.step.failed-background')) return;
      var content = panel.querySelector('.x_content');
      if (content) content.style.setProperty('display', 'block', 'important');
      panel.querySelectorAll('.scenario-step-collapse.collapse').forEach(function (p) {
        p.style.setProperty('display', 'block', 'important');
        p.style.setProperty('height', 'auto', 'important');
        p.style.setProperty('visibility', 'visible', 'important');
      });
    });
  });
</script>
`;
  for (const file of fs.readdirSync(featuresDir).filter((f) => f.endsWith('.html'))) {
    const filePath = path.join(featuresDir, file);
    const html = fs.readFileSync(filePath, 'utf-8');
    if (!html.includes('step failed-background')) continue;
    fs.writeFileSync(
      filePath,
      html.includes('</body>') ? html.replace('</body>', `${injected}</body>`) : html + injected
    );
  }
}
