import ToggleNormalisationRulesCommand from '../../../lib/commands/toggle-normalisation-rules';
import { mockObject, when, verify } from '../../helpers';

suite('ToggleNormalisationRulesCommand', () => {
  test('it updates the status of normalisation rules as user specified', async () => {
    const { command, deps } = createCommand({ rules: ['RULE'] });
    await command.execute();

    verify(
      deps.normalisationRuleStore.specifyActiveRules('ACTIVE_RULE_INDICES')
    );
  });

  test('it just shows message if no rules are defined', async () => {
    const { command, deps } = createCommand({ rules: [] });
    await command.execute();

    verify(
      deps.messageBar.showInfo(
        'Please set `partialDiff.preComparisonTextNormalizationRules` first'
      )
    );
  });

  function createCommand ({ rules }) {
    const normalisationRuleStore = mockObject([
      'getAllRules',
      'specifyActiveRules'
    ]);
    when(normalisationRuleStore.getAllRules()).thenReturn(rules);

    const normalisationRulePicker = mockObject('show') as any;
    when(normalisationRulePicker.show(rules)).thenResolve('ACTIVE_RULE_INDICES');

    const deps = {
      messageBar: mockObject('showInfo'),
      normalisationRulePicker,
      normalisationRuleStore
    };
    const command = new ToggleNormalisationRulesCommand(deps);
    return { command, deps } as any;
  }
});
