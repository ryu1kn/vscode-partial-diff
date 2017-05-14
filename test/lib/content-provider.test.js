
const ContentProvider = require('../../lib/content-provider');

suite('ContentProvider', () => {

    test('it extracts text key from the given uri and uses it to retrieve text', () => {
        const selectionInfoRegistry = {
            get: key => {return {text: `TEXT_${key}`};}
        };
        const textResourceUtil = {getTextKey: uri => uri.replace('URI_', '')};
        const contentProvider = new ContentProvider({selectionInfoRegistry, textResourceUtil});
        const content = contentProvider.provideTextDocumentContent('URI_1');
        expect(content).to.eql('TEXT_1');
    });

    test('it returns an empty string if a text is not yet selected', () => {
        const selectionInfoRegistry = {get: () => {}};
        const textResourceUtil = {getTextKey: uri => uri.replace('URI_', '')};
        const contentProvider = new ContentProvider({selectionInfoRegistry, textResourceUtil});
        const content = contentProvider.provideTextDocumentContent('URI_1');
        expect(content).to.eql('');
    });
});
