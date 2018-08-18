import ToggleNormalisationRulesCommand from '../../../lib/commands/toggle-normalisation-rules';
import {mock, mockMethods, mockType, verify, when} from '../../helpers';
import NormalisationRuleStore from '../../../lib/normalisation-rule-store';
import NormalisationRulePicker from '../../../lib/normalisation-rule-picker';
import {LoadedNormalisationRule} from '../../../lib/entities/normalisation-rule';
import WindowAdaptor from '../../../lib/adaptors/window';

suite('ToggleNormalisationRulesCommand', () => {

    const rules = mockType<LoadedNormalisationRule>();

    test('it updates the status of normalisation rules as user specified', async () => {
        const {command, deps} = createCommand({rules: [rules]});
        await command.execute();

        verify(
            deps.normalisationRuleStore.specifyActiveRules('ACTIVE_RULE_INDICES')
        );
    });

    test('it just shows message if no rules are defined', async () => {
        const {command, deps} = createCommand({rules: []});
        await command.execute();

        verify(
            deps.windowAdaptor.showInformationMessage(
                'Please set `partialDiff.preComparisonTextNormalizationRules` first'
            )
        );
    });

    function createCommand({rules}: {rules: LoadedNormalisationRule[]}) {
        const normalisationRuleStore = mockMethods<NormalisationRuleStore>(['getAllRules', 'specifyActiveRules']);
        when(normalisationRuleStore.getAllRules()).thenReturn(rules);

        const normalisationRulePicker = mockMethods<NormalisationRulePicker>(['show']);
        when(normalisationRulePicker.show(rules)).thenResolve('ACTIVE_RULE_INDICES');

        const deps = {
            windowAdaptor: mock(WindowAdaptor),
            normalisationRulePicker,
            normalisationRuleStore
        };
        const command = new ToggleNormalisationRulesCommand(
            deps.normalisationRuleStore,
            deps.normalisationRulePicker,
            deps.windowAdaptor
        );
        return {command, deps} as any;
    }
});
