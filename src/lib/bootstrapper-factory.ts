import Bootstrapper from './bootstrapper';
import CommandFactory from './command-factory';
import WorkspaceAdaptor from './adaptors/workspace';
import ContentProvider from './content-provider';
import NormalisationRuleStore from './normalisation-rule-store';
import SelectionInfoRegistry from './selection-info-registry';
import * as vscode from 'vscode';
import CommandAdaptor from './adaptors/command';
import WindowAdaptor from './adaptors/window';
import {NullVsTelemetryReporter, VsTelemetryReporterCreator} from './telemetry-reporter';
import VsTelemetryReporter from 'vscode-extension-telemetry';
import EditableDiffSessionManager from './editable-diff-session-manager';
import ApplyBackService from './apply-back-service';
import EditableDiffFileSystemProvider from './editable-diff-file-system-provider';

export default class BootstrapperFactory {
    private workspaceAdaptor?: WorkspaceAdaptor;

    create() {
        const logger = console;
        const selectionInfoRegistry = new SelectionInfoRegistry();
        const workspaceAdaptor = this.getWorkspaceAdaptor();
        const commandAdaptor = new CommandAdaptor(vscode.commands, vscode.Uri.parse, logger);
        const normalisationRuleStore = new NormalisationRuleStore(workspaceAdaptor);
        const windowAdaptor = new WindowAdaptor(vscode.window);
        const applyBackService = new ApplyBackService(workspaceAdaptor, windowAdaptor, 400);
        const editableDiffSessionManager = new EditableDiffSessionManager(
            selectionInfoRegistry,
            workspaceAdaptor,
            commandAdaptor,
            applyBackService
        );
        const editableDiffFileSystemProvider = new EditableDiffFileSystemProvider();
        const commandFactory = new CommandFactory(
            selectionInfoRegistry,
            normalisationRuleStore,
            workspaceAdaptor,
            commandAdaptor,
            windowAdaptor,
            editableDiffSessionManager,
            vscode.env.clipboard,
            () => new Date()
        );
        const contentProvider = new ContentProvider(selectionInfoRegistry, normalisationRuleStore);
        return new Bootstrapper(
            commandFactory,
            contentProvider,
            editableDiffFileSystemProvider,
            workspaceAdaptor,
            commandAdaptor,
            editableDiffSessionManager
        );
    }

    private getWorkspaceAdaptor() {
        this.workspaceAdaptor = this.workspaceAdaptor || new WorkspaceAdaptor(vscode.workspace);
        return this.workspaceAdaptor;
    }

    getVsTelemetryReporterCreator(): VsTelemetryReporterCreator {
        const enableTelemetry = this.getWorkspaceAdaptor().get<boolean>('enableTelemetry');
        if (enableTelemetry) {
            return (id: string, version: string, telemetryKey: string) =>
                new VsTelemetryReporter(id, version, telemetryKey);
        } else {
            return () => new NullVsTelemetryReporter();
        }
    }
}
