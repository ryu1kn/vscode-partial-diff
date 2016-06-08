'use strict';

const vscode = require('vscode');
const TakeDiffCommand = require('./lib/take-diff-command');

exports.activate = context => {
    const takeDiffCommand = new TakeDiffCommand({vscode, logger: console});
    const disposable = vscode.commands.registerCommand(
        'extension.takeDiff',
        takeDiffCommand.execute.bind(takeDiffCommand)
    );
    context.subscriptions.push(disposable);
};

exports.deactivate = () => {};
