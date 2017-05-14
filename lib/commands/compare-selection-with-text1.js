
const path = require('path');

const TextKey = require('../const').TextKey;

class CompareSelectionWithText1Command {

    constructor(params) {
        this._logger = params.logger;
        this._diffPresenter = params.diffPresenter;
        this._editorLineRangeExtractor = params.editorLineRangeExtractor;
        this._editorTextExtractor = params.editorTextExtractor;
        this._textRegistry = params.textRegistry;
    }

    execute(editor) {
        return Promise.resolve().then(() => {
            this._saveSelectionAsText(TextKey.REGISTER2, editor);
            return this._diffPresenter.takeDiff(TextKey.REGISTER1, TextKey.REGISTER2);
        }).catch(this._handleError.bind(this));
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

module.exports = CompareSelectionWithText1Command;
