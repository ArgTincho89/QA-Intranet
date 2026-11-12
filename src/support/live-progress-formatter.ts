// Formatter de consola: una línea por escenario en cuanto termina (✓/✗, nombre, duración),
// en vez del contador "N/M steps [barra]" + mensajes sueltos del formatter "progress-bar".
// Conserva el detalle de cada fallo y el resumen final, igual que hacía progress-bar.
import { Formatter, formatterHelpers } from '@cucumber/cucumber';
import type { IFormatterOptions } from '@cucumber/cucumber/lib/formatter';
import * as messages from '@cucumber/messages';

const { formatIssue, formatSummary, isIssue } = formatterHelpers;

export default class LiveProgressFormatter extends Formatter {
  private readonly startTimes = new Map<string, number>();
  private total = 0;
  private done = 0;
  private issueCount = 0;
  private testRunStarted?: messages.TestRunStarted;

  constructor(options: IFormatterOptions) {
    super(options);
    options.eventBroadcaster.on('envelope', (envelope: messages.Envelope) => {
      if (envelope.pickle) this.total += 1;
      else if (envelope.testRunStarted) this.testRunStarted = envelope.testRunStarted;
      else if (envelope.testCaseStarted) this.startTimes.set(envelope.testCaseStarted.id, Date.now());
      else if (envelope.testCaseFinished) this.logScenarioResult(envelope.testCaseFinished);
      else if (envelope.testRunFinished) this.logSummary(envelope.testRunFinished);
    });
  }

  private logScenarioResult(testCaseFinished: messages.TestCaseFinished): void {
    const { testCaseStartedId, willBeRetried } = testCaseFinished;
    const attempt = this.eventDataCollector.getTestCaseAttempt(testCaseStartedId);
    const { worstTestStepResult } = attempt;
    if (willBeRetried) return; // solo se cuenta/imprime el intento definitivo

    this.done += 1;
    const startedAt = this.startTimes.get(testCaseStartedId) ?? Date.now();
    const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
    const status = worstTestStepResult.status;
    const symbol = status === messages.TestStepResultStatus.PASSED ? '✓' : '✗';
    const color = this.colorFns.forStatus(status);
    const counter = `[${String(this.done).padStart(String(this.total).length, ' ')}/${this.total}]`;
    this.log(color(`${symbol} ${counter} ${attempt.pickle.name} (${seconds}s)`) + '\n');

    if (isIssue(worstTestStepResult)) {
      this.issueCount += 1;
      this.log(
        formatIssue({
          colorFns: this.colorFns,
          number: this.issueCount,
          snippetBuilder: this.snippetBuilder,
          supportCodeLibrary: this.supportCodeLibrary,
          testCaseAttempt: attempt,
          printAttachments: this.printAttachments,
        })
      );
    }
  }

  private logSummary(testRunFinished: messages.TestRunFinished): void {
    if (!this.testRunStarted) return;
    const duration = {
      seconds: Number(
        BigInt(testRunFinished.timestamp.seconds) - BigInt(this.testRunStarted.timestamp.seconds)
      ),
      nanos: testRunFinished.timestamp.nanos - this.testRunStarted.timestamp.nanos,
    };
    this.log(
      formatSummary({
        colorFns: this.colorFns,
        testCaseAttempts: this.eventDataCollector.getTestCaseAttempts(),
        testRunDuration: duration,
      })
    );
  }
}
