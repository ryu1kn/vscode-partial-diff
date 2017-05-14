
const path = require('path');
const TextKey = require('../const').TextKey;

class CompareSelectionWithClipboardCommand {

    constructor(params) {
        this._editorLineRangeExtractor = params.editorLineRangeExtractor;
        this._editorTextExtractor = params.editorTextExtractor;
        this._diffPresenter = params.diffPresenter;
        this._textRegistry = params.textRegistry;
        this._copyPaste = params.copyPaste;
        this._logger = params.logger;
    }

    execute(editor) {
        return this._getClipboardText().then(text => {
            this._textRegistry.set(TextKey.CLIPBOARD, {text, fileName: 'Clipboard'});
            this._saveSelectionAsText(TextKey.REGISTER2, editor);
            return this._diffPresenter.takeDiff(TextKey.CLIPBOARD, TextKey.REGISTER2);
        }).catch(this._handleError.bind(this));
    }

    _getClipboardText() {
        return new Promise((resolve, reject) => {
            this._copyPaste.paste((err, text) => {
                if (err) reject(err);
                else resolve(text);
            });

            // Cancel the promise if it doesn't succeed after a short (1.5s) timeout
            setTimeout(() => reject(new Error('Clipboard timed out')), 1500);
        });
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
