import Bootstrapper from './bootstrapper';
import CommandFactory from './command-factory';
import ConfigStore from './config-store';
import ContentProvider from './content-provider';
import NormalisationRuleStore from './normalisation-rule-store';
import SelectionInfoRegistry from './selection-info-registry';
import * as vscode from 'vscode';
import CommandAdaptor from './adaptors/command';
import WindowComponent from './adaptors/window';

export default class BootstrapperFactory {
    create() {
        const logger = console;
        const selectionInfoRegistry = new SelectionInfoRegistry();
        const normalisationRuleStore = this.createNormalisationRuleStore();
        const commandAdaptor = new CommandAdaptor(vscode.commands, vscode.Uri.parse);
        const windowComponent = new WindowComponent(vscode.window);
        const commandFactory = new CommandFactory(
            selectionInfoRegistry,
            normalisationRuleStore,
            commandAdaptor,
            windowComponent,
            vscode,
            () => new Date()
        );
        const contentProvider = new ContentProvider(
            selectionInfoRegistry,
            normalisationRuleStore,
            () => new Date()
        );
        return new Bootstrapper(commandFactory, contentProvider, vscode, logger);
    }

    private createNormalisationRuleStore() {
        return new NormalisationRuleStore(new ConfigStore(vscode.workspace));
    }
}
