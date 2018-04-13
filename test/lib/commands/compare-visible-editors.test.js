const CompareVisibleEditorsCommand = require('../../../lib/commands/compare-visible-editors')
const td = require('testdouble')

suite('CompareVisibleEditorsCommand', () => {
  const editorWindow = {
    visibleTextEditors: ['EDITOR_1', 'EDITOR_2']
  }
  const selectionInfoBuilder = td.object(['extract'])
  td.when(selectionInfoBuilder.extract('EDITOR_1')).thenReturn('TEXT_INFO1')
  td.when(selectionInfoBuilder.extract('EDITOR_2')).thenReturn('TEXT_INFO2')
  const selectionInfoRegistry = td.object(['set'])
  const diffPresenter = td.object(['takeDiff'])
  const command = new CompareVisibleEditorsCommand({
    editorWindow,
    diffPresenter,
    selectionInfoBuilder,
    selectionInfoRegistry
  })

  test('it compares 2 visible editors', async () => {
    await command.execute()

    td.verify(selectionInfoRegistry.set('visible1', 'TEXT_INFO1'))
    td.verify(selectionInfoRegistry.set('visible2', 'TEXT_INFO2'))
    td.verify(diffPresenter.takeDiff('visible1', 'visible2'))
  })
})
