
const ContentProvider = require('../../lib/content-provider');

suite('ContentProvider', () => {

    test('it extracts text key from the given uri and uses it to retrieve text', () => {
        const content = retrieveEditorContent({});
        expect(content).to.eql('TEXT_1');
    });

    test('it returns an empty string if a text is not yet selected', () => {
        const selectionInfoRegistry = {get: () => {}};
        const content = retrieveEditorContent({selectionInfoRegistry});
        expect(content).to.eql('');
    });

    test('it uses a user defined rule to preprocess text to compare', () => {
        const preComparisonTextProcessRules = [{match: '_', replaceWith: ':'}];
        const content = retrieveEditorContent({preComparisonTextProcessRules});
        expect(content).to.eql('TEXT:1');
    });

    test('it applies all given rules to preprocess text', () => {
        const preComparisonTextProcessRules = [
            {match: '_', replaceWith: ':'},
            {match: 'T', replaceWith: 't'}
        ];
        const content = retrieveEditorContent({preComparisonTextProcessRules});
        expect(content).to.eql('tEXt:1');
    });

    function retrieveEditorContent({selectionInfoRegistry, preComparisonTextProcessRules}) {
        const defaultSelectionInfoRegistry = {get: key => ({text: `TEXT_${key}`})};
        const textResourceUtil = {getTextKey: uri => uri.replace('URI_', '')};
        const configStore = {
            get: key => key === 'preComparisonTextProcessRules' && (preComparisonTextProcessRules || [])
        };
        const contentProvider = new ContentProvider({
            selectionInfoRegistry: selectionInfoRegistry || defaultSelectionInfoRegistry,
            textResourceUtil,
            configStore
        });
        return contentProvider.provideTextDocumentContent('URI_1');
    }

});
