import {any, argCaptor, mock, mockMethods, mockObject, mockType, verify, when} from '../../helpers';
import * as assert from 'assert';
import {Logger} from '../../../lib/logger';
import CompareSelectionWithText1 from '../../../lib/commands/compare-selection-with-text1';
import DiffPresenter from '../../../lib/diff-presenter';
import SelectionInfoBuilder from '../../../lib/selection-info-builder';
import SelectionInfoRegistry from '../../../lib/selection-info-registry';
import * as vscode from 'vscode';

suite('CompareSelectionWithText1', () => {

    const logger = mockType<Logger>();
    const editor = mockType<vscode.TextEditor>();

    test('it saves selected text and takes a diff of 2 texts', async () => {
        const selectionInfoBuilder = mockObject('extract') as any;
        when(selectionInfoBuilder.extract(editor)).thenReturn({
            text: 'SELECTED_TEXT',
            fileName: 'FILENAME',
            lineRanges: 'SELECTED_RANGE'
        });

        const selectionInfoRegistry = mockObject('set') as any;
        const diffPresenter = mockObject('takeDiff') as any;

        const command = new CompareSelectionWithText1(
            diffPresenter,
            selectionInfoBuilder,
            selectionInfoRegistry,
            logger
        );

        await command.execute(editor);

        const arg1 = argCaptor();
        const arg2 = argCaptor();
        verify(selectionInfoRegistry.set(arg1.capture(), arg2.capture()));
        assert.deepEqual(arg1.values![0], 'reg2');
        assert.deepEqual(arg2.values![0], {
            text: 'SELECTED_TEXT',
            fileName: 'FILENAME',
            lineRanges: 'SELECTED_RANGE'
        });
        verify(diffPresenter.takeDiff('reg1', 'reg2'));
    });

    test('it prints callstack if error occurred', async () => {
        const logger = mockMethods<Logger>(['error']);
        const selectionInfoBuilder = mock(SelectionInfoBuilder);
        when(selectionInfoBuilder.extract(any())).thenThrow(new Error('UNEXPECTED_ERROR'));

        const command = new CompareSelectionWithText1(
            mock(DiffPresenter),
            selectionInfoBuilder,
            mock(SelectionInfoRegistry),
            logger
        );

        await command.execute(editor);

        verify(logger.error(), {times: 1, ignoreExtraArgs: true});
    });
});
