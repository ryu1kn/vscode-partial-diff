
'use strict';

const AppFactory = require('./app-factory');

class Bootstrapper {

    constructor(params) {
        this._appFactory = params.appFactory;
        this._vscode = params.vscode;
    }

    initiate(context) {
        const app = this._appFactory.create();
        const commandMap = new Map([
            ['extension.markSection1', app.handleMarkSection1Command.bind(app)],
            ['extension.markSection2AndTakeDiff', app.handleMarkSection2AndTakeDiffCommand.bind(app)]
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
