
const App = require('./app');
const DiffPresenter = require('./diff-presenter');
const EditorTextExtractor = require('./editor-text-extractor');
const path = require('path');

class AppFactory {

    constructor(params) {
        this._textRegistry = params.textRegistry;
        this._textResourceUtil = params.textResourceUtil;
        this._vscode = params.vscode;
        this._logger = params.logger;
    }

    create() {
        return new App({
            editorTextExtractor: new EditorTextExtractor(),
            textRegistry: this._textRegistry,
            textResourceUtil: this._textResourceUtil,
            diffPresenter: this._createDiffPresenter(),
            logger: this._logger,
            path
        });
    }

    _createDiffPresenter() {
        return new DiffPresenter({commands: this._vscode.commands});
    }

}

module.exports = AppFactory;
