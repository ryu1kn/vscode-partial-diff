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
    return rules.map(rule => ({
      label: rule.description,
      picked: rule.active
    }))
  }

  _convertToRules (pickedItems) {
    return pickedItems.map(pickedItem => ({
      description: pickedItem.label,
      active: pickedItem.picked
    }))
  }
}

module.exports = NormalisationRulePicker
