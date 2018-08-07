import { EXTENSION_ID } from './const';

export default class ConfigStore {
  private _workspace: any;

  constructor (params) {
    this._workspace = params.workspace;
  }

  get preComparisonTextNormalizationRules () {
    return this._get('preComparisonTextNormalizationRules');
  }

  _get (configName) {
    const extensionConfig = this._workspace.getConfiguration(EXTENSION_ID);
    return extensionConfig.get(configName);
  }
}
