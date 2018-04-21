const NormalisationRuleStore = require('../../lib/normalisation-rule-store')

suite('NormalisationRuleStore', () => {
  let configStore
  let ruleStore

  beforeEach(() => {
    configStore = {
      preComparisonTextNormalizationRules: [
        { name: 'RULE1', enableOnStart: true },
        { name: 'RULE2', enableOnStart: true },
        { name: 'RULE3', enableOnStart: false },
        { name: 'RULE4' }
      ]
    }
    ruleStore = new NormalisationRuleStore({ configStore })
  })

  test('it gives pre-comparison text normalization rules from config', () => {
    expect(ruleStore.getAllRules()).to.eql([
      { name: 'RULE1', active: true },
      { name: 'RULE2', active: true },
      { name: 'RULE3', active: false },
      { name: 'RULE4', active: true }
    ])
  })

  test('it marks unspecified rules as disabled', () => {
    const activeRuleIndices = [1]
    ruleStore.specifyActiveRules(activeRuleIndices)
    const [firstRule] = ruleStore.getAllRules()
    expect(firstRule).to.eql({ name: 'RULE1', active: false })
  })

  test('it resets all rule states in the editor config', () => {
    const activeRuleIndices = [1]
    ruleStore.specifyActiveRules(activeRuleIndices)
    configStore.preComparisonTextNormalizationRules.push({ name: 'RULE_TMP' })
    expect(ruleStore.getAllRules()).to.eql([
      { name: 'RULE1', active: true },
      { name: 'RULE2', active: true },
      { name: 'RULE3', active: false },
      { name: 'RULE4', active: true },
      { name: 'RULE_TMP', active: true }
    ])
  })

  test('it returns all the active rules', () => {
    const activeRuleIndices = [1]
    ruleStore.specifyActiveRules(activeRuleIndices)
    expect(ruleStore.activeRules).to.eql([{ name: 'RULE2', active: true }])
  })

  test('it tells if there are any active rules', () => {
    const activeRuleIndices = [1]
    ruleStore.specifyActiveRules(activeRuleIndices)
    expect(ruleStore.hasActiveRules).to.be.true
  })

  test('it tells if there are no active rules', () => {
    const activeRuleIndices = []
    ruleStore.specifyActiveRules(activeRuleIndices)
    expect(ruleStore.hasActiveRules).to.be.false
  })
})
