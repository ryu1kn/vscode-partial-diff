import CompareSelectionWithText1 from '../../../lib/commands/compare-selection-with-text1';

import {argCaptor, mockObject, verify, when} from '../../helpers';
import * as assert from 'assert';

suite('CompareSelectionWithText1', () => {
  test('it saves selected text and takes a diff of 2 texts', async () => {
    const selectionInfoBuilder = mockObject('extract') as any;
    when(selectionInfoBuilder.extract('EDITOR')).thenReturn({
      text: 'SELECTED_TEXT',
      fileName: 'FILENAME',
      lineRanges: 'SELECTED_RANGE'
    });

    const selectionInfoRegistry = mockObject('set') as any;
    const diffPresenter = mockObject('takeDiff') as any;

    const command = new CompareSelectionWithText1({
      diffPresenter,
      selectionInfoBuilder,
      selectionInfoRegistry
    });

    await command.execute('EDITOR');

    const arg1 = argCaptor();
    const arg2 = argCaptor();
    verify(selectionInfoRegistry.set(arg1.capture(), arg2.capture()));
    assert.deepEqual(arg1.values[0], 'reg2');
    assert.deepEqual(arg2.values[0], {
      text: 'SELECTED_TEXT',
      fileName: 'FILENAME',
      lineRanges: 'SELECTED_RANGE'
    });
    verify(diffPresenter.takeDiff('reg1', 'reg2'));
  });

  test('it prints callstack if error occurred', async () => {
    const logger = mockObject('error') as any;
    const command = new CompareSelectionWithText1({logger});

    await command.execute('EDITOR');

    verify(logger.error(), {times: 1, ignoreExtraArgs: true});
  });
});
