
'use strict';

const App = require('./app');
const DiffPresenter = require('./diff-presenter');
const TempFileWriter = require('./temp-file-writer');
const UriResolver = require('./uri-resolver');
const path = require('path');

class AppFactory {

    constructor(params) {
        this._vscode = params.vscode;
        this._logger = params.logger;
        this._temp = params.temp;
        this._fs = params.fs;
    }

    create() {
        return new App({
            tempFileWriter: this._createTempFileWriter(),
            diffPresenter: this._createDiffPresenter(),
            logger: this._logger
        });
    }

    _createDiffPresenter() {
        return new DiffPresenter({
            commands: this._vscode.commands,
            uriResolver: this._createUriResolver()
        });
    }

    _createTempFileWriter() {
        return new TempFileWriter({
            fs: this._fs,
            temp: this._temp
        });
    }

    _createUriResolver() {
        return new UriResolver({
            pathSeparator: path.sep,
            Uri: this._vscode.Uri
        });
    }
}

module.exports = AppFactory;
