const td = require('testdouble')

const NormalisationRulePicker = require('../../lib/normalisation-rule-picker')

suite('NormalisationRulePicker', () => {
  const vscWindow = td.object('showQuickPick')
  td
    .when(
      vscWindow.showQuickPick([{ label: 'DESCRIPTION', picked: true }], {
        canPickMany: true
      })
    )
    .thenResolve([{ label: 'DESCRIPTION', picked: false }])
  const rulePicker = new NormalisationRulePicker({ vscWindow })

  test('it returns the new activation status that user specified', async () => {
    const newStatus = await rulePicker.show([
      { description: 'DESCRIPTION', active: true }
    ])

    expect(newStatus).to.eql([{ description: 'DESCRIPTION', active: false }])
  })
})
