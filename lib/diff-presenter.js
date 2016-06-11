
'use strict';

const util = require('util');
const path = require('path');

const DIFF_TITLE = 'partial-diff';

class DiffPresenter {

    constructor(params) {
        this._vscode = params.vscode;
    }

    takeDiff(filePath1, filePath2) {
        return this._vscode.commands.executeCommand(
            'vscode.diff', this._getUri(filePath1), this._getUri(filePath2), DIFF_TITLE);
    }

    _getUri(filePath) {
        return this._vscode.Uri.parse(`file://${encodeURIComponent(filePath)}`);
    }
}

module.exports = DiffPresenter;
