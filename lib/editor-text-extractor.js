
class EditorTextExtractor {

    extract(editor) {
        const selection = !editor.selection.isEmpty ? editor.selection : null;
        return editor.document.getText(selection);
    }

}

module.exports = EditorTextExtractor;
