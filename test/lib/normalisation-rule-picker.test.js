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
  const rulePicker = new NormalisationRulePicker({ vscWindow })

  test('it returns the index of active rules that user chose', async () => {
    const newStatus = await rulePicker.show([
      { name: 'RULE_NAME_1', active: true },
      { name: 'RULE_NAME_2', active: false }
    ])

    expect(newStatus).to.eql([1])
  })
})
