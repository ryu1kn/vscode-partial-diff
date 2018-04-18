const td = require('testdouble')

const NormalisationRulePicker = require('../../lib/normalisation-rule-picker')

suite('NormalisationRulePicker', () => {
  const vscWindow = td.object('showQuickPick')
  td
    .when(
      vscWindow.showQuickPick([{ label: 'RULE_NAME', picked: true }], {
        canPickMany: true
      })
    )
    .thenResolve([{ label: 'RULE_NAME', picked: false }])
  const rulePicker = new NormalisationRulePicker({ vscWindow })

  test('it returns the new activation status that user specified', async () => {
    const newStatus = await rulePicker.show([
      { name: 'RULE_NAME', active: true }
    ])

    expect(newStatus).to.eql([{ name: 'RULE_NAME', active: false }])
  })
})
