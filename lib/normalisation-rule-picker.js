class NormalisationRulePicker {
  constructor ({ vscWindow }) {
    this.vscWindow = vscWindow
  }

  async show (rules) {
    const items = this._convertToQuickPickItems(rules)
    const options = { canPickMany: true }
    const userSelection = await this.vscWindow.showQuickPick(items, options)
    const activeItems = userSelection || items.filter(item => item.picked)
    return this._convertToRules(activeItems)
  }

  _convertToQuickPickItems (rules) {
    return rules.map((rule, index) => ({
      label: rule.name || '(no "name" set for this rule)',
      picked: rule.active,
      ruleIndex: index
    }))
  }

  _convertToRules (pickedItems) {
    return pickedItems.map(pickedItem => pickedItem.ruleIndex)
  }
}

module.exports = NormalisationRulePicker
