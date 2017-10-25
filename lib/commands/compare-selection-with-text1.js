
const TextKey = require('../const').TextKey;

class CompareSelectionWithText1Command {

    constructor(params) {
        this._logger = params.logger;
        this._diffPresenter = params.diffPresenter;
        this._selectionInfoBuilder = params.selectionInfoBuilder;
        this._selectionInfoRegistry = params.selectionInfoRegistry;
    }

    async execute(editor) {
        try {
            const textInfo = this._selectionInfoBuilder.extract(editor);
            this._selectionInfoRegistry.set(TextKey.REGISTER2, textInfo);

            await this._diffPresenter.takeDiff(TextKey.REGISTER1, TextKey.REGISTER2);
        } catch (e) {
            this._handleError(e);
        }
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = CompareSelectionWithText1Command;
