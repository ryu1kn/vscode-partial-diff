import {mock, mockType, verify, when} from '../../helpers';
import NormalisationRuleStore from '../../../lib/normalisation-rule-store';
import {SavedNormalisationRule} from '../../../lib/types/normalisation-rule';
import WindowAdaptor from '../../../lib/adaptors/window';
import CommandFactory from '../../../lib/command-factory';
import SelectionInfoRegistry from '../../../lib/selection-info-registry';
import WorkspaceAdaptor from '../../../lib/adaptors/workspace';
import CommandAdaptor from '../../../lib/adaptors/command';
import GitAdapter from '../../../lib/adaptors/git';
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('ToggleNormalisationRulesCommand', () => {

    suite('When there are multiple rules registered', () => {
        const rule1 = mockType<SavedNormalisationRule>({name: 'RULE1'});
        const rule2 = mockType<SavedNormalisationRule>({name: 'RULE2'});
        const {command, deps} = createCommand([rule1, rule2]);

        test('it updates the status of normalisation rules as user specified', async () => {
            await command.execute();

            assert.deepEqual(deps.normalisationRuleStore.activeRules, [{name: 'RULE2', active: true}]);
        });
    });

    suite('When there are no rules registered', () => {
        const {command, deps} = createCommand([]);

        test('it just shows message if no rules are defined', async () => {
            await command.execute();

            verify(deps.windowAdaptor.showInformationMessage('Please set `partialDiff.preComparisonTextNormalizationRules` first'));
        });
    });

    function createCommand(rules: SavedNormalisationRule[]) {
        const workspace = mock(WorkspaceAdaptor);
        when(workspace.get('preComparisonTextNormalizationRules') as SavedNormalisationRule[]).thenReturn(rules);
        const normalisationRuleStore = new NormalisationRuleStore(workspace);
        const windowAdaptor = mock(WindowAdaptor);
        const gitAdapter = mock(GitAdapter);
        when(windowAdaptor.showQuickPick([
            {label: 'RULE1', picked: true, ruleIndex: 0, description: ''},
            {label: 'RULE2', picked: true, ruleIndex: 1, description: ''}
        ])).thenResolve([{
            ruleIndex: 1,
            label: 'RULE2',
            picked: true,
            description: ''
        }]);

        const commandFactory = new CommandFactory(
            new SelectionInfoRegistry(),
            normalisationRuleStore,
            mock(CommandAdaptor),
            windowAdaptor,
            gitAdapter,
            mockType<typeof vscode.env.clipboard>(),
            () => new Date('2016-06-15T11:43:00Z')
        );
        return {
            command: commandFactory.createToggleNormalisationRulesCommand(),
            deps: {windowAdaptor, normalisationRuleStore}
        } as any;
    }
});
