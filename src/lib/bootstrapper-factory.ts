import Bootstrapper from './bootstrapper';
import CommandFactory from './command-factory';
import WorkspaceAdaptor from './adaptors/workspace';
import ContentProvider from './content-provider';
import NormalisationRuleStore from './normalisation-rule-store';
import SelectionInfoRegistry from './selection-info-registry';
import * as vscode from 'vscode';
import CommandAdaptor from './adaptors/command';
import WindowAdaptor from './adaptors/window';
import Clipboard from './adaptors/clipboard';
import * as clipboardy from 'clipboardy';
import {createTelemetryReporter, TelemetryReporter} from './telemetry-reporter';
import {createTelemetryReporter as createVsTelemetryReporter} from './adaptors/telemetry-reporter';
import {join} from 'path';

export default class BootstrapperFactory {
    private workspaceAdaptor?: WorkspaceAdaptor;
    private telemetryReporter?: TelemetryReporter;

    create() {
        const logger = console;
        const selectionInfoRegistry = new SelectionInfoRegistry();
        const workspaceAdaptor = this.getWorkspaceAdaptor();
        const telemetryReporter = this.getTelemetryReporter();
        const commandAdaptor = new CommandAdaptor(vscode.commands, vscode.Uri.parse, telemetryReporter, logger);
        const normalisationRuleStore = new NormalisationRuleStore(workspaceAdaptor);
        const commandFactory = new CommandFactory(
            selectionInfoRegistry,
            normalisationRuleStore,
            commandAdaptor,
            new WindowAdaptor(vscode.window),
            new Clipboard(clipboardy, process.platform),
            () => new Date()
        );
        const contentProvider = new ContentProvider(selectionInfoRegistry, normalisationRuleStore);
        return new Bootstrapper(commandFactory, contentProvider, workspaceAdaptor, commandAdaptor);
    }

    private getWorkspaceAdaptor() {
        this.workspaceAdaptor = this.workspaceAdaptor || new WorkspaceAdaptor(vscode.workspace);
        return this.workspaceAdaptor;
    }

    getTelemetryReporter(): TelemetryReporter {
        this.telemetryReporter = this.telemetryReporter || this.createTelemetryReporter();
        return this.telemetryReporter;
    }

    private createTelemetryReporter(): TelemetryReporter {
        const enableTelemetry = this.getWorkspaceAdaptor().get<boolean>('enableTelemetry');
        const packageJsonPath = join(__dirname, '..', '..', 'package.json');
        const reporter = enableTelemetry ? createVsTelemetryReporter(packageJsonPath) : undefined;
        return createTelemetryReporter(reporter);
    }
}
