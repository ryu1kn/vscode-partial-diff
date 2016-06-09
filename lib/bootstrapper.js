
'use strict';

const TakeDiffCommand = require('./take-diff-command');

class Bootstrapper {
    constructor(params) {
        this._logger = params.logger;
    }

    initiate(vscode, context) {
        const params = {vscode, logger: this._logger};
        const commands = new Map([
            ['extension.takeDiff', new TakeDiffCommand(params)],
            // ['extension.markSection1', new MarkSection1Command(params)],
            // ['extension.markSection2AndTakeDiff', new MarkSection2AndTakeDiff(params)]
        ]);
        commands.forEach((command, commandName) => {
            const disposable = vscode.commands.registerCommand(
                commandName, command.execute.bind(command)
            );
            context.subscriptions.push(disposable);
        });
    }
}

module.exports = Bootstrapper;
