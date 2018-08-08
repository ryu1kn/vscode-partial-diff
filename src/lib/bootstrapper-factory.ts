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
        const commandFactory = new CommandFactory(
            selectionInfoRegistry,
            normalisationRuleStore,
            textResourceUtil,
            vscode,
            logger
        );
        const contentProvider = new ContentProvider(
            selectionInfoRegistry,
            normalisationRuleStore,
            textResourceUtil
        );
        return new Bootstrapper(commandFactory, contentProvider, vscode);
    }

    private createTextResourceUtil() {
        return new TextResourceUtil(
            EXTENSION_SCHEME,
            vscode.Uri.parse,
            () => new Date()
        );
    }

    private createNormalisationRuleStore() {
        return new NormalisationRuleStore(new ConfigStore(vscode.workspace));
    }
}
