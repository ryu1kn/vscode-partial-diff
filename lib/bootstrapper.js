
'use strict';

const AppFactory = require('./app-factory');

const EXTENSION_NAMESPACE = 'extension.partialDiff';

class Bootstrapper {

    constructor(params) {
        this._appFactory = params.appFactory;
        this._vscode = params.vscode;
    }

    initiate(context) {
        const app = this._appFactory.create();
        const commandMap = new Map([
            [`${EXTENSION_NAMESPACE}.markSection1`, app.saveSelectionAsText1.bind(app)],
            [`${EXTENSION_NAMESPACE}.markSection2AndTakeDiff`, app.saveSelectionAsText2AndTakeDiff.bind(app)]
        ]);
        this._registerCommands(commandMap, this._vscode, context);
    }

    _registerCommands(commandMap, vscode, context) {
        commandMap.forEach((command, commandName) => {
            const disposable = vscode.commands.registerCommand(commandName, command);
            context.subscriptions.push(disposable);
        });
    }
}

module.exports = Bootstrapper;
