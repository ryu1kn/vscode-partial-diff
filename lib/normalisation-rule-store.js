const isEqual = require('lodash.isequal')
const omit = require('lodash.omit')
const clone = value => JSON.parse(JSON.stringify(value))

class NormalisationRuleStore {
  constructor (params) {
    this._configStore = params.configStore
    this._setupRules(this._configStore.preComparisonTextNormalizationRules)
  }

  _setupRules (rules) {
    this._baseRules = clone(rules)
    this._rules = this._resetRuleStatus(this._baseRules)
  }

  _resetRuleStatus (rules) {
    return rules.map(rule =>
      Object.assign({}, omit(rule, ['enableOnStart']), {
        active: rule.enableOnStart !== false
      })
    )
  }

  getAllRules () {
    const newBaseRules = this._configStore.preComparisonTextNormalizationRules
    if (!isEqual(newBaseRules, this._baseRules)) {
      this._setupRules(newBaseRules)
    }
    return this._rules
  }

  get activeRules () {
    return this.getAllRules().filter(rule => rule.active)
  }

  get hasActiveRules () {
    return this.activeRules.length > 0
  }

  specifyActiveRules (ruleIndices) {
    this._rules = this._rules.map((rule, index) =>
      Object.assign({}, rule, { active: ruleIndices.includes(index) })
    )
  }
}

module.exports = NormalisationRuleStore
