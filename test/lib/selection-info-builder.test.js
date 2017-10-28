
const SelectionInfoBuilder = require('../../lib/selection-info-builder');

suite('SelectionInfoBuilder', () => {

    test('it extracts text from editor', () => {
        const textInfo = extractTextInfo(['SELECTED_TEXT']);
        expect(textInfo).to.include({text: 'SELECTED_TEXT'});
    });

    test('it extracts a whole text if no text is currently selected', () => {
        const textInfo = extractTextInfo(['']);
        expect(textInfo).to.include({text: 'ENTIRE TEXT'});
    });

    test('it extracts texts selected by all cursors and join them with newline character', () => {
        const textInfo = extractTextInfo(['SELECTED_TEXT_1', 'SELECTED_TEXT_2']);
        expect(textInfo).to.include({text: 'SELECTED_TEXT_1\nSELECTED_TEXT_2'});
    });

    test('it ignores cursor that is not selecting text if others are selecting one', () => {
        const textInfo = extractTextInfo(['', 'SELECTED_TEXT_1', '', 'SELECTED_TEXT_2']);
        expect(textInfo).to.include({text: 'SELECTED_TEXT_1\nSELECTED_TEXT_2'});
    });

    test('it extracts the whole text if no cursors are selecting text', () => {
        const textInfo = extractTextInfo(['', '', '']);
        expect(textInfo).to.include({text: 'ENTIRE TEXT'});
    });

    test('it extracts selected line ranges from editor', () => {
        const textInfo = extractTextInfo(['SELECTED_TEXT']);
        expect(textInfo.lineRanges).to.eql([{start: 'START_LINE_1', end: 'END_LINE_1'}]);
    });

    test('it returns an empty list if no text is selected', () => {
        const textInfo = extractTextInfo(['']);
        expect(textInfo.lineRanges).to.eql([]);
    });

    test('it extracts all the line ranges of text selections', () => {
        const textInfo = extractTextInfo(['SELECTED_TEXT_1', 'SELECTED_TEXT_2']);
        expect(textInfo.lineRanges).to.eql([
            {start: 'START_LINE_1', end: 'END_LINE_1'},
            {start: 'START_LINE_2', end: 'END_LINE_2'}
        ]);
    });

    test('it skips all cursors that are not selecting any text', () => {
        const textInfo = extractTextInfo(['SELECTED_TEXT_1', '', 'SELECTED_TEXT_3']);
        expect(textInfo.lineRanges).to.eql([
            {start: 'START_LINE_1', end: 'END_LINE_1'},
            {start: 'START_LINE_3', end: 'END_LINE_3'}
        ]);
    });

    test('it sorts the selections by ascending order of line number', () => {
        const selections = [
            {start: {line: 5}, end: {line: 6}},
            {start: {line: 1}, end: {line: 2}}
        ];
        const textInfo = extractTextInfoFromSelections(selections);
        expect(textInfo.lineRanges).to.eql([
            {start: 1, end: 2},
            {start: 5, end: 6}
        ]);
    });

    test('it extracts a file name from editor', () => {
        const textInfo = extractTextInfo(['SELECTED_TEXT']);
        expect(textInfo).to.include({fileName: 'FILENAME'});
    });

    function extractTextInfo(selectedTexts) {
        const selections = selectedTexts.map((text, i) => ({
            text,
            start: {line: `START_LINE_${i + 1}`},
            end: {line: `END_LINE_${i + 1}`},
            isEmpty: !text
        }));
        return extractTextInfoFromSelections(selections);
    }

    function extractTextInfoFromSelections(selections) {
        const selectionInfoBuilder = new SelectionInfoBuilder();
        return selectionInfoBuilder.extract(fakeEditor(selections));
    }

    function fakeEditor(selections) {
        return {
            selections,
            selection: selections[0],
            document: {
                fileName: 'FILENAME',
                _entireText: 'ENTIRE TEXT',
                getText(selection) {
                    return selection ? selection.text : this._entireText;
                }
            }
        };
    }
});
