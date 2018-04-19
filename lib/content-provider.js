const TextProcessRuleApplier = require('./text-process-rule-applier')

class ContentProvider {
  constructor (params) {
    this._selectionInfoRegistry = params.selectionInfoRegistry
    this._textResourceUtil = params.textResourceUtil
    this._textProcessRuleApplier = new TextProcessRuleApplier({
      normalisationRuleStore: params.normalisationRuleStore
    })
  }

  provideTextDocumentContent (uri) {
    const textKey = this._textResourceUtil.getTextKey(uri)
    const registeredText = (
      this._selectionInfoRegistry.get(textKey) || { text: '' }
    ).text
    return this._textProcessRuleApplier.applyTo(registeredText)
  }
}

module.exports = ContentProvider
