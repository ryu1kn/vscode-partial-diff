
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

    test('it replaces all occurence of specified pattern', () => {
        const preComparisonTextProcessRules = [{match: 'T', replaceWith: 't'}];
        const content = retrieveEditorContent({preComparisonTextProcessRules});
        expect(content).to.eql('tEXt_1');
    });

    test('it can use part of matched text as replace text', () => {
        const preComparisonTextProcessRules = [{match: '(TE)(XT)', replaceWith: '$2$1'}];
        const content = retrieveEditorContent({preComparisonTextProcessRules});
        expect(content).to.eql('XTTE_1');
    });

    test('it can change all characters to lower case', () => {
        const preComparisonTextProcessRules = [{
            match: '.*',
            replaceWith: {
                expression: '$&',
                letterCase: 'lower'
            }
        }];
        const content = retrieveEditorContent({preComparisonTextProcessRules});
        expect(content).to.eql('text_1');
    });

    test('it can change all characters to upper case', () => {
        const preComparisonTextProcessRules = [{
            match: '.*',
            replaceWith: {
                expression: '$&',
                letterCase: 'upper'
            }
        }];
        const content = retrieveEditorContent({
            preComparisonTextProcessRules,
            registeredText: 'Registered Text'
        });
        expect(content).to.eql('REGISTERED TEXT');
    });

    test('it applies all given rules to preprocess text', () => {
        const preComparisonTextProcessRules = [
            {match: '_', replaceWith: ':'},
            {match: 'T', replaceWith: 't'}
        ];
        const content = retrieveEditorContent({preComparisonTextProcessRules});
        expect(content).to.eql('tEXt:1');
    });

    function retrieveEditorContent({selectionInfoRegistry, preComparisonTextProcessRules, registeredText}) {
        const defaultSelectionInfoRegistry = {get: key => ({text: registeredText || `TEXT_${key}`})};
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
