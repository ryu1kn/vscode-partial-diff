
const EditorTextExtractor = require('../../lib/editor-text-extractor');

suite('EditorTextExtractor', () => {

    test('it extracts a text from editor for comparison', () => {
        const extractor = new EditorTextExtractor();
        const editor = fakeEditor(['SELECTED_TEXT']);
        expect(extractor.extract(editor)).to.eql('SELECTED_TEXT');
    });

    test('it extracts a whole text if no text is currently selected', () => {
        const extractor = new EditorTextExtractor();
        const editor = fakeEditor(['']);
        expect(extractor.extract(editor)).to.eql('ENTIRE TEXT');
    });

    test('it extracts texts selected by all cursors and join them with newline character', () => {
        const extractor = new EditorTextExtractor();
        const editor = fakeEditor(['SELECTED_TEXT_1', 'SELECTED_TEXT_2']);
        expect(extractor.extract(editor)).to.eql('SELECTED_TEXT_1\nSELECTED_TEXT_2');
    });

    test('it ignores cursor that is not selecting text if others are selecting one', () => {
        const extractor = new EditorTextExtractor();
        const editor = fakeEditor(['', 'SELECTED_TEXT_1', '', 'SELECTED_TEXT_2']);
        expect(extractor.extract(editor)).to.eql('SELECTED_TEXT_1\nSELECTED_TEXT_2');
    });

    test('it extracts the whole text if no cursors are selecting text', () => {
        const extractor = new EditorTextExtractor();
        const editor = fakeEditor(['', '', '']);
        expect(extractor.extract(editor)).to.eql('ENTIRE TEXT');
    });

    function fakeEditor(selectedTexts) {
        const selections = selectedTexts.map(text => ({text, isEmpty: !text}));
        return {
            selections,
            selection: selections[0],
            document: {
                _entireText: 'ENTIRE TEXT',
                getText(selection) {
                    return selection ? selection.text : this._entireText;
                }
            }
        };
    }
});
