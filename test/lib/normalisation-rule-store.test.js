const NormalisationRuleStore = require('../../lib/normalisation-rule-store')

suite('NormalisationRuleStore', () => {
  let configStore
  let ruleStore

  beforeEach(() => {
    configStore = {
      preComparisonTextNormalizationRules: [
        { name: 'RULE1' },
        { name: 'RULE2' }
      ]
    }
    ruleStore = new NormalisationRuleStore({ configStore })
  })

  test('it gives pre-comparison text normalization rules from config as active rules', () => {
    expect(ruleStore.readRuleStatus()).to.eql([
      { name: 'RULE1', active: true },
      { name: 'RULE2', active: true }
    ])
  })

  test('it marks specified rules as disabled', () => {
    ruleStore.updateRuleStatus([{ active: false }, { active: true }])
    expect(ruleStore.readRuleStatus()).to.eql([
      { name: 'RULE1', active: false },
      { name: 'RULE2', active: true }
    ])
  })

  test('it sets all rules activates if rule set is updated in the editor config', () => {
    ruleStore.updateRuleStatus([{ active: false }, { active: true }])
    configStore.preComparisonTextNormalizationRules.pop()
    expect(ruleStore.readRuleStatus()).to.eql([{ name: 'RULE1', active: true }])
  })
})
