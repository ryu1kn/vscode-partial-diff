class ToggleNormalisationRulesCommand {
  constructor (params) {
    this._normalisationRulePicker = params.normalisationRulePicker
    this._normalisationRuleStore = params.normalisationRuleStore
  }

  async execute () {
    try {
      const rules = this._normalisationRuleStore.readRuleStatus()
      const newRules = await this._normalisationRulePicker.show(rules)
      this._normalisationRuleStore.updateRuleStatus(newRules)
    } catch (e) {
      this._handleError(e)
    }
  }

  _handleError (e) {
    this._logger.error(e.stack)
  }
}

module.exports = ToggleNormalisationRulesCommand
