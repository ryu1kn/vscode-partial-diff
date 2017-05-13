
const EditorLineRangeExtractor = require('../../lib/editor-line-range-extractor');

suite('EditorLineRangeExtractor', () => {

    test('it extracts the line range of text selection', () => {
        const extractor = new EditorLineRangeExtractor();
        const editor = fakeEditor('SELECTED_TEXT');
        expect(extractor.extract(editor)).to.eql({start: 'START_LINE', end: 'END_LINE'});
    });

    test('it returns null if no text is selected', () => {
        const extractor = new EditorLineRangeExtractor();
        const editor = fakeEditor('');
        expect(extractor.extract(editor)).to.eql(null);
    });

    function fakeEditor(selectedText) {
        return {
            selection: {
                start: {line: 'START_LINE'},
                end: {line: 'END_LINE'},
                isEmpty: !selectedText
            }
        };
    }
});
