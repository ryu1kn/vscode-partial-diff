
class DiffPresenter {

    constructor(params) {
        this._commands = params.commands;
        this._textRegistry = params.textRegistry;
        this._textResourceUtil = params.textResourceUtil;
        this._textTitleBuilder = params.textTitleBuilder;
    }

    takeDiff(textKey1, textKey2) {
        const getUri = textKey => this._textResourceUtil.getUri(textKey);
        const title = this._buildTitle(textKey1, textKey2);
        return this._commands.executeCommand('vscode.diff', getUri(textKey1), getUri(textKey2), title);
    }

    _buildTitle(textKey1, textKey2) {
        const title1 = this._buildTextTitle(textKey1);
        const title2 = this._buildTextTitle(textKey2);
        return `${title1} \u2194 ${title2}`;
    }

    _buildTextTitle(textKey) {
        const textInfo = this._textRegistry.get(textKey);
        return this._textTitleBuilder.build(textInfo);
    }

}

module.exports = DiffPresenter;
