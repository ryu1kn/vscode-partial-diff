import SelectText1Command from '../../../lib/commands/save-text-1';
import {mockObject, when, verify, argCaptor, contains} from '../../helpers';
import * as assert from 'assert';

suite('SelectText1Command', () => {
  test('it saves selected text', () => {
    const selectionInfoBuilder = mockObject('extract') as any;
    when(selectionInfoBuilder.extract('EDITOR')).thenReturn({
      text: 'SELECTED_TEXT',
      fileName: 'FILENAME',
      lineRanges: 'SELECTED_RANGE'
    });
    const selectionInfoRegistry = mockObject('set') as any;
    const command = new SelectText1Command({
      selectionInfoBuilder,
      selectionInfoRegistry
    });
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
    const command = new SelectText1Command({logger});

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

    const command = new SelectText1Command({
      logger,
      selectionInfoBuilder,
      selectionInfoRegistry
    });
    command.execute('EDITOR');

    verify(logger.error(contains('Error: UNEXPECTED_ERROR')));
  });
});
