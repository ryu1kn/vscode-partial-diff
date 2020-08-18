import NormalisationRulePicker from '../../lib/normalisation-rule-picker';
import * as assert from 'assert';
import {mock, when} from '../helpers';
import WindowAdaptor from '../../lib/adaptors/window';

suite('NormalisationRulePicker', () => {
    const windowAdaptor = mock(WindowAdaptor);
    when(
        windowAdaptor.showQuickPick(
            [
                {label: 'RULE_NAME_1', picked: true, ruleIndex: 0, description: ''},
                {label: 'RULE_NAME_2', picked: false, ruleIndex: 1, description: ''}
            ]
        )
    )
        .thenResolve([{label: 'RULE_NAME_2', picked: false, ruleIndex: 1, description: ''}]);
    when(
        windowAdaptor.showQuickPick(
            [
                {label: 'RULE_NAME_3', picked: false, ruleIndex: 0, description: ''},
                {label: 'RULE_NAME_4', picked: true, ruleIndex: 1, description: ''}
            ]
        )
    )
        .thenResolve(undefined);
    when(
        windowAdaptor.showQuickPick(
            [
                {label: '(no "name" set for this rule)', picked: true, ruleIndex: 0, description: ''}
            ]
        )
    )
        .thenResolve([]);

    const rulePicker = new NormalisationRulePicker(windowAdaptor);

    test('it returns the index of active rules that user chose', async () => {
        const activeRuleIndices = await rulePicker.show([
            {name: 'RULE_NAME_1', active: true} as any,
            {name: 'RULE_NAME_2', active: false} as any
        ]);

        assert.deepEqual(activeRuleIndices, [1]);
    });

    test('it returns the indices of all active rules if user dismissed the selection popup', async () => {
        const activeRuleIndices = await rulePicker.show([
            {name: 'RULE_NAME_3', active: false} as any,
            {name: 'RULE_NAME_4', active: true}
        ]);

        assert.deepEqual(activeRuleIndices, [1]);
    });

    test('it shows a note to tell the user that no name is given for the rule', async () => {
        const activeRuleIndices = await rulePicker.show([{active: true} as any]);

        assert.deepEqual(activeRuleIndices, []);
    });
});
