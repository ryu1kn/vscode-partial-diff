const td = require('testdouble')

const ToggleNormalisationRulesCommand = require('../../../lib/commands/toggle-normalisation-rules')

suite('ToggleNormalisationRulesCommand', () => {
  const RULES = 'RULES'
  const normalisationRuleStore = td.object('getAllRules', 'specifyActiveRules')
  td.when(normalisationRuleStore.getAllRules()).thenReturn(RULES)
  const normalisationRulePicker = td.object('show')
  td
    .when(normalisationRulePicker.show(RULES))
    .thenResolve('ACTIVE_RULE_INDICES')
  const command = new ToggleNormalisationRulesCommand({
    normalisationRulePicker,
    normalisationRuleStore
  })

  test('it updates the status of normalisation rules as user specified', async () => {
    await command.execute()

    td.verify(normalisationRuleStore.specifyActiveRules('ACTIVE_RULE_INDICES'))
  })
})
