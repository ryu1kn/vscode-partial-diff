
class EditorTextExtractor {

    extract(editor) {
        return this._isTextSelected(editor.selections) ?
            this._extractTexts(editor) : this._getEntireText(editor);
    }

    _isTextSelected(selections) {
        return selections.some(selection => !selection.isEmpty);
    }

    _extractTexts(editor) {
        return editor.selections
            .filter(selection => !selection.isEmpty)
            .map(selection => editor.document.getText(selection))
            .join('\n');
    }

    _getEntireText(editor) {
        return editor.document.getText();
    }

}

module.exports = EditorTextExtractor;
