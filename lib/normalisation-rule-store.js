const isEqual = require('lodash.isequal')
const clone = value => JSON.parse(JSON.stringify(value))

class NormalisationRuleStore {
  constructor (params) {
    this._configStore = params.configStore
    this._setupRules(this._configStore.preComparisonTextNormalizationRules)
  }

  _setupRules (rules) {
    this._baseRules = clone(rules)
    this._rules = this._markAllActive(this._baseRules)
  }

  _markAllActive (rules) {
    return rules.map(rule => Object.assign({}, rule, { active: true }))
  }

  readRuleStatus () {
    const newBaseRules = this._configStore.preComparisonTextNormalizationRules
    if (!isEqual(newBaseRules, this._baseRules)) {
      this._setupRules(newBaseRules)
    }
    return this._rules
  }

  updateRuleStatus (ruleStates) {
    this._rules = this._rules.map((rule, index) =>
      Object.assign({}, rule, { active: ruleStates[index].active })
    )
  }
}

module.exports = NormalisationRuleStore
