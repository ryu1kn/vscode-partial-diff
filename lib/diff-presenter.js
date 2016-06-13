
'use strict';

const DIFF_TITLE = 'partial-diff';

class DiffPresenter {
    constructor(params) {
        this._commands = params.commands;
        this._uriResolver = params.uriResolver;
    }

    takeDiff(filePath1, filePath2) {
        const uri1 = this._uriResolver.getFileUri(filePath1);
        const uri2 = this._uriResolver.getFileUri(filePath2);
        return this._commands.executeCommand('vscode.diff', uri1, uri2, DIFF_TITLE);
    }
}

module.exports = DiffPresenter;
