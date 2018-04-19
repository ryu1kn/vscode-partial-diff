class ToggleNormalisationRulesCommand {
  constructor (params) {
    this._logger = params.logger
    this._messageBar = params.messageBar
    this._normalisationRulePicker = params.normalisationRulePicker
    this._normalisationRuleStore = params.normalisationRuleStore
  }

  async execute () {
    try {
      const rules = this._normalisationRuleStore.getAllRules()
      if (rules.length > 0) {
        const newRules = await this._normalisationRulePicker.show(rules)
        this._normalisationRuleStore.specifyActiveRules(newRules)
      } else {
        await this._messageBar.showInfo(
          'Please set `partialDiff.preComparisonTextNormalizationRules` first'
        )
      }
    } catch (e) {
      this._handleError(e)
    }
  }

  _handleError (e) {
    this._logger.error(e.stack)
  }
}

module.exports = ToggleNormalisationRulesCommand
