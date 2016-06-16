
const EditorTextExtractor = require('../../lib/editor-text-extractor');

suite('EditorTextExtractor', () => {

    test('it extracts a text from editor for comparison', () => {
        const extractor = new EditorTextExtractor();
        const editor = fakeEditor('SELECTED_TEXT');
        expect(extractor.extract(editor)).to.eql('SELECTED_TEXT');
    });

    function fakeEditor(selectedText) {
        return {
            selection: {
                text: selectedText,
                isEmpty: !selectedText
            },
            document: {
                _entireText: `ENTIRE TEXT ${selectedText}`,
                getText: function (selection) {
                    return selection ? selection.text : this._entireText;
                }
            }
        };
    }
});
