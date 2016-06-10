
'use strict';

const App = require('./app');
const DiffPresenter = require('./diff-presenter');
const TempFileWriter = require('./temp-file-writer');

class AppFactory {

    constructor(params) {
        this._vscode = params.vscode;
        this._logger = params.logger;
        this._temp = params.temp;
        this._fs = params.fs;
    }

    create() {
        const logger = this._logger;
        const vscode = this._vscode;
        const diffPresenter = new DiffPresenter({vscode});
        const tempFileWriter = new TempFileWriter({
            fs: this._fs,
            temp: this._temp
        });
        return new App({tempFileWriter, diffPresenter, vscode, logger});
    }
}

module.exports = AppFactory;
