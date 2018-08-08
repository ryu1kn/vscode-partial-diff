import NormalisationRulePicker from '../../lib/normalisation-rule-picker';
import * as assert from 'assert';
import {mockObject, when} from '../helpers';

suite('NormalisationRulePicker', () => {
    const vscWindow = mockObject('showQuickPick') as any;
    when(
        vscWindow.showQuickPick(
            [
                {label: 'RULE_NAME_1', picked: true, ruleIndex: 0, description: ''},
                {label: 'RULE_NAME_2', picked: false, ruleIndex: 1, description: ''}
            ],
            {canPickMany: true}
        )
    )
        .thenResolve([{label: 'RULE_NAME_2', picked: true, ruleIndex: 1}]);
    when(
        vscWindow.showQuickPick(
            [
                {label: 'RULE_NAME_3', picked: false, ruleIndex: 0, description: ''},
                {label: 'RULE_NAME_4', picked: true, ruleIndex: 1, description: ''}
            ],
            {canPickMany: true}
        )
    )
        .thenResolve();
    when(
        vscWindow.showQuickPick(
            [
                {label: '(no "name" set for this rule)', picked: true, ruleIndex: 0, description: ''}
            ],
            {canPickMany: true}
        )
    )
        .thenResolve([]);

    const rulePicker = new NormalisationRulePicker(vscWindow);

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
