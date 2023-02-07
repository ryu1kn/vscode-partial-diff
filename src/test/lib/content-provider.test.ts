import ContentProvider from '../../lib/content-provider';
import * as assert from 'assert';
import {mockType} from '../helpers';
import NormalisationRuleStore from '../../lib/normalisation-rule-store';
import * as vscode from 'vscode';
import SelectionInfoRegistry from '../../lib/selection-info-registry';

suite('ContentProvider', () => {

    const selectionInfoRegistry = new SelectionInfoRegistry();
    selectionInfoRegistry.set('key1', {
        text: 'TEXT_1',
        fileName: 'FILE_1',
        lineRanges: []
    });

    suite('When normalisation rules are given', () => {
        const normalisationRuleStore = mockType<NormalisationRuleStore>({
            activeRules: [{match: '_', replaceWith: ':'}]
        });
        const contentProvider = new ContentProvider(selectionInfoRegistry, normalisationRuleStore);

        test('it extracts text key from the given uri and uses it to retrieve text', () => {
            const uri = mockType<vscode.Uri>({path: 'text/file.txt', query: 'key=key1'});
            assert.deepEqual(contentProvider.provideTextDocumentContent(uri), 'TEXT:1');
        });

        test('it returns an empty string if a text is not yet selected', () => {
            const uri = mockType<vscode.Uri>({path: 'text/file.txt', query: 'key=keyNotExist'});
            assert.deepEqual(contentProvider.provideTextDocumentContent(uri), '');
        });
    });

    suite('When normalisation rules are NOT given', () => {
        const normalisationRuleStore = mockType<NormalisationRuleStore>({activeRules: []});
        const contentProvider = new ContentProvider(selectionInfoRegistry, normalisationRuleStore);

        test('it returns the registered text as is', () => {
            const uri = mockType<vscode.Uri>({path: 'text/file.txt', query: 'key=key1'});
            assert.deepEqual(contentProvider.provideTextDocumentContent(uri), 'TEXT_1');
        });
    });
});
