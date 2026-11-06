// Config por nombre. Orden: shell -> .env.<TEST_ENV> -> .env. Falta un valor obligatorio = STOP.
import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

function loadDotEnvFile(filePath: string): void {
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

export function testEnv(): string {
  return (process.env.TEST_ENV || 'dev').toLowerCase();
}

export function loadEnvironment(): void {
  loadDotEnvFile(path.join(PROJECT_ROOT, `.env.${testEnv()}`));
  loadDotEnvFile(path.join(PROJECT_ROOT, '.env'));
}

export class MissingEnvVarError extends Error {
  constructor(public readonly varName: string) {
    super(`Falta la variable obligatoria "${varName}". Defínela en .env.${testEnv()}, en .env o en la shell.`);
    this.name = 'MissingEnvVarError';
  }
}

export interface ResolvedConfig {
  env: string;
  baseUrl: string;
  headless: boolean;
}

export function resolveConfig(): ResolvedConfig {
  loadEnvironment();
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) throw new MissingEnvVarError('BASE_URL');
  return { env: testEnv(), baseUrl, headless: /^(1|true)$/i.test(process.env.HEADLESS || '') };
}

/** Directorio del reporte de esta ejecución (lo fija scripts/run.mjs). */
export function reportDir(): string {
  return process.env.REPORT_DIR || path.join(PROJECT_ROOT, 'reports', 'adhoc', testEnv());
}
