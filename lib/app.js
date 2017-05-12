
const path = require('path');

class App {

    constructor(params) {
        this._logger = params.logger;
        this._diffPresenter = params.diffPresenter;
        this._editorTextExtractor = params.editorTextExtractor;
        this._textRegistry = params.textRegistry;
        this._copyPaste = params.copyPaste;
    }

    diffSelectionWithClipboard(editor) {
        return new Promise((resolve, reject) => {
            this._copyPaste.paste((err, text) => {
                if (err) return reject(err);
                if (!text) return resolve();

                this._textRegistry.set('1', {
                    text,
                    fileName: 'Clipboard',
                    lineRange: null
                });
                resolve();
            });

            // Cancel the promise if it doesn't succeed after a short (1.5s) timeout
            setTimeout(() => reject(new Error('Clipboard timed out')), 1500);
        })
            .then(() => this.saveSelectionAsText2AndTakeDiff(editor))
            .catch(this._handleError.bind(this));
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
