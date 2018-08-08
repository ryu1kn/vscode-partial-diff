import {EXTENSION_ID} from './const';
import * as vscode from 'vscode';
import {SavedNormalisationRule} from './entities/normalisation-rule';

export default class ConfigStore {
    private readonly workspace: typeof vscode.workspace;

    constructor(workspace: typeof vscode.workspace) {
        this.workspace = workspace;
    }

    get preComparisonTextNormalizationRules() {
        return this.get('preComparisonTextNormalizationRules') as SavedNormalisationRule[];
    }

    private get(configName) {
        const extensionConfig = this.workspace.getConfiguration(EXTENSION_ID);
        return extensionConfig.get(configName);
    }
}
