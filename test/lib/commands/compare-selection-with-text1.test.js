const { expect, verify, when, mockObject, argCaptor } = require('../../helpers')

const CompareSelectionWithText1 = require('../../../lib/commands/compare-selection-with-text1')

suite('CompareSelectionWithText1', () => {
  test('it saves selected text and takes a diff of 2 texts', async () => {
    const selectionInfoBuilder = mockObject('extract')
    when(selectionInfoBuilder.extract('EDITOR')).thenReturn({
      text: 'SELECTED_TEXT',
      fileName: 'FILENAME',
      lineRanges: 'SELECTED_RANGE'
    })

    const selectionInfoRegistry = mockObject('set')
    const diffPresenter = mockObject('takeDiff')

    const command = new CompareSelectionWithText1({
      diffPresenter,
      selectionInfoBuilder,
      selectionInfoRegistry
    })

    await command.execute('EDITOR')

    const arg1 = argCaptor()
    const arg2 = argCaptor()
    verify(selectionInfoRegistry.set(arg1.capture(), arg2.capture()))
    expect(arg1.values[0]).to.eql('reg2')
    expect(arg2.values[0]).to.eql({
      text: 'SELECTED_TEXT',
      fileName: 'FILENAME',
      lineRanges: 'SELECTED_RANGE'
    })
    verify(diffPresenter.takeDiff('reg1', 'reg2'))
  })

  test('it prints callstack if error occurred', async () => {
    const logger = mockObject('error')
    const command = new CompareSelectionWithText1({ logger })

    await command.execute('EDITOR')

    verify(logger.error(), { times: 1, ignoreExtraArgs: true })
  })
})
