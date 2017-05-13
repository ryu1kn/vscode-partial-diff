
const App = require('./app');
const DiffPresenter = require('./diff-presenter');
const EditorLineRangeExtractor = require('./editor-line-range-extractor');
const EditorTextExtractor = require('./editor-text-extractor');
const copyPaste = require('copy-paste');

class AppFactory {

    constructor(params) {
        this._textRegistry = params.textRegistry;
        this._textResourceUtil = params.textResourceUtil;
        this._vscode = params.vscode;
        this._logger = params.logger;
    }

    create() {
        return new App({
            editorLineRangeExtractor: new EditorLineRangeExtractor(),
            editorTextExtractor: new EditorTextExtractor(),
            textRegistry: this._textRegistry,
            diffPresenter: this._createDiffPresenter(),
            logger: this._logger,
            copyPaste
        });
    }

    _createDiffPresenter() {
        return new DiffPresenter({
            commands: this._vscode.commands,
            textRegistry: this._textRegistry,
            textResourceUtil: this._textResourceUtil
        });
    }

}

module.exports = AppFactory;
