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

      const textInfos = editors.map(editor =>
        this._selectionInfoBuilder.extract(editor)
      )
      this._registerTextInfo(
        textInfos,
        editors[0].viewColumn > editors[1].viewColumn
      )

      await 'HACK' // HACK: Avoid "TextEditor has been disposed" error
      await this._diffPresenter.takeDiff(
        TextKey.VISIBLE_EDITOR1,
        TextKey.VISIBLE_EDITOR2
      )
    } catch (e) {
      this._handleError(e)
    }
  }

  _registerTextInfo (textInfos, isReverseOrder) {
    const textInfo1 = textInfos[isReverseOrder ? 1 : 0]
    const textInfo2 = textInfos[isReverseOrder ? 0 : 1]
    this._selectionInfoRegistry.set(TextKey.VISIBLE_EDITOR1, textInfo1)
    this._selectionInfoRegistry.set(TextKey.VISIBLE_EDITOR2, textInfo2)
  }

  _handleError (e) {
    this._logger.error(e.stack)
  }
}

module.exports = CompareVisibleEditorsCommand
