
'use strict';

const App = require('./app');
const DiffPresenter = require('./diff-presenter');
const TextRegistry = require('./text-registry');

class AppFactory {

    constructor(params) {
        this._vscode = params.vscode;
        this._logger = params.logger;
    }

    create() {
        const logger = this._logger;
        const vscode = this._vscode;
        const diffPresenter = new DiffPresenter({vscode});
        const textRegistry = new TextRegistry();
        return new App({diffPresenter, textRegistry, vscode, logger});
    }
}

module.exports = AppFactory;
