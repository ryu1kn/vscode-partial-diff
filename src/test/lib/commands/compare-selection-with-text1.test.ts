import {mock, mockType, verify} from '../../helpers';
import SelectionInfoRegistry from '../../../lib/selection-info-registry';
import * as vscode from 'vscode';
import CommandFactory from '../../../lib/command-factory';
import NormalisationRuleStore from '../../../lib/normalisation-rule-store';
import CommandAdaptor from '../../../lib/adaptors/command';
import TextEditor from '../../../lib/adaptors/text-editor';
import WindowComponent from '../../../lib/adaptors/window';

suite('CompareSelectionWithText1', () => {

    const editor = mockType<TextEditor>({
        selectedText: 'SELECTED_TEXT',
        fileName: 'FILE2',
        selectedLineRanges: [{start: 5, end: 10}]
    });

    const selectionInfoRegistry = new SelectionInfoRegistry();
    selectionInfoRegistry.set('reg1', {
        text: 'PRE-SELECTED_TEXT',
        fileName: 'FILE1',
        lineRanges: [{start: 20, end: 25}]
    });

    const fakeVscode = {window: mockType<typeof vscode.window>()};
    const windowComponent = mock(WindowComponent);
    const normalisationRuleStore = mock(NormalisationRuleStore);

    test('it saves selected text and takes a diff of 2 texts', async () => {

        const commandAdaptor = mock(CommandAdaptor);
        const commandFactory = new CommandFactory(selectionInfoRegistry, normalisationRuleStore, commandAdaptor, windowComponent, fakeVscode, () => new Date('2016-06-15T11:43:00Z'));
        const command = commandFactory.createCompareSelectionWithText1Command();

        await command.execute(editor);

        verify(commandAdaptor.executeCommand(
            'vscode.diff',
            'partialdiff:text/reg1?_ts=1465990980000',
            'partialdiff:text/reg2?_ts=1465990980000',
            'FILE1 (ll.21-26) ↔ FILE2 (ll.6-11)'
        ));
    });

});
