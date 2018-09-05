import * as vscode from 'vscode';
import CommandWrapper from '../command-wrapper';
import {Command} from '../commands/command';
import {Logger} from '../types/logger';
import {TelemetryReporter} from '../telemetry-reporter';

type UriParser = (uri: string) => vscode.Uri;

export type CommandType = 'TEXT_EDITOR' | 'GENERAL';

export interface CommandItem {
    name: string;
    type: CommandType;
    command: Command;
}

export default class CommandAdaptor {
    private readonly commands: typeof vscode.commands;
    private readonly parseUri: UriParser;
    private readonly telemetryReporter: TelemetryReporter;
    private readonly logger: Logger;

    constructor(commands: typeof vscode.commands,
                parseUri: UriParser,
                telemetryReporter: TelemetryReporter,
                logger: Logger) {
        this.commands = commands;
        this.parseUri = parseUri;
        this.telemetryReporter = telemetryReporter;
        this.logger = logger;
    }

    async executeCommand(name: string, uri1: string, uri2: string, title: string): Promise<{}> {
        return this.commands.executeCommand(name, this.parseUri(uri1), this.parseUri(uri2), title);
    }

    registerCommand(cmd: CommandItem): vscode.Disposable {
        const registerer = this.getCommandRegisterer(cmd.type);
        const command = new CommandWrapper(cmd.name, cmd.command, this.telemetryReporter, this.logger);
        return registerer(cmd.name, command.execute, command);
    }

    private getCommandRegisterer(commandType: CommandType) {
        return commandType === 'TEXT_EDITOR'
            ? this.commands.registerTextEditorCommand
            : this.commands.registerCommand;
    }
}
