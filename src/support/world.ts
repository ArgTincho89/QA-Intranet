import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import type { BrowserContext, Page } from 'playwright';
import { resolveConfig, ResolvedConfig } from './config';
import type { PageMonitor } from './page-monitor';

export class CustomWorld extends World {
  public config: ResolvedConfig;
  public context!: BrowserContext;
  public page!: Page;
  public monitor?: PageMonitor;

  constructor(options: IWorldOptions) {
    super(options);
    this.config = resolveConfig();
  }
}

setWorldConstructor(CustomWorld);
