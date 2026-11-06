#!/usr/bin/env node
// npm run auth:save:dev | :pre | :pro — abre Chrome real y visible para que una persona haga
// el login corporativo (usuario, contraseña, MFA). La sesión queda guardada en .auth/.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { prepareEnvironment, projectRoot } from './env.mjs';

prepareEnvironment();
const result = spawnSync(
  process.execPath,
  ['-r', 'ts-node/register', path.join(projectRoot, 'src', 'scripts', 'auth-save.ts')],
  { stdio: 'inherit', cwd: projectRoot }
);
process.exit(result.status ?? 1);
