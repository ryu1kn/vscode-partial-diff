
class EditorTextExtractor {

    extract(editor) {
        const selection = editor.selection;

        if (selection.isEmpty) return null;
        return {
            start: selection.start.line,
            end: selection.end.line
        };
    }

}

module.exports = EditorTextExtractor;
