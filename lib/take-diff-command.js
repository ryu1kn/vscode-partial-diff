
'use strict';

const util = require('util');
const path = require('path');

class TakeDiffCommand {
    constructor(params) {
        this._vscode = params.vscode;
        this._logger = params.logger;
    }

    execute() {
        return Promise.resolve().then(() => {
            const text1 = 'TEXT_1';
            const text2 = 'TEXT_2';
            return this._loadTextIntoDocuments(text1, text2).then(
                uris => this._vscode.commands.executeCommand('vscode.diff', uris[0], uris[1])
            );
        }).catch(e => {
            this._logger.error(e.stack);
        });
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
            .then(editor => {
                return editor.edit(builder => builder.insert(new this._vscode.Position(0, 0), text))
            })
            .then(() => uri);
    }

    _getTempFileUri() {
        const tmpFileNumber = this._tmpFileNumber || 0;
        const filePath = path.join(this._vscode.workspace.rootPath, `tmp-${tmpFileNumber}`);
        this._tmpFileNumber = tmpFileNumber + 1;
        return this._vscode.Uri.parse('untitled:' + encodeURIComponent(filePath));
    }
}

module.exports = TakeDiffCommand;
