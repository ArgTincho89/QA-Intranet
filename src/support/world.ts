import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import type { BrowserContext, Page } from 'playwright';
import { resolveConfig, ResolvedConfig } from './config';
import type { PageMonitor } from './page-monitor';
import type { ModuleSpec } from '../pages/modules.page';

export class CustomWorld extends World {
  public config: ResolvedConfig;
  public context!: BrowserContext;
  public page!: Page;
  public monitor?: PageMonitor;
  public currentModule?: ModuleSpec;

  constructor(options: IWorldOptions) {
    super(options);
    this.config = resolveConfig();
  }
}

setWorldConstructor(CustomWorld);
