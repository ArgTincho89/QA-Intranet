// Observa, desde que se llama a start(), las respuestas HTTP de tipo xhr/fetch y los errores de
// consola. Solo escucha: no origina ninguna petición. No registra cuerpos de petición/respuesta.
import type { ConsoleMessage, Page, Request, Response } from 'playwright';

export interface Finding {
  detail: string;
}

export class PageMonitor {
  private readonly badResponses: Finding[] = [];
  private readonly failedRequests: Finding[] = [];
  private readonly consoleErrors: Finding[] = [];
  private total = 0;

  // Defectos conocidos de la app que no deben hacer fallar las pruebas.
  private static readonly IGNORED_CONSOLE_ERRORS: RegExp[] = [
    /not supported, must be a valid ISO 4217 currency code/i,
    /invalid currency code/i,
  ];

  private static isIgnoredConsoleError(text: string): boolean {
    return PageMonitor.IGNORED_CONSOLE_ERRORS.some((pattern) => pattern.test(text));
  }

  private readonly onResponse = (response: Response) => {
    const request = response.request();
    if (!['xhr', 'fetch'].includes(request.resourceType())) return;
    if (request.method() === 'OPTIONS') return; // preflight CORS
    if (new URL(response.url()).pathname.startsWith('/cdn-cgi/')) return; // telemetría de Cloudflare, no es de la app
    this.total += 1;
    if (response.status() !== 200) {
      this.badResponses.push({ detail: `${response.status()} ${request.method()} ${response.url()}` });
    }
  };

  private readonly onRequestFailed = (request: Request) => {
    if (!['xhr', 'fetch'].includes(request.resourceType())) return;
    const reason = request.failure()?.errorText ?? 'desconocido';
    if (reason.includes('ERR_ABORTED')) return; // cancelaciones normales por navegación
    this.failedRequests.push({ detail: `FALLO (${reason}) ${request.method()} ${request.url()}` });
  };

  private readonly onConsole = (msg: ConsoleMessage) => {
    if (msg.type() === 'error' && !PageMonitor.isIgnoredConsoleError(msg.text())) {
      this.consoleErrors.push({ detail: `${msg.text()} [${msg.location().url}]` });
    }
  };

  private readonly onPageError = (error: Error) => {
    if (PageMonitor.isIgnoredConsoleError(error.message)) return;
    this.consoleErrors.push({ detail: `Excepción no controlada: ${error.message}` });
  };

  constructor(private readonly page: Page) {}

  start(): this {
    this.page.on('response', this.onResponse);
    this.page.on('requestfailed', this.onRequestFailed);
    this.page.on('console', this.onConsole);
    this.page.on('pageerror', this.onPageError);
    return this;
  }

  stop(): void {
    this.page.off('response', this.onResponse);
    this.page.off('requestfailed', this.onRequestFailed);
    this.page.off('console', this.onConsole);
    this.page.off('pageerror', this.onPageError);
  }

  get observedEndpoints(): number {
    return this.total;
  }

  get endpointProblems(): string[] {
    return [...this.badResponses, ...this.failedRequests].map((f) => f.detail);
  }

  get consoleProblems(): string[] {
    return this.consoleErrors.map((f) => f.detail);
  }
}
