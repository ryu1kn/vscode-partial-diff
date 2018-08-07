import Bootstrapper from './bootstrapper';
import CommandFactory from './command-factory';
import ConfigStore from './config-store';
import ContentProvider from './content-provider';
import NormalisationRuleStore from './normalisation-rule-store';
import SelectionInfoRegistry from './selection-info-registry';
import TextResourceUtil from './text-resource-util';
import {EXTENSION_SCHEME} from './const';
import * as vscode from 'vscode';

export default class BootstrapperFactory {
    create() {
        const logger = console;
        const selectionInfoRegistry = new SelectionInfoRegistry();
        const textResourceUtil = this.createTextResourceUtil();
        const normalisationRuleStore = this.createNormalisationRuleStore();
        const commandFactory = new CommandFactory({
            normalisationRuleStore,
            selectionInfoRegistry,
            textResourceUtil,
            vscode,
            logger
        });
        const contentProvider = new ContentProvider({
            normalisationRuleStore,
            selectionInfoRegistry,
            textResourceUtil
        });
        return new Bootstrapper(commandFactory, contentProvider, vscode);
    }

    private createTextResourceUtil() {
        return new TextResourceUtil({
            Uri: vscode.Uri,
            extensionScheme: EXTENSION_SCHEME,
            getCurrentDateFn: () => new Date()
        });
    }

    private createNormalisationRuleStore() {
        return new NormalisationRuleStore({
            configStore: new ConfigStore({workspace: vscode.workspace})
        });
    }
}
