const td = require('testdouble')

const ToggleNormalisationRulesCommand = require('../../../lib/commands/toggle-normalisation-rules')

suite('ToggleNormalisationRulesCommand', () => {
  test('it updates the status of normalisation rules as user specified', async () => {
    const { command, deps } = createCommand({ rules: ['RULE'] })
    await command.execute()

    td.verify(
      deps.normalisationRuleStore.specifyActiveRules('ACTIVE_RULE_INDICES')
    )
  })

  test('it just shows message if no rules are defined', async () => {
    const { command, deps } = createCommand({ rules: [] })
    await command.execute()

    td.verify(
      deps.messageBar.showInfo(
        'Please set `partialDiff.preComparisonTextNormalizationRules` first'
      )
    )
  })

  function createCommand ({ rules }) {
    const normalisationRuleStore = td.object(
      'getAllRules',
      'specifyActiveRules'
    )
    td.when(normalisationRuleStore.getAllRules()).thenReturn(rules)
    const normalisationRulePicker = td.object('show')
    td
      .when(normalisationRulePicker.show(rules))
      .thenResolve('ACTIVE_RULE_INDICES')
    const deps = {
      messageBar: td.object('showInfo'),
      normalisationRulePicker,
      normalisationRuleStore
    }
    const command = new ToggleNormalisationRulesCommand(deps)
    return { command, deps }
  }
})
