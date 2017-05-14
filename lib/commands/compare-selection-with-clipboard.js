
const path = require('path');
const TextKey = require('../const').TextKey;

class CompareSelectionWithClipboardCommand {

    constructor(params) {
        this._editorLineRangeExtractor = params.editorLineRangeExtractor;
        this._editorTextExtractor = params.editorTextExtractor;
        this._diffPresenter = params.diffPresenter;
        this._textRegistry = params.textRegistry;
        this._clipboard = params.clipboard;
        this._logger = params.logger;
    }

    execute(editor) {
        return Promise.resolve()
            .then(() => this._clipboard.read())
            .then(text => {
                this._textRegistry.set(TextKey.CLIPBOARD, {text, fileName: 'Clipboard'});
                this._saveSelectionAsText(TextKey.REGISTER2, editor);
                return this._diffPresenter.takeDiff(TextKey.CLIPBOARD, TextKey.REGISTER2);
            })
            .catch(this._handleError.bind(this));
    }

    _saveSelectionAsText(textKey, editor) {
        const fileName = path.basename(editor.document.fileName);
        const lineRange = this._editorLineRangeExtractor.extract(editor);
        const text = this._editorTextExtractor.extract(editor);
        return this._textRegistry.set(textKey, {text, fileName, lineRange});
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = CompareSelectionWithClipboardCommand;
