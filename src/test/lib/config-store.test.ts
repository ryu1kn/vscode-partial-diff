import ConfigStore from '../../lib/config-store';
import {when, mockObject} from '../helpers';
import * as assert from 'assert';

suite('ConfigStore', () => {
  test('it reads text normalisation rules from vscode.workspace', () => {
    const extensionConfig = mockObject('get') as any;
    when(extensionConfig.get('preComparisonTextNormalizationRules')).thenReturn(
      'RULES'
    );

    const workspace = mockObject('getConfiguration') as any;
    when(workspace.getConfiguration('partialDiff')).thenReturn(extensionConfig);

    const configStore = new ConfigStore({workspace});
    assert.deepEqual(configStore.preComparisonTextNormalizationRules, 'RULES');
  });
});
