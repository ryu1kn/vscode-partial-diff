import * as assert from 'assert';
import {mockType} from '../helpers';
import NormalisationRuleStore from '../../lib/normalisation-rule-store';
import TextProcessRuleApplier from '../../lib/text-process-rule-applier';

suite('Text process rule applications', () => {
    const text = 'TEXT_1';

    test('it uses a user defined rule to preprocess text to compare', () => {
        const activeRules = [{match: '_', replaceWith: ':'}];
        const applier = createTextProcessRuleApplier(activeRules);
        assert.deepEqual(applier.applyTo(text), 'TEXT:1');
    });

    test('it replaces all occurence of specified pattern', () => {
        const activeRules = [{match: 'T', replaceWith: 't'}];
        const applier = createTextProcessRuleApplier(activeRules);
        assert.deepEqual(applier.applyTo(text), 'tEXt_1');
    });

    test('it can use part of matched text as replace text', () => {
        const activeRules = [{match: '(TE)(XT)', replaceWith: '$2$1'}];
        const applier = createTextProcessRuleApplier(activeRules);
        assert.deepEqual(applier.applyTo(text), 'XTTE_1');
    });

    test('it can change matched text to lower case', () => {
        const activeRules = [
            {
                match: 'TE',
                replaceWith: {letterCase: 'lower'}
            }
        ];
        const applier = createTextProcessRuleApplier(activeRules);
        assert.deepEqual(applier.applyTo(text), 'teXT_1');
    });

    test('it can change all characters to upper case', () => {
        const activeRules = [
            {
                match: 'Register',
                replaceWith: {letterCase: 'upper'}
            }
        ];
        const applier = createTextProcessRuleApplier(activeRules);
        assert.deepEqual(applier.applyTo('Registered Text'), 'REGISTERed Text');
    });

    test('it applies all given rules to preprocess text', () => {
        const activeRules = [
            {match: '_', replaceWith: ':'},
            {match: 'T', replaceWith: 't'}
        ];
        const applier = createTextProcessRuleApplier(activeRules);
        assert.deepEqual(applier.applyTo(text), 'tEXt:1');
    });

    function createTextProcessRuleApplier(activeRules: any) {
        const normalisationRuleStore = mockType<NormalisationRuleStore>({activeRules: activeRules || []});
        return new TextProcessRuleApplier(normalisationRuleStore);
    }
});
