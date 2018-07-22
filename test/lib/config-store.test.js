const { expect, stubWithArgs } = require('../helpers')

const ConfigStore = require('../../lib/config-store')

suite('ConfigStore', () => {
  test('it reads text normalisation rules from vscode.workspace', () => {
    const extensionConfig = {
      get: stubWithArgs(['preComparisonTextNormalizationRules'], 'RULES')
    }
    const workspace = {
      getConfiguration: stubWithArgs(['partialDiff'], extensionConfig)
    }
    const configStore = new ConfigStore({ workspace })
    expect(configStore.preComparisonTextNormalizationRules).to.eql('RULES')
  })
})
