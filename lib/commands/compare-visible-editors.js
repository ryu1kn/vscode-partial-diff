const { TextKey } = require('../const')

class CompareVisibleEditorsCommand {
  constructor (params) {
    this._logger = params.logger
    this._editorWindow = params.editorWindow
    this._diffPresenter = params.diffPresenter
    this._messageBar = params.messageBar
    this._selectionInfoBuilder = params.selectionInfoBuilder
    this._selectionInfoRegistry = params.selectionInfoRegistry
  }

  async execute () {
    try {
      const editors = this._editorWindow.visibleTextEditors
      if (editors.length !== 2) {
        this._messageBar.showInfo('Please first open 2 documents to compare.')
        return
      }
      const textInfo1 = this._selectionInfoBuilder.extract(editors[0])
      this._selectionInfoRegistry.set(TextKey.VISIBLE_EDITOR1, textInfo1)

      const textInfo2 = this._selectionInfoBuilder.extract(editors[1])
      this._selectionInfoRegistry.set(TextKey.VISIBLE_EDITOR2, textInfo2)

      await 'HACK' // HACK: Avoid "TextEditor has been disposed" error
      await this._diffPresenter.takeDiff(
        TextKey.VISIBLE_EDITOR1,
        TextKey.VISIBLE_EDITOR2
      )
    } catch (e) {
      this._handleError(e)
    }
  }

  _handleError (e) {
    this._logger.error(e.stack)
  }
}

module.exports = CompareVisibleEditorsCommand
