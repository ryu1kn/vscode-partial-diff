const { mockObject, verify, when } = require('../../helpers')

const CompareVisibleEditorsCommand = require('../../../lib/commands/compare-visible-editors')

suite('CompareVisibleEditorsCommand', () => {
  const editor1 = { viewColumn: 1 }
  const editor2 = { viewColumn: 2 }

  test('it compares 2 visible editors', async () => {
    const { command, deps } = createCommand([editor1, editor2])
    await command.execute()

    verify(deps.selectionInfoRegistry.set('visible1', 'TEXT_INFO1'))
    verify(deps.selectionInfoRegistry.set('visible2', 'TEXT_INFO2'))
    verify(deps.diffPresenter.takeDiff('visible1', 'visible2'))
  })

  test('it keeps the visual order of the editors when presents a diff', async () => {
    const { command, deps } = createCommand([editor2, editor1])
    await command.execute()

    verify(deps.selectionInfoRegistry.set('visible1', 'TEXT_INFO1'))
    verify(deps.selectionInfoRegistry.set('visible2', 'TEXT_INFO2'))
  })

  test('it tells you that it needs 2 visible editors', async () => {
    const { command, deps } = createCommand([editor1])
    await command.execute()

    verify(
      deps.messageBar.showInfo('Please first open 2 documents to compare.')
    )
  })

  function createCommand (visibleTextEditors) {
    const selectionInfoBuilder = mockObject('extract')
    when(selectionInfoBuilder.extract(editor1)).thenReturn('TEXT_INFO1')
    when(selectionInfoBuilder.extract(editor2)).thenReturn('TEXT_INFO2')

    const dependencies = {
      editorWindow: { visibleTextEditors },
      diffPresenter: mockObject('takeDiff'),
      messageBar: mockObject('showInfo'),
      selectionInfoBuilder,
      selectionInfoRegistry: mockObject('set')
    }
    const command = new CompareVisibleEditorsCommand(dependencies)
    return { command, deps: dependencies }
  }
})
