class NormalisationRulePicker {
  constructor ({ vscWindow }) {
    this.vscWindow = vscWindow
  }

  async show (rules) {
    const items = this._convertToQuickPickItems(rules)
    const options = { canPickMany: true }
    const userSelection = await this.vscWindow.showQuickPick(items, options)
    return this._convertToRules(userSelection)
  }

  _convertToQuickPickItems (rules) {
    return rules.map((rule, index) => ({
      label: rule.name,
      picked: rule.active,
      ruleIndex: index
    }))
  }

  _convertToRules (pickedItems) {
    return pickedItems.map(pickedItem => pickedItem.ruleIndex)
  }
}

module.exports = NormalisationRulePicker
