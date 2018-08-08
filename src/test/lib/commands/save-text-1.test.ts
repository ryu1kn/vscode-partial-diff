import SelectText1Command from '../../../lib/commands/save-text-1';
import {any, contains, mock, mockMethods, mockType, verify, when, wrapVerify} from '../../helpers';
import {Logger} from '../../../lib/logger';
import SelectionInfoRegistry from '../../../lib/selection-info-registry';
import SelectionInfoBuilder from '../../../lib/selection-info-builder';
import * as vscode from 'vscode';

suite('SelectText1Command', () => {

    const logger = mockType<Logger>();
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
            selectionInfoRegistry,
            logger
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

    test('it prints callstack if error occurred', async () => {
        const logger = mockMethods<Logger>(['error']);
        const selectionInfoBuilder = mock(SelectionInfoBuilder);
        when(selectionInfoBuilder.extract(any())).thenThrow(new Error('UNEXPECTED_ERROR'));
        const command = new SelectText1Command(
            selectionInfoBuilder,
            mock(SelectionInfoRegistry),
            logger
        );

        await command.execute(editor);

        verify(logger.error(), {times: 1, ignoreExtraArgs: true});
    });

    test('it prints callstack if saving text failed', () => {
        const logger = mockMethods<Logger>(['error']);
        const selectionInfoBuilder = mock(SelectionInfoBuilder) as any;
        when(selectionInfoBuilder.extract(editor)).thenReturn({
            text: 'SELECTED_TEXT',
            fileName: 'FILENAME',
            lineRanges: 'SELECTED_RANGE'
        });
        const selectionInfoRegistry = mock(SelectionInfoRegistry);
        when(selectionInfoRegistry.set(any(), any()), {ignoreExtraArgs: true}).thenThrow(
            new Error('UNEXPECTED_ERROR')
        );

        const command = new SelectText1Command(
            selectionInfoBuilder,
            selectionInfoRegistry,
            logger
        );
        command.execute(editor);

        verify(logger.error(contains('Error: UNEXPECTED_ERROR')));
    });
});
