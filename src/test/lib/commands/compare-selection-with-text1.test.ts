import {mock, mockType, verify, when, wrapVerify} from '../../helpers';
import CompareSelectionWithText1 from '../../../lib/commands/compare-selection-with-text1';
import DiffPresenter from '../../../lib/diff-presenter';
import SelectionInfoBuilder from '../../../lib/selection-info-builder';
import SelectionInfoRegistry from '../../../lib/selection-info-registry';
import * as vscode from 'vscode';

suite('CompareSelectionWithText1', () => {

    const editor = mockType<vscode.TextEditor>();

    test('it saves selected text and takes a diff of 2 texts', async () => {
        const selectionInfoBuilder = mock(SelectionInfoBuilder);
        when(selectionInfoBuilder.extract(editor)).thenReturn({
            text: 'SELECTED_TEXT',
            fileName: 'FILENAME',
            lineRanges: 'SELECTED_RANGE'
        });

        const selectionInfoRegistry = mock(SelectionInfoRegistry);
        const diffPresenter = mock(DiffPresenter);

        const command = new CompareSelectionWithText1(
            diffPresenter,
            selectionInfoBuilder,
            selectionInfoRegistry
        );

        await command.execute(editor);

        wrapVerify((c1, c2) => verify(selectionInfoRegistry.set(c1(), c2())), [
            [
                'reg2',
                {
                    text: 'SELECTED_TEXT',
                    fileName: 'FILENAME',
                    lineRanges: 'SELECTED_RANGE'
                }
            ]
        ]);
        verify(diffPresenter.takeDiff('reg1', 'reg2'));
    });

});
