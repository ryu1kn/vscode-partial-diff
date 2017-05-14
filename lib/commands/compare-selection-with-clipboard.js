
const TextKey = require('../const').TextKey;

class CompareSelectionWithClipboardCommand {

    constructor(params) {
        this._diffPresenter = params.diffPresenter;
        this._selectionInfoBuilder = params.selectionInfoBuilder;
        this._textRegistry = params.textRegistry;
        this._clipboard = params.clipboard;
        this._logger = params.logger;
    }

    execute(editor) {
        return Promise.resolve()
            .then(() => this._clipboard.read())
            .then(text => {
                this._textRegistry.set(TextKey.CLIPBOARD, {text, fileName: 'Clipboard'});

                const textInfo = this._selectionInfoBuilder.extract(editor);
                this._textRegistry.set(TextKey.REGISTER2, textInfo);
                return this._diffPresenter.takeDiff(TextKey.CLIPBOARD, TextKey.REGISTER2);
            })
            .catch(this._handleError.bind(this));
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = CompareSelectionWithClipboardCommand;
