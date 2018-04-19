const { EXTENSION_ID } = require('./const')

class ConfigStore {
  constructor (params) {
    this._workspace = params.workspace
  }

  get preComparisonTextNormalizationRules () {
    return this._get('preComparisonTextNormalizationRules')
  }

  _get (configName) {
    const extensionConfig = this._workspace.getConfiguration(EXTENSION_ID)
    return extensionConfig.get(configName)
  }
}

module.exports = ConfigStore
