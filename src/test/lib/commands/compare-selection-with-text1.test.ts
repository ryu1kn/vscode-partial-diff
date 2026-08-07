import {mock, mockType, verify} from '../../helpers';
import SelectionInfoRegistry from '../../../lib/selection-info-registry';
import CommandFactory from '../../../lib/command-factory';
import NormalisationRuleStore from '../../../lib/normalisation-rule-store';
import CommandAdaptor from '../../../lib/adaptors/command';
import TextEditor from '../../../lib/adaptors/text-editor';
import WindowAdaptor from '../../../lib/adaptors/window';
import WorkspaceAdaptor from '../../../lib/adaptors/workspace';
import EditableDiffSessionManager from '../../../lib/editable-diff-session-manager';
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('CompareSelectionWithText1', () => {

    const editor = mockType<TextEditor>({
        selectedText: 'SELECTED_TEXT',
        fileName: 'FILE2',
        uri: 'file:///2',
        selectedLineRanges: [{start: 5, end: 10}],
        singleSelectionRange: {startLine: 5, startChar: 0, endLine: 10, endChar: 1}
    });

    const selectionInfoRegistry = new SelectionInfoRegistry();
    selectionInfoRegistry.set('reg1', {
        text: 'PRE-SELECTED_TEXT',
        fileName: 'FILE1',
        lineRanges: [{start: 20, end: 25}]
    });

    const windowAdaptor = mock(WindowAdaptor);
    const normalisationRuleStore = mock(NormalisationRuleStore);
    const clipboard = mockType<typeof vscode.env.clipboard>();

    test('it saves selected text and takes a diff of 2 texts', async () => {

        const commandAdaptor = mock(CommandAdaptor);
        const commandFactory = new CommandFactory(
            selectionInfoRegistry,
            normalisationRuleStore,
            mock(WorkspaceAdaptor),
            commandAdaptor,
            windowAdaptor,
            mock(EditableDiffSessionManager),
            clipboard,
            () => new Date('2016-06-15T11:43:00Z')
        );
        const command = commandFactory.createCompareSelectionWithText1Command();

        await command.execute(editor);

        assert.deepEqual(selectionInfoRegistry.get('reg2'), {
            fileName: 'FILE2',
            lineRanges: [{'start': 5, 'end': 10}],
            text: 'SELECTED_TEXT',
            sourceUri: 'file:///2',
            targetKind: 'selection',
            selectionRange: {startLine: 5, startChar: 0, endLine: 10, endChar: 1}
        });
        verify(commandAdaptor.executeCommand(
            'vscode.diff',
            'partialdiff:text/reg1?_ts=1465990980000',
            'partialdiff:text/reg2?_ts=1465990980000',
            'FILE1 (ll.21-26) ↔ FILE2 (ll.6-11)'
        ));
    });

});
