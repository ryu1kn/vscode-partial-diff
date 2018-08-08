import SelectText1Command from '../../../lib/commands/save-text-1';
import {mock, mockType, verify, when, wrapVerify} from '../../helpers';
import SelectionInfoRegistry from '../../../lib/selection-info-registry';
import SelectionInfoBuilder from '../../../lib/selection-info-builder';
import * as vscode from 'vscode';

suite('SelectText1Command', () => {

    const editor = mockType<vscode.TextEditor>();

    test('it saves selected text', () => {
        const selectionInfoBuilder = mock(SelectionInfoBuilder);
        when(selectionInfoBuilder.extract(editor)).thenReturn({
            text: 'SELECTED_TEXT',
            fileName: 'FILENAME',
            lineRanges: 'SELECTED_RANGE'
        });
        const selectionInfoRegistry = mock(SelectionInfoRegistry);
        const command = new SelectText1Command(
            selectionInfoBuilder,
            selectionInfoRegistry
        );
        command.execute(editor);

        wrapVerify((c1, c2) => verify(selectionInfoRegistry.set(c1(), c2())), [
            [
                'reg1',
                {
                    text: 'SELECTED_TEXT',
                    fileName: 'FILENAME',
                    lineRanges: 'SELECTED_RANGE'
                }
            ]
        ]);
    });
});
