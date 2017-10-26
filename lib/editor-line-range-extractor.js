
class EditorLineRangeExtractor {

    extract(editor) {
        return editor.selections
            .filter(selection => !selection.isEmpty)
            .map(selection => ({
                start: selection.start.line,
                end: selection.end.line
            }));
    }

}

module.exports = EditorLineRangeExtractor;
