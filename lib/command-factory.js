
const SaveText1Command = require('./commands/save-text-1');
const CompareSelectionWithText1Command = require('./commands/compare-selection-with-text1');
const CompareSelectionWithClipboardCommand = require('./commands/compare-selection-with-clipboard');
const DiffPresenter = require('./diff-presenter');
const EditorLineRangeExtractor = require('./editor-line-range-extractor');
const EditorTextExtractor = require('./editor-text-extractor');
const copyPaste = require('copy-paste');

class CommandFactory {

    constructor(params) {
        this._textRegistry = params.textRegistry;
        this._textResourceUtil = params.textResourceUtil;
        this._vscode = params.vscode;
        this._logger = params.logger;

        this._cache = {};
    }

    crateSaveText1Command() {
        return new SaveText1Command({
            editorLineRangeExtractor: new EditorLineRangeExtractor(),
            editorTextExtractor: new EditorTextExtractor(),
            textRegistry: this._textRegistry,
            logger: this._logger
        });
    }

    createCompareSelectionWithText1Command() {
        return new CompareSelectionWithText1Command({
            editorLineRangeExtractor: new EditorLineRangeExtractor(),
            editorTextExtractor: new EditorTextExtractor(),
            textRegistry: this._textRegistry,
            diffPresenter: this._createDiffPresenter(),
            logger: this._logger
        });
    }

    createCompareSelectionWithClipboardCommand() {
        return new CompareSelectionWithClipboardCommand({
            editorLineRangeExtractor: new EditorLineRangeExtractor(),
            editorTextExtractor: new EditorTextExtractor(),
            textRegistry: this._textRegistry,
            diffPresenter: this._createDiffPresenter(),
            logger: this._logger,
            copyPaste
        });
    }

    _getDiffPresenter() {
        const diffPresenter = this._cache.diffPresenter;
        if (diffPresenter) return diffPresenter;

        this._cache.diffPresenter = this._createDiffPresenter();
        return this._cache.diffPresenter;
    }

    _createDiffPresenter() {
        return new DiffPresenter({
            commands: this._vscode.commands,
            textRegistry: this._textRegistry,
            textResourceUtil: this._textResourceUtil
        });
    }

}

module.exports = CommandFactory;
