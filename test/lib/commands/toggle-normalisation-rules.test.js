const td = require('testdouble')

const ToggleNormalisationRulesCommand = require('../../../lib/commands/toggle-normalisation-rules')

suite('ToggleNormalisationRulesCommand', () => {
  const RULES = 'RULES'
  const normalisationRuleStore = td.object('readRuleStatus', 'updateRuleStatus')
  td.when(normalisationRuleStore.readRuleStatus()).thenReturn(RULES)
  const normalisationRulePicker = td.object('show')
  td.when(normalisationRulePicker.show(RULES)).thenResolve('UPDATED_RULES')
  const command = new ToggleNormalisationRulesCommand({
    normalisationRulePicker,
    normalisationRuleStore
  })

  test('it updates the status of normalisation rules as user specified', async () => {
    await command.execute()

    td.verify(normalisationRuleStore.updateRuleStatus('UPDATED_RULES'))
  })
})
