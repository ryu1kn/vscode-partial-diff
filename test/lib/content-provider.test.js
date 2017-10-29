
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
        const preComparisonTextProcessRules = [{rule: '({text}) => text.toLowerCase()'}];
        const content = retrieveEditorContent({preComparisonTextProcessRules});
        expect(content).to.eql('text_1');
    });

    test('it applies all given rules to preprocess text', () => {
        const preComparisonTextProcessRules = [
            {rule: '({text}) => text.toLowerCase()'},
            {rule: '({text}) => text.split("").join("-")'}
        ];
        const content = retrieveEditorContent({preComparisonTextProcessRules});
        expect(content).to.eql('t-e-x-t-_-1');
    });

    test('it throws an error if a preprocess rule is not a function', () => {
        const preComparisonTextProcessRules = [
            {rule: '"NOT A FUNCTION JUST A STRING"'}
        ];
        expect(() => {
            retrieveEditorContent({preComparisonTextProcessRules});
        }).to.throw('Rule must be evaluated to a function');
    });

    test('it treats preprocess result as a text', () => {
        const preComparisonTextProcessRules = [
            {rule: '() => 1'},
            {rule: '({text}) => typeof text'}
        ];
        const content = retrieveEditorContent({preComparisonTextProcessRules});
        expect(content).to.eql('string');
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
