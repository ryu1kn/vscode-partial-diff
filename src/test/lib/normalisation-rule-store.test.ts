import NormalisationRuleStore from '../../lib/normalisation-rule-store';
import * as assert from 'assert';
import ConfigStore from '../../lib/config-store';
import {mockType} from '../helpers';

suite('NormalisationRuleStore', () => {
    let configStore: ConfigStore;
    let ruleStore: NormalisationRuleStore;

    setup(() => {
        configStore = mockType<ConfigStore>({
            preComparisonTextNormalizationRules: [
                {name: 'RULE1', enableOnStart: true},
                {name: 'RULE2', enableOnStart: true},
                {name: 'RULE3', enableOnStart: false},
                {name: 'RULE4'}
            ]
        });
        ruleStore = new NormalisationRuleStore(configStore);
    });

    test('it gives pre-comparison text normalization rules from config', () => {
        assert.deepEqual(ruleStore.getAllRules(), [
            {name: 'RULE1', active: true},
            {name: 'RULE2', active: true},
            {name: 'RULE3', active: false},
            {name: 'RULE4', active: true}
        ]);
    });

    test('it marks unspecified rules as disabled', () => {
        const activeRuleIndices = [1];
        ruleStore.specifyActiveRules(activeRuleIndices);
        const [firstRule] = ruleStore.getAllRules();
        assert.deepEqual(firstRule, {name: 'RULE1', active: false});
    });

    test('it resets all rule states in the editor config', () => {
        const activeRuleIndices = [1];
        ruleStore.specifyActiveRules(activeRuleIndices);
        configStore.preComparisonTextNormalizationRules.push({name: 'RULE_TMP'} as any);
        assert.deepEqual(ruleStore.getAllRules(), [
            {name: 'RULE1', active: true},
            {name: 'RULE2', active: true},
            {name: 'RULE3', active: false},
            {name: 'RULE4', active: true},
            {name: 'RULE_TMP', active: true}
        ]);
    });

    test('it returns all the active rules', () => {
        const activeRuleIndices = [1];
        ruleStore.specifyActiveRules(activeRuleIndices);
        assert.deepEqual(ruleStore.activeRules, [{name: 'RULE2', active: true}]);
    });

    test('it tells if there are any active rules', () => {
        const activeRuleIndices = [1];
        ruleStore.specifyActiveRules(activeRuleIndices);
        assert.equal(ruleStore.hasActiveRules, true);
    });

    test('it tells if there are no active rules', () => {
        ruleStore.specifyActiveRules([]);
        assert.equal(ruleStore.hasActiveRules, false);
    });
});
