const {
  mockObject,
  when,
  verify,
  argCaptor,
  contains
} = require('../../helpers')
const assert = require('assert')

const SelectText1Command = require('../../../lib/commands/save-text-1')

suite('SelectText1Command', () => {
  test('it saves selected text', () => {
    const selectionInfoBuilder = mockObject('extract')
    when(selectionInfoBuilder.extract('EDITOR')).thenReturn({
      text: 'SELECTED_TEXT',
      fileName: 'FILENAME',
      lineRanges: 'SELECTED_RANGE'
    })
    const selectionInfoRegistry = mockObject('set')
    const command = new SelectText1Command({
      selectionInfoBuilder,
      selectionInfoRegistry
    })
    command.execute('EDITOR')

    const arg1 = argCaptor()
    const arg2 = argCaptor()
    verify(selectionInfoRegistry.set(arg1.capture(), arg2.capture()))
    assert.deepEqual(arg1.values[0], 'reg1')
    assert.deepEqual(arg2.values[0], {
      text: 'SELECTED_TEXT',
      fileName: 'FILENAME',
      lineRanges: 'SELECTED_RANGE'
    })
  })

  test('it prints callstack if error occurred', async () => {
    const logger = mockObject('error')
    const command = new SelectText1Command({ logger })

    await command.execute('EDITOR')

    verify(logger.error(), { times: 1, ignoreExtraArgs: true })
  })

  test('it prints callstack if saving text failed', () => {
    const logger = mockObject('error')
    const selectionInfoBuilder = mockObject('extract')
    when(selectionInfoBuilder.extract('EDITOR')).thenReturn({
      text: 'SELECTED_TEXT',
      fileName: 'FILENAME',
      lineRanges: 'SELECTED_RANGE'
    })
    const selectionInfoRegistry = mockObject('set')
    when(selectionInfoRegistry.set(), { ignoreExtraArgs: true }).thenThrow(
      new Error('UNEXPECTED_ERROR')
    )

    const command = new SelectText1Command({
      logger,
      selectionInfoBuilder,
      selectionInfoRegistry
    })
    command.execute('EDITOR')

    verify(logger.error(contains('Error: UNEXPECTED_ERROR')))
  })
})
