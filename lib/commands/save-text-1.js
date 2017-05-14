
const path = require('path');

const TextKey = require('../const').TextKey;

class SaveText1Command {

    constructor(params) {
        this._logger = params.logger;
        this._editorLineRangeExtractor = params.editorLineRangeExtractor;
        this._editorTextExtractor = params.editorTextExtractor;
        this._textRegistry = params.textRegistry;
    }

    execute(editor) {
        try {
            this._saveSelectionAsText(TextKey.REGISTER1, editor);
        } catch (e) {
            this._handleError(e);
        }
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

module.exports = SaveText1Command;
