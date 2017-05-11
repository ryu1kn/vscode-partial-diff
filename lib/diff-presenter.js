
// TODO: Extract title building logic

class DiffPresenter {

    constructor(params) {
        this._commands = params.commands;
        this._textRegistry = params.textRegistry;
        this._textResourceUtil = params.textResourceUtil;
    }

    takeDiff() {
        const getUri = textKey => this._textResourceUtil.getUri(textKey);
        const title = this._buildTitle('1', '2');
        return this._commands.executeCommand('vscode.diff', getUri('1'), getUri('2'), title);
    }

    _buildTitle(textKey1, textKey2) {
        const text1 = this._textRegistry.get(textKey1);
        const text2 = this._textRegistry.get(textKey2);
        return `${this._getTitlePart(text1)} \u2194 ${this._getTitlePart(text2)}`;
    }

    _getTitlePart(item) {
        if (!item) return 'N/A';

        const suffix = item.lineRange ? ` (${item.lineRange.start}-${item.lineRange.end})` : '';
        return `${item.fileName}${suffix}`;
    }

}

module.exports = DiffPresenter;
