
'use strict';

class App {

    constructor(params) {
        this._logger = params.logger;
        this._diffPresenter = params.diffPresenter;
        this._textRegistry = params.textRegistry;
        this._textResourceUtil = params.textResourceUtil;
    }

    saveSelectionAsText1(editor) {
        try {
            this._saveSelectedText('1', editor);
        } catch (e) {
            this._handleError(e);
        }
    }

    saveSelectionAsText2AndTakeDiff(editor) {
        return Promise.resolve().then(() => {
            this._saveSelectedText('2', editor);
            return this._takeDiff();
        }).catch(this._handleError.bind(this));
    }

    _saveSelectedText(key, editor) {
        const selectedText = editor.document.getText(editor.selection);
        this._textRegistry.set(key, selectedText);
    }

    _takeDiff() {
        const getUri = textKey => this._textResourceUtil.getUri(textKey);
        return this._diffPresenter.takeDiff(getUri('1'), getUri('2'));
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }
}

module.exports = App;
