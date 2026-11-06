// Carga de entorno compartida por los scripts .mjs. Orden: shell -> .env.<entorno> -> .env
// La shell siempre gana: nunca se pisa un valor ya definido.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const KNOWN_ENVS = ['dev', 'pre', 'pro'];

export function arg(name, fallback = '') {
  const idx = process.argv.indexOf(`--${name}`);
  return idx !== -1 && process.argv[idx + 1] && !process.argv[idx + 1].startsWith('--')
    ? process.argv[idx + 1]
    : fallback;
}

/** Acepta `--env pre` o el atajo `--dev` / `--pre` / `--pro`. */
export function resolveEnvName() {
  const shortcut = KNOWN_ENVS.find((e) => process.argv.includes(`--${e}`));
  const name = (arg('env') || shortcut || process.env.TEST_ENV || 'dev').toLowerCase();
  if (!KNOWN_ENVS.includes(name)) {
    console.error(`[env] Entorno desconocido "${name}". Usa uno de: ${KNOWN_ENVS.join(', ')}.`);
    process.exit(2);
  }
  return name;
}

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const rawLine of fs.readFileSync(filePath, 'utf-8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

/** Fija TEST_ENV, carga los .env y se detiene (exit 2) si falta BASE_URL. */
export function prepareEnvironment() {
  const envName = resolveEnvName();
  process.env.TEST_ENV = envName;
  loadDotEnv(path.join(projectRoot, `.env.${envName}`));
  loadDotEnv(path.join(projectRoot, '.env'));
  if (!process.env.BASE_URL) {
    console.error(
      `\n[env] Falta BASE_URL para el entorno "${envName}". Complétala en .env.${envName} (o en .env / variable de shell).\n` +
        `No se ejecuta nada sin URL: no se inventa ningún valor.\n`
    );
    process.exit(2);
  }
  return envName;
}
