
'use strict';

const util = require('util');
const path = require('path');

class DiffPresenter {

    constructor(params) {
        this._vscode = params.vscode;
    }

    compare(text1, text2) {
        return Promise.resolve().then(() =>
            this._loadTextIntoDocuments(text1, text2).then(
                uris => this._vscode.commands.executeCommand('vscode.diff', uris[0], uris[1])
            )
        );
    }

    _loadTextIntoDocuments(text1, text2) {
        return this._loadTextIntoDocument(text1).then(uri1 =>
            this._loadTextIntoDocument(text2).then(uri2 => [uri1, uri2])
        );
    }

    _loadTextIntoDocument(text) {
        const uri = this._getTempFileUri();
        return this._vscode.workspace.openTextDocument(uri)
            .then(textDocument => this._vscode.window.showTextDocument(textDocument))
            .then(editor =>
                editor.edit(builder => builder.insert(new this._vscode.Position(0, 0), text))
            )
            .then(() => uri);
    }

    _getTempFileUri() {
        const tmpFileNumber = this._tmpFileNumber || 0;
        // FIXME: If folder is not opened, this will throw an error
        const filePath = path.join(this._vscode.workspace.rootPath, `tmp-${tmpFileNumber}`);
        this._tmpFileNumber = tmpFileNumber + 1;
        return this._vscode.Uri.parse('untitled:' + encodeURIComponent(filePath));
    }
}

module.exports = DiffPresenter;
