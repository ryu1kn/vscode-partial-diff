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

export default class BootstrapperFactory {
    create() {
        const logger = console;
        const selectionInfoRegistry = new SelectionInfoRegistry();
        const normalisationRuleStore = this.createNormalisationRuleStore();
        const commandFactory = new CommandFactory(
            selectionInfoRegistry,
            normalisationRuleStore,
            new CommandAdaptor(vscode.commands, vscode.Uri.parse),
            new WindowAdaptor(vscode.window),
            new Clipboard(clipboardy, process.platform),
            () => new Date()
        );
        const contentProvider = new ContentProvider(selectionInfoRegistry, normalisationRuleStore);
        return new Bootstrapper(commandFactory, contentProvider, vscode, logger);
    }

    private createNormalisationRuleStore() {
        return new NormalisationRuleStore(new WorkspaceAdaptor(vscode.workspace));
    }
}
