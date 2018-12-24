import * as vscode from 'vscode';
import CommandWrapper from '../command-wrapper';
import {Command} from '../commands/command';
import {Logger} from '../types/logger';

export type CommandType = 'TEXT_EDITOR' | 'GENERAL';

export interface CommandItem {
    name: string;
    type: CommandType;
    command: Command;
}

export default class CommandAdaptor {
    private readonly commands: typeof vscode.commands;
    private readonly logger: Logger;

    constructor(commands: typeof vscode.commands,
                logger: Logger) {
        this.commands = commands;
        this.logger = logger;
    }

    async executeCommand(name: string, uri1: vscode.Uri, uri2: vscode.Uri, title: string): Promise<any> {
        return this.commands.executeCommand(name, uri1, uri2, title);
    }

    registerCommand(cmd: CommandItem): vscode.Disposable {
        const registerer = this.getCommandRegisterer(cmd.type);
        const command = new CommandWrapper(cmd.name, cmd.command, this.logger);
        return registerer(cmd.name, command.execute, command);
    }

    private getCommandRegisterer(commandType: CommandType) {
        return commandType === 'TEXT_EDITOR'
            ? this.commands.registerTextEditorCommand
            : this.commands.registerCommand;
    }
}
