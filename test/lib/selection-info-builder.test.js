
const SelectionInfoBuilder = require('../../lib/selection-info-builder');

suite('SelectionInfoBuilder', () => {

    test('it extracts a text from editor for comparison', () => {
        const editorTextExtractor = {extract: sinon.stub().returns('SELECTED_TEXT')};
        const editorLineRangeExtractor = {extract: sinon.stub().returns('LINE_RANGES')};
        const selectionInfoBuilder = new SelectionInfoBuilder({editorTextExtractor, editorLineRangeExtractor});
        const editor = fakeEditor('SELECTED_TEXT');
        const textInfo = selectionInfoBuilder.extract(editor);

        expect(textInfo).to.eql({
            text: 'SELECTED_TEXT',
            fileName: 'FILENAME',
            lineRanges: 'LINE_RANGES'
        });
        expect(editorTextExtractor.extract).to.have.been.calledWith(editor);
        expect(editorLineRangeExtractor.extract).to.have.been.calledWith(editor);
    });

    function fakeEditor() {
        return {
            document: {
                fileName: 'FILENAME'
            }
        };
    }
});
