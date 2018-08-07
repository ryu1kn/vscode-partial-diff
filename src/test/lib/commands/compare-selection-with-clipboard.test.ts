import CompareSelectionWithClipboardCommand from '../../../lib/commands/compare-selection-with-clipboard';
import {argCaptor, mock, mockMethods, mockObject, mockType, verify, when} from '../../helpers';
import * as assert from 'assert';
import {Logger} from '../../../lib/logger';
import DiffPresenter from '../../../lib/diff-presenter';
import SelectionInfoBuilder from '../../../lib/selection-info-builder';
import SelectionInfoRegistry from '../../../lib/selection-info-registry';
import Clipboard from '../../../lib/clipboard';

suite('CompareSelectionWithClipboardCommand', () => {

    const logger = mockType<Logger>();

    test('it compares selected text with clipboard text', async () => {
        const clipboard = mockObject('read') as any;
        when(clipboard.read()).thenResolve('CLIPBOARD_TEXT');

        const selectionInfoBuilder = mockObject('extract') as any;
        when(selectionInfoBuilder.extract('EDITOR')).thenReturn({
            text: 'SELECTED_TEXT',
            fileName: 'FILENAME',
            lineRanges: 'SELECTED_RANGE'
        });

        const selectionInfoRegistry = mockObject('set') as any;
        const diffPresenter = mockObject('takeDiff') as any;
        const command = new CompareSelectionWithClipboardCommand(
            diffPresenter,
            selectionInfoBuilder,
            selectionInfoRegistry,
            clipboard,
            logger
        );

        await command.execute('EDITOR');

        const arg1 = argCaptor();
        const arg2 = argCaptor();
        verify(selectionInfoRegistry.set(arg1.capture(), arg2.capture()));
        assert.deepEqual(arg1.values[0], 'clipboard');
        assert.deepEqual(arg2.values[0], {
            text: 'CLIPBOARD_TEXT',
            fileName: 'Clipboard'
        });
        assert.deepEqual(arg1.values[1], 'reg2');
        assert.deepEqual(arg2.values[1], {
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

        await command.execute('EDITOR');

        verify(logger.error(), {times: 1, ignoreExtraArgs: true});
    });
});
