
const DIFF_TITLE = 'partial-diff';

class DiffPresenter {

    constructor(params) {
        this._commands = params.commands;
    }

    takeDiff(title, uri1, uri2) {
        return this._commands.executeCommand('vscode.diff', uri1, uri2, title || DIFF_TITLE);
    }

}

module.exports = DiffPresenter;
