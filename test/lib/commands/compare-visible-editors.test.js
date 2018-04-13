const CompareVisibleEditorsCommand = require('../../../lib/commands/compare-visible-editors')
const td = require('testdouble')

suite('CompareVisibleEditorsCommand', () => {
  test('it compares 2 visible editors', async () => {
    const {command, deps} = createCommand(['EDITOR_1', 'EDITOR_2'])
    await command.execute()

    td.verify(deps.selectionInfoRegistry.set('visible1', 'TEXT_INFO1'))
    td.verify(deps.selectionInfoRegistry.set('visible2', 'TEXT_INFO2'))
    td.verify(deps.diffPresenter.takeDiff('visible1', 'visible2'))
  })

  test('it tells you that it needs 2 visible editors', async () => {
    const {command, deps} = createCommand(['EDITOR_1'])
    await command.execute()

    td.verify(deps.messageBar.showInfo('Please first open 2 documents to compare.'))
  })

  function createCommand (visibleTextEditors) {
    const selectionInfoBuilder = td.object(['extract'])
    td.when(selectionInfoBuilder.extract('EDITOR_1')).thenReturn('TEXT_INFO1')
    td.when(selectionInfoBuilder.extract('EDITOR_2')).thenReturn('TEXT_INFO2')

    const dependencies = {
      editorWindow: { visibleTextEditors },
      diffPresenter: td.object(['takeDiff']),
      messageBar: td.object(['showInfo']),
      selectionInfoBuilder,
      selectionInfoRegistry: td.object(['set'])
    }
    const command = new CompareVisibleEditorsCommand(dependencies)
    return {command, deps: dependencies}
  }
})
