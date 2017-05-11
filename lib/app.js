
const path = require('path');

class App {

    constructor(params) {
        this._logger = params.logger;
        this._diffPresenter = params.diffPresenter;
        this._editorTextExtractor = params.editorTextExtractor;
        this._textRegistry = params.textRegistry;
    }

    saveSelectionAsText1(editor) {
        try {
            this._saveSelectionAsText('1', editor);
        } catch (e) {
            this._handleError(e);
        }
    }

    _saveSelectionAsText(textKey, editor) {
        const fileName = path.basename(editor.document.fileName);
        const lineRange = this._getLineRange(editor.selection);
        const text = this._editorTextExtractor.extract(editor);
        return this._textRegistry.set(textKey, {text, fileName, lineRange});
    }

    _getLineRange(selection) {
        if (selection.isEmpty) return null;
        return {
            start: selection.start.line,
            end: selection.end.line
        };
    }

    saveSelectionAsText2AndTakeDiff(editor) {
        return Promise.resolve().then(() => {
            this._saveSelectionAsText('2', editor);
            return this._diffPresenter.takeDiff();
        }).catch(this._handleError.bind(this));
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = App;
