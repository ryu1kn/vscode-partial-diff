import {mock, mockType, verify, when, mockMethods} from '../../helpers';
import SelectionInfoRegistry from '../../../lib/selection-info-registry';
import TextEditor from '../../../lib/adaptors/text-editor';
import CommandFactory from '../../../lib/command-factory';
import WindowAdaptor from '../../../lib/adaptors/window';
import NormalisationRuleStore from '../../../lib/normalisation-rule-store';
import CommandAdaptor from '../../../lib/adaptors/command';
import * as assert from 'assert';
import * as vscode from 'vscode';
import GitAdapter from '../../../lib/adaptors/git';

suite('CompareSelectionWithClipboardCommand', () => {

    const editor = mockType<TextEditor>({
        selectedText: 'SELECTED_TEXT',
        fileName: 'FILE2',
        selectedLineRanges: [{start: 5, end: 10}]
    });
    const selectionInfoRegistry = new SelectionInfoRegistry();
    test('it compares selected text with clipboard text', async () => {
        const clipboard = mockMethods<typeof vscode.env.clipboard>(['readText']);
        const text = clipboard.readText();
        when(text).thenResolve('CLIPBOARD_TEXT' as Partial<Thenable<string>>);

        const commandAdaptor = mock(CommandAdaptor);
        const windowAdaptor = mock(WindowAdaptor);
        const normalisationRuleStore = mock(NormalisationRuleStore);
        const gitAdapter = mock(GitAdapter);
        const commandFactory = new CommandFactory(
            selectionInfoRegistry,
            normalisationRuleStore,
            commandAdaptor,
            windowAdaptor,
            gitAdapter,
            clipboard,
            () => new Date('2016-06-15T11:43:00Z')
        );

        const command = commandFactory.createCompareSelectionWithClipboardCommand();

        await command.execute(editor);

        assert.deepEqual(selectionInfoRegistry.get('clipboard'), {
            text: 'CLIPBOARD_TEXT',
            fileName: 'Clipboard',
            lineRanges: []
        });
        assert.deepEqual(selectionInfoRegistry.get('reg2'), {
            fileName: 'FILE2',
            lineRanges: [{'start': 5, 'end': 10}],
            text: 'SELECTED_TEXT'
        });
        verify(commandAdaptor.executeCommand(
            'vscode.diff',
            'partialdiff:text/clipboard?_ts=1465990980000',
            'partialdiff:text/reg2?_ts=1465990980000',
            'Clipboard ↔ FILE2 (ll.6-11)'
        ));
    });
});
