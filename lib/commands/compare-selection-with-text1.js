
const TextKey = require('../const').TextKey;

class CompareSelectionWithText1Command {

    constructor(params) {
        this._logger = params.logger;
        this._diffPresenter = params.diffPresenter;
        this._selectionInfoBuilder = params.selectionInfoBuilder;
        this._textRegistry = params.textRegistry;
    }

    execute(editor) {
        return Promise.resolve().then(() => {
            const textInfo = this._selectionInfoBuilder.extract(editor);
            this._textRegistry.set(TextKey.REGISTER2, textInfo);
            return this._diffPresenter.takeDiff(TextKey.REGISTER1, TextKey.REGISTER2);
        }).catch(this._handleError.bind(this));
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = CompareSelectionWithText1Command;
