const { expect, verify, when, mockObject, argCaptor } = require('../../helpers')

const CompareSelectionWithClipboardCommand = require('../../../lib/commands/compare-selection-with-clipboard')

suite('CompareSelectionWithClipboardCommand', () => {
  test('it compares selected text with clipboard text', async () => {
    const clipboard = mockObject('read')
    when(clipboard.read()).thenResolve('CLIPBOARD_TEXT')

    const selectionInfoBuilder = mockObject('extract')
    when(selectionInfoBuilder.extract('EDITOR')).thenReturn({
      text: 'SELECTED_TEXT',
      fileName: 'FILENAME',
      lineRanges: 'SELECTED_RANGE'
    })

    const selectionInfoRegistry = mockObject('set')
    const diffPresenter = mockObject('takeDiff')
    const command = new CompareSelectionWithClipboardCommand({
      clipboard,
      diffPresenter,
      selectionInfoBuilder,
      selectionInfoRegistry
    })

    await command.execute('EDITOR')

    const arg1 = argCaptor()
    const arg2 = argCaptor()
    verify(selectionInfoRegistry.set(arg1.capture(), arg2.capture()))
    expect(arg1.values[0]).to.eql('clipboard')
    expect(arg2.values[0]).to.eql({
      text: 'CLIPBOARD_TEXT',
      fileName: 'Clipboard'
    })
    expect(arg1.values[1]).to.eql('reg2')
    expect(arg2.values[1]).to.eql({
      text: 'SELECTED_TEXT',
      fileName: 'FILENAME',
      lineRanges: 'SELECTED_RANGE'
    })

    verify(diffPresenter.takeDiff('clipboard', 'reg2'))
  })

  test('it prints callstack if error occurred', async () => {
    const logger = mockObject('error')
    const command = new CompareSelectionWithClipboardCommand({ logger })

    await command.execute('EDITOR')

    verify(logger.error(), { times: 1, ignoreExtraArgs: true })
  })
})
