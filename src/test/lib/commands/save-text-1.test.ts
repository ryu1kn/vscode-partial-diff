import SelectText1Command from '../../../lib/commands/save-text-1';
import {any, argCaptor, contains, mock, mockObject, mockType, verify, when} from '../../helpers';
import * as assert from 'assert';
import {Logger} from '../../../lib/logger';
import SelectionInfoRegistry from '../../../lib/selection-info-registry';
import SelectionInfoBuilder from '../../../lib/selection-info-builder';

suite('SelectText1Command', () => {

    const logger = mockType<Logger>();

    test('it saves selected text', () => {
        const selectionInfoBuilder = mockObject('extract') as any;
        when(selectionInfoBuilder.extract('EDITOR')).thenReturn({
            text: 'SELECTED_TEXT',
            fileName: 'FILENAME',
            lineRanges: 'SELECTED_RANGE'
        });
        const selectionInfoRegistry = mockObject('set') as any;
        const command = new SelectText1Command(
            selectionInfoBuilder,
            selectionInfoRegistry,
            logger
        );
        command.execute('EDITOR');

        const arg1 = argCaptor();
        const arg2 = argCaptor();
        verify(selectionInfoRegistry.set(arg1.capture(), arg2.capture()));
        assert.deepEqual(arg1.values[0], 'reg1');
        assert.deepEqual(arg2.values[0], {
            text: 'SELECTED_TEXT',
            fileName: 'FILENAME',
            lineRanges: 'SELECTED_RANGE'
        });
    });

    test('it prints callstack if error occurred', async () => {
        const logger = mockObject('error') as any;
        const selectionInfoBuilder = mock(SelectionInfoBuilder);
        when(selectionInfoBuilder.extract(any())).thenThrow(new Error('UNEXPECTED_ERROR'));
        const command = new SelectText1Command(
            selectionInfoBuilder,
            mock(SelectionInfoRegistry),
            logger
        );

        await command.execute('EDITOR');

        verify(logger.error(), {times: 1, ignoreExtraArgs: true});
    });

    test('it prints callstack if saving text failed', () => {
        const logger = mockObject('error') as any;
        const selectionInfoBuilder = mockObject('extract') as any;
        when(selectionInfoBuilder.extract('EDITOR')).thenReturn({
            text: 'SELECTED_TEXT',
            fileName: 'FILENAME',
            lineRanges: 'SELECTED_RANGE'
        });
        const selectionInfoRegistry = mockObject('set') as any;
        when(selectionInfoRegistry.set(), {ignoreExtraArgs: true}).thenThrow(
            new Error('UNEXPECTED_ERROR')
        );

        const command = new SelectText1Command(
            selectionInfoBuilder,
            selectionInfoRegistry,
            logger
        );
        command.execute('EDITOR');

        verify(logger.error(contains('Error: UNEXPECTED_ERROR')));
    });
});
