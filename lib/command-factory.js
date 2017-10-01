
const SaveText1Command = require('./commands/save-text-1');
const CompareSelectionWithText1Command = require('./commands/compare-selection-with-text1');
const CompareSelectionWithClipboardCommand = require('./commands/compare-selection-with-clipboard');
const TextTitleBuilder = require('./text-title-builder');
const Clipboard = require('./clipboard');
const DiffPresenter = require('./diff-presenter');
const EditorLineRangeExtractor = require('./editor-line-range-extractor');
const EditorTextExtractor = require('./editor-text-extractor');
const SelectionInfoBuilder = require('./selection-info-builder');
const clipboardy = require('clipboardy');

class CommandFactory {

    constructor(params) {
        this._selectionInfoRegistry = params.selectionInfoRegistry;
        this._textResourceUtil = params.textResourceUtil;
        this._vscode = params.vscode;
        this._logger = params.logger;
    }

    crateSaveText1Command() {
        return new SaveText1Command({
            selectionInfoRegistry: this._selectionInfoRegistry,
            selectionInfoBuilder: this._getSelectionInfoBuilder(),
            logger: this._logger
        });
    }

    createCompareSelectionWithText1Command() {
        return new CompareSelectionWithText1Command({
            selectionInfoRegistry: this._selectionInfoRegistry,
            diffPresenter: this._createDiffPresenter(),
            selectionInfoBuilder: this._getSelectionInfoBuilder(),
            logger: this._logger
        });
    }

    createCompareSelectionWithClipboardCommand() {
        return new CompareSelectionWithClipboardCommand({
            selectionInfoRegistry: this._selectionInfoRegistry,
            diffPresenter: this._createDiffPresenter(),
            selectionInfoBuilder: this._getSelectionInfoBuilder(),
            logger: this._logger,
            clipboard: this._getClipboard()
        });
    }

    _getClipboard() {
        this._clipboard = this._clipboard || this._createClipboard();
        return this._clipboard;
    }

    _getDiffPresenter() {
        this._diffPresenter = this._diffPresenter || this._createDiffPresenter();
        return this._diffPresenter;
    }

    _getSelectionInfoBuilder() {
        this._selectionInfoBuilder = this._selectionInfoBuilder || this._createSelectionInfoBuilder();
        return this._selectionInfoBuilder;
    }

    _createClipboard() {
        return new Clipboard({clipboardy});
    }

    _createDiffPresenter() {
        return new DiffPresenter({
            commands: this._vscode.commands,
            selectionInfoRegistry: this._selectionInfoRegistry,
            textResourceUtil: this._textResourceUtil,
            textTitleBuilder: new TextTitleBuilder()
        });
    }

    _createSelectionInfoBuilder() {
        return new SelectionInfoBuilder({
            editorLineRangeExtractor: new EditorLineRangeExtractor(),
            editorTextExtractor: new EditorTextExtractor()
        });
    }

}

module.exports = CommandFactory;
