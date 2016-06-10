
'use strict';

class App {

    constructor(params) {
        this._vscode = params.vscode;
        this._logger = params.logger;
        this._textRegistry = params.textRegistry;
        this._diffPresenter = params.diffPresenter;
    }

    _compareTexts(text1, text2) {
        return this._diffPresenter.compare(text1, text2);
    }

    handleMarkSection1Command() {
        try {
            const editor = this._vscode.window.activeTextEditor;
            const selectedText = editor.document.getText(editor.selection);
            const index = 0;
            this._textRegistry.register(index, selectedText);
        } catch (e) {
            this._handleError(e);
        }
    }

    handleMarkSection2AndTakeDiffCommand() {
        return Promise.resolve().then(() => {
            const editor = this._vscode.window.activeTextEditor;
            const selectedText = editor.document.getText(editor.selection);
            const textToCompare = this._textRegistry.read(0);
            return this._compareTexts(textToCompare, selectedText);
        }).catch(this._handleError.bind(this));
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }
}

module.exports = App;
