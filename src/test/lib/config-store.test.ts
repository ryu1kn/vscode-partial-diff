import ConfigStore from '../../lib/config-store';
import {mockMethods, when} from '../helpers';
import * as assert from 'assert';
import * as vscode from 'vscode';
import {WorkspaceConfiguration} from 'vscode';

suite('ConfigStore', () => {
    test('it reads text normalisation rules from vscode.workspace', () => {
        const extensionConfig = mockMethods<WorkspaceConfiguration>(['get']);
        when(extensionConfig.get('preComparisonTextNormalizationRules')).thenReturn(
            'RULES'
        );

        const workspace = mockMethods<typeof vscode.workspace>(['getConfiguration']);
        when(workspace.getConfiguration('partialDiff')).thenReturn(extensionConfig);

        const configStore = new ConfigStore(workspace);
        assert.deepEqual(configStore.get('preComparisonTextNormalizationRules'), 'RULES');
    });
});
