import {mock, mockType} from '../helpers';
import SelectionInfoRegistry from '../../lib/selection-info-registry';
import NormalisationRuleStore from '../../lib/normalisation-rule-store';
import DiffTitleBuilder from '../../lib/diff-title-builder';
import * as assert from 'assert';

suite('Title of Diff', () => {
    const selectionInfoRegistry = new SelectionInfoRegistry();
    selectionInfoRegistry.set('TEXT1', {text: 'SELECTED_TEXT1', fileName: 'FILE1', lineRanges: []});
    selectionInfoRegistry.set('TEXT2', {text: 'SELECTED_TEXT2', fileName: 'FILE2', lineRanges: []});

    suite('When there is no active normalisation rules', () => {
        const normalisationRuleStore = mock(NormalisationRuleStore);
        const diffTitleBuilder = new DiffTitleBuilder(normalisationRuleStore, selectionInfoRegistry);

        test('it builds up diff view title', async () => {
            const title = diffTitleBuilder.build('TEXT1', 'TEXT2');
            assert.equal(title, 'FILE1 \u2194 FILE2');
        });
    });

    suite('When there are active normalisation rules', () => {
        const normalisationRuleStore = mockType<NormalisationRuleStore>({hasActiveRules: true});
        const diffTitleBuilder = new DiffTitleBuilder(normalisationRuleStore, selectionInfoRegistry);

        test('it uses \u007E if the comparison was done with text normalisation', async () => {
            const title = diffTitleBuilder.build('TEXT1', 'TEXT2');
            assert.equal(title, 'FILE1 \u007E FILE2');
        });
    });
});
