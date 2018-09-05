import VsTelemetryReporter from 'vscode-extension-telemetry';
import * as vscode from 'vscode';

export interface TelemetryReporter extends vscode.Disposable {
    logCommandTrigger(commandName: string): void;
}

export const createTelemetryReporter = (reporter?: VsTelemetryReporter) =>
    reporter ? new TelemetryReporterImpl(reporter) : new NullTelemetryReporter();

class TelemetryReporterImpl implements TelemetryReporter {
    private readonly reporter: VsTelemetryReporter;

    constructor(reporter: VsTelemetryReporter) {
        this.reporter = reporter;
    }

    logCommandTrigger(commandName: string): void {
        this.reporter.sendTelemetryEvent('commandTriggered', {commandName});
    }

    dispose(): void {
        this.reporter.dispose();
    }
}

class NullTelemetryReporter implements TelemetryReporter {
    logCommandTrigger(_commandName: string): void {
    }

    dispose(): void {
    }
}
