#!/usr/bin/env node
// Punto de entrada único: npm run test:dev | test:pre | test:pro
//   node scripts/run.mjs --env dev [--tags "@smoke"] [--name "regex"] [--profile default|smoke]
// También vale `npm test -- --pre`. Siempre genera el dashboard, pasen o fallen los tests.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { arg, prepareEnvironment, projectRoot } from './env.mjs';

const envName = prepareEnvironment();
const tags = arg('tags');
const name = arg('name');
const profile = arg('profile', 'default');
const scope = arg('scope', name ? 'filtered' : tags ? 'tagged' : 'full-suite');
const runDate = new Date().toISOString().slice(0, 10);

const profileDir = path.join(projectRoot, '.auth', `chrome-profile-${envName}`);
if (!fs.existsSync(profileDir) || fs.readdirSync(profileDir).length === 0) {
  console.error(
    `\n[run] No hay sesión guardada para "${envName}". Ejecuta primero:  npm run auth:save:${envName}\n` +
      `      (abre Chrome, haces el login corporativo una vez y la sesión queda en .auth/).\n`
  );
  process.exit(2);
}

const rawDir = path.join(projectRoot, '.raw', `${envName}-${process.pid}`);
const reportDir = path.join(projectRoot, 'reports', runDate, envName, scope);

// Una sola ejecución por entorno: comparten perfil de Chrome y limpiar uno mata el navegador del otro.
const lockFile = path.join(projectRoot, '.auth', `run-${envName}.lock`);
function pidAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}
if (fs.existsSync(lockFile)) {
  const otherPid = Number(fs.readFileSync(lockFile, 'utf-8'));
  if (otherPid && otherPid !== process.pid && pidAlive(otherPid)) {
    console.error(`\n[run] Ya hay una ejecución de "${envName}" en curso (PID ${otherPid}). Espera a que termine.\n`);
    process.exit(2);
  }
}
fs.writeFileSync(lockFile, String(process.pid));
const releaseLock = () => fs.rmSync(lockFile, { force: true });
process.on('exit', releaseLock);
process.on('SIGINT', () => process.exit(130));

fs.rmSync(path.join(projectRoot, '.raw', envName), { recursive: true, force: true });
fs.mkdirSync(rawDir, { recursive: true });
process.env.RAW_DIR = rawDir;
process.env.REPORT_DIR = reportDir;

// `node <entrypoint real>` sin shell: los regex de --name/--tags llegan intactos en Windows.
const cucumberBin = path.join(projectRoot, 'node_modules', '@cucumber', 'cucumber', 'bin', 'cucumber-js');
function run(args) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit', cwd: projectRoot });
  if (result.error) {
    console.error('[run] No se pudo lanzar el proceso:', result.error.message);
    return 1;
  }
  return result.status ?? 1;
}

console.log(`\n[run] Entorno: ${envName.toUpperCase()}  |  URL: ${process.env.BASE_URL}\n`);
const cucumberArgs = [cucumberBin, '--config', 'cucumber.js', '--profile', profile];
if (tags) cucumberArgs.push('--tags', tags);
if (name) cucumberArgs.push('--name', name);
const testCode = run(cucumberArgs);

console.log('\n[run] Cucumber terminó — generando el dashboard (no cierres la terminal)...');
const reportCode = run([
  path.join(projectRoot, 'scripts', 'build-dashboard.mjs'),
  '--env', envName,
  '--scope', scope,
  '--json', path.join(rawDir, 'cucumber.json'),
]);

console.log('\n' + '='.repeat(70));
const indexHtml = path.join(reportDir, 'dashboard', 'index.html');
if (reportCode === 0 && fs.existsSync(indexHtml)) console.log(`[run] REPORTE: ${indexHtml}`);
else console.log(`[run] No se generó dashboard (exit ${reportCode}). Revisa la salida de arriba.`);
console.log('='.repeat(70) + '\n');

process.exit(testCode);
