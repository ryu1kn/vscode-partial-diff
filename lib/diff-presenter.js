
'use strict';

const DIFF_TITLE = 'partial-diff';

class DiffPresenter {
    constructor(params) {
        this._commands = params.commands;
    }

    takeDiff(uri1, uri2) {
        return this._commands.executeCommand('vscode.diff', uri1, uri2, DIFF_TITLE);
    }
}

module.exports = DiffPresenter;
