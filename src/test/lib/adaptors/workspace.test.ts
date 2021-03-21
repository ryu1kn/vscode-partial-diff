import WorkspaceAdaptor from '../../../lib/adaptors/workspace';
import {mockMethods, when} from '../../helpers';
import * as assert from 'assert';
import * as vscode from 'vscode';
import {WorkspaceConfiguration} from 'vscode';

suite('WorkspaceAdaptor', () => {
    test('it reads text normalisation rules from vscode.workspace', () => {
        const extensionConfig = mockMethods<WorkspaceConfiguration>(['get']);
        const Rules = <Partial<Promise<never>>> 'RULES';

        when(extensionConfig.get('preComparisonTextNormalizationRules')).thenReturn(
            Rules
        );

        const workspace = mockMethods<typeof vscode.workspace>(['getConfiguration']);
        when(workspace.getConfiguration('partialDiff')).thenReturn(extensionConfig);

        const workspaceAdaptor = new WorkspaceAdaptor(workspace);
        assert.deepEqual(workspaceAdaptor.get('preComparisonTextNormalizationRules'), 'RULES');
    });
});
