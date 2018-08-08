import CompareSelectionWithClipboardCommand from '../../../lib/commands/compare-selection-with-clipboard';
import {mock, mockType, verify, when, wrapVerify} from '../../helpers';
import DiffPresenter from '../../../lib/diff-presenter';
import SelectionInfoBuilder from '../../../lib/selection-info-builder';
import SelectionInfoRegistry from '../../../lib/selection-info-registry';
import Clipboard from '../../../lib/clipboard';
import * as vscode from 'vscode';

suite('CompareSelectionWithClipboardCommand', () => {

    const editor = mockType<vscode.TextEditor>();

    test('it compares selected text with clipboard text', async () => {
        const clipboard = mock(Clipboard);
        when(clipboard.read()).thenResolve('CLIPBOARD_TEXT');

        const selectionInfoBuilder = mock(SelectionInfoBuilder);
        when(selectionInfoBuilder.extract(editor)).thenReturn({
            text: 'SELECTED_TEXT',
            fileName: 'FILENAME',
            lineRanges: 'SELECTED_RANGE'
        });

        const selectionInfoRegistry = mock(SelectionInfoRegistry);
        const diffPresenter = mock(DiffPresenter);
        const command = new CompareSelectionWithClipboardCommand(
            diffPresenter,
            selectionInfoBuilder,
            selectionInfoRegistry,
            clipboard
        );

        await command.execute(editor);

        wrapVerify((c1, c2) => verify(selectionInfoRegistry.set(c1(), c2())), [
            [
                'clipboard',
                {
                    text: 'CLIPBOARD_TEXT',
                    fileName: 'Clipboard',
                    lineRanges: []
                }
            ],
            [
                'reg2',
                {
                    text: 'SELECTED_TEXT',
                    fileName: 'FILENAME',
                    lineRanges: 'SELECTED_RANGE'
                }
            ]
        ]);
        verify(diffPresenter.takeDiff('clipboard', 'reg2'));
    });
});
