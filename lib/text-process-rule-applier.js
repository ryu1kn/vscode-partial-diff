class TextProcessRuleApplier {
  constructor (params) {
    this._configStore = params.configStore
  }

  applyTo (text) {
    const rules = this._configStore.preComparisonTextNormalizationRules
    return rules.length !== 0 ? this._applyRulesToText(rules, text) : text
  }

  _applyRulesToText (rules, text) {
    return rules.reduce(
      (newText, rule) => this._applyRuleToText(rule, newText),
      text
    )
  }

  _applyRuleToText (rule, text) {
    const pattern = new RegExp(rule.match, 'g')

    if (typeof rule.replaceWith === 'string') { return text.replace(pattern, rule.replaceWith) }

    return text.replace(pattern, matched => {
      switch (rule.replaceWith.letterCase) {
        case 'lower':
          return matched.toLowerCase()
        case 'upper':
          return matched.toUpperCase()
        default:
          return matched
      }
    })
  }
}

module.exports = TextProcessRuleApplier
