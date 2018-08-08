import CompareSelectionWithClipboardCommand from '../../../lib/commands/compare-selection-with-clipboard';
import {argCaptor, mock, mockMethods, mockType, verify, when} from '../../helpers';
import * as assert from 'assert';
import {Logger} from '../../../lib/logger';
import DiffPresenter from '../../../lib/diff-presenter';
import SelectionInfoBuilder from '../../../lib/selection-info-builder';
import SelectionInfoRegistry from '../../../lib/selection-info-registry';
import Clipboard from '../../../lib/clipboard';
import * as vscode from 'vscode';

suite('CompareSelectionWithClipboardCommand', () => {

    const logger = mockType<Logger>();
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
            clipboard,
            logger
        );

        await command.execute(editor);

        const arg1 = argCaptor();
        const arg2 = argCaptor();
        verify(selectionInfoRegistry.set(arg1.capture(), arg2.capture()));
        assert.deepEqual(arg1.values![0], 'clipboard');
        assert.deepEqual(arg2.values![0], {
            text: 'CLIPBOARD_TEXT',
            fileName: 'Clipboard',
            lineRanges: []
        });
        assert.deepEqual(arg1.values![1], 'reg2');
        assert.deepEqual(arg2.values![1], {
            text: 'SELECTED_TEXT',
            fileName: 'FILENAME',
            lineRanges: 'SELECTED_RANGE'
        });

        verify(diffPresenter.takeDiff('clipboard', 'reg2'));
    });

    test('it prints callstack if error occurred', async () => {
        const clipboard = mock(Clipboard);
        when(clipboard.read()).thenReject(new Error('UNEXPECTED_ERROR'));

        const logger = mockMethods<Logger>(['error']);

        const command = new CompareSelectionWithClipboardCommand(
            mock(DiffPresenter),
            mock(SelectionInfoBuilder),
            mock(SelectionInfoRegistry),
            clipboard,
            logger
        );

        await command.execute(editor);

        verify(logger.error(), {times: 1, ignoreExtraArgs: true});
    });
});
