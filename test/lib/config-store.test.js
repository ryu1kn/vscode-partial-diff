const { expect, when, mockObject } = require('../helpers')

const ConfigStore = require('../../lib/config-store')

suite('ConfigStore', () => {
  test('it reads text normalisation rules from vscode.workspace', () => {
    const extensionConfig = mockObject('get')
    when(extensionConfig.get('preComparisonTextNormalizationRules')).thenReturn(
      'RULES'
    )

    const workspace = mockObject('getConfiguration')
    when(workspace.getConfiguration('partialDiff')).thenReturn(extensionConfig)

    const configStore = new ConfigStore({ workspace })
    expect(configStore.preComparisonTextNormalizationRules).to.eql('RULES')
  })
})
