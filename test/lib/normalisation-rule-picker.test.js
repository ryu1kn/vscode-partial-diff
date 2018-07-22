const { expect } = require('../helpers')
const td = require('testdouble')

const NormalisationRulePicker = require('../../lib/normalisation-rule-picker')

suite('NormalisationRulePicker', () => {
  const vscWindow = td.object('showQuickPick')
  td
    .when(
      vscWindow.showQuickPick(
        [
          { label: 'RULE_NAME_1', picked: true, ruleIndex: 0 },
          { label: 'RULE_NAME_2', picked: false, ruleIndex: 1 }
        ],
        {
          canPickMany: true
        }
      )
    )
    .thenResolve([{ label: 'RULE_NAME_2', picked: true, ruleIndex: 1 }])
  td
    .when(
      vscWindow.showQuickPick(
        [
          { label: 'RULE_NAME_3', picked: false, ruleIndex: 0 },
          { label: 'RULE_NAME_4', picked: true, ruleIndex: 1 }
        ],
        {
          canPickMany: true
        }
      )
    )
    .thenResolve()
  td
    .when(
      vscWindow.showQuickPick(
        [
          { label: '(no "name" set for this rule)', picked: true, ruleIndex: 0 }
        ],
        {
          canPickMany: true
        }
      )
    )
    .thenResolve([])

  const rulePicker = new NormalisationRulePicker({ vscWindow })

  test('it returns the index of active rules that user chose', async () => {
    const activeRuleIndices = await rulePicker.show([
      { name: 'RULE_NAME_1', active: true },
      { name: 'RULE_NAME_2', active: false }
    ])

    expect(activeRuleIndices).to.eql([1])
  })

  test('it returns the indices of all active rules if user dismissed the selection popup', async () => {
    const activeRuleIndices = await rulePicker.show([
      { name: 'RULE_NAME_3', active: false },
      { name: 'RULE_NAME_4', active: true }
    ])

    expect(activeRuleIndices).to.eql([1])
  })

  test('it shows a note to tell the user that no name is given for the rule', async () => {
    const activeRuleIndices = await rulePicker.show([{ active: true }])

    expect(activeRuleIndices).to.eql([])
  })
})
