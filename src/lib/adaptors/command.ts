import * as vscode from 'vscode';
import CommandWrapper from '../command-wrapper';

type UriParser = (uri: string) => vscode.Uri;

export type CommandType = 'TEXT_EDITOR' | 'GENERAL';

export interface CommandItem {
    name: string;
    type: CommandType;
    command: CommandWrapper;
}

export default class CommandAdaptor {
    private readonly commands: typeof vscode.commands;
    private readonly parseUri: UriParser;

    constructor(commands: typeof vscode.commands, parseUri: UriParser) {
        this.commands = commands;
        this.parseUri = parseUri;
    }

    async executeCommand(name: string, uri1: string, uri2: string, title: string): Promise<{}> {
        return this.commands.executeCommand(name, this.parseUri(uri1), this.parseUri(uri2), title);
    }

    registerCommand(cmd: CommandItem): vscode.Disposable {
        const registerer = this.getCommandRegisterer(cmd.type);
        return registerer(cmd.name, cmd.command.execute, cmd.command);
    }

    private getCommandRegisterer(commandType: CommandType) {
        return commandType === 'TEXT_EDITOR'
            ? this.commands.registerTextEditorCommand
            : this.commands.registerCommand;
    }
}
