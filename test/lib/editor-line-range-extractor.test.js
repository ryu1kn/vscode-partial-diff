
const EditorLineRangeExtractor = require('../../lib/editor-line-range-extractor');

suite('EditorLineRangeExtractor', () => {

    test('it extracts the line range of text selection', () => {
        const extractor = new EditorLineRangeExtractor();
        const editor = fakeEditor(['SELECTED_TEXT']);
        expect(extractor.extract(editor)).to.eql([{start: 'START_LINE_1', end: 'END_LINE_1'}]);
    });

    test('it returns null if no text is selected', () => {
        const extractor = new EditorLineRangeExtractor();
        const editor = fakeEditor(['']);
        expect(extractor.extract(editor)).to.eql([]);
    });

    test('it extracts all the line ranges of text selections', () => {
        const extractor = new EditorLineRangeExtractor();
        const editor = fakeEditor(['SELECTED_TEXT_1', 'SELECTED_TEXT_2']);
        expect(extractor.extract(editor)).to.eql([
            {start: 'START_LINE_1', end: 'END_LINE_1'},
            {start: 'START_LINE_2', end: 'END_LINE_2'}
        ]);
    });

    test('it skips all cursors that are not selecting any text', () => {
        const extractor = new EditorLineRangeExtractor();
        const editor = fakeEditor(['SELECTED_TEXT_1', '', 'SELECTED_TEXT_3']);
        expect(extractor.extract(editor)).to.eql([
            {start: 'START_LINE_1', end: 'END_LINE_1'},
            {start: 'START_LINE_3', end: 'END_LINE_3'}
        ]);
    });

    function fakeEditor(selectedTexts) {
        const selections = selectedTexts.map((text, i) => ({
            start: {line: `START_LINE_${i + 1}`},
            end: {line: `END_LINE_${i + 1}`},
            isEmpty: !text
        }));
        return {
            selections,
            selection: selections[0]
        };
    }
});
