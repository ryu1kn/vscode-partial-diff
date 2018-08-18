import {Command} from './commands/command';
import {Logger} from './logger';
import * as vscode from 'vscode';
import TextEditor from './adaptors/text-editor';

export default class CommandWrapper {
    private readonly command: Command;
    private readonly logger: Logger;

    constructor(command: Command, logger: Logger) {
        this.command = command;
        this.logger = logger;
    }

    async execute(editor?: vscode.TextEditor) {
        try {
            return await this.command.execute(editor && new TextEditor(editor));
        } catch (e) {
            this.handleError(e);
        }
    }

    private handleError(e: Error) {
        this.logger.error(e.stack);
    }
}
