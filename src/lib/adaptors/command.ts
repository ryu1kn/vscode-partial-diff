import * as vscode from 'vscode';
import CommandWrapper from '../command-wrapper';
import {Command} from '../commands/command';
import {Logger} from '../types/logger';

type UriParser = (uri: string) => vscode.Uri;

export type CommandType = 'TEXT_EDITOR' | 'GENERAL';

export interface CommandItem {
    name: string;
    type: CommandType;
    command: Command;
}

export interface EditableDiffOptions {
    originalEditable?: boolean;
    preferredGroup?: 'up' | 'down' | 'left' | 'right';
}

export default class CommandAdaptor {
    constructor(private readonly commands: typeof vscode.commands,
                private readonly parseUri: UriParser,
                private readonly logger: Logger) {}

    async executeCommand(name: string, uri1: string, uri2: string, title: string): Promise<{} | undefined> {
        return this.commands.executeCommand(name, this.parseUri(uri1), this.parseUri(uri2), title);
    }

    async executeDiffUris(uri1: vscode.Uri,
                          uri2: vscode.Uri,
                          title: string,
                          options?: EditableDiffOptions): Promise<{} | undefined> {
        const originalEditable = options && options.originalEditable !== undefined ? options.originalEditable : true;
        const preferredGroup = options && options.preferredGroup ? options.preferredGroup : 'up';
        const diffEditorOptions = {
            originalEditable,
            renderSideBySide: true,
            useInlineViewWhenSpaceIsLimited: false
        };
        // Use internal workbench command to pass diff-editor options for editable sessions.
        try {
            return await this.commands.executeCommand(
                '_workbench.diff',
                uri1,
                uri2,
                title,
                [preferredGroup, diffEditorOptions]
            );
        } catch (error) {
            // Fallback for hosts that don't accept directional preferred-group hints.
            return this.commands.executeCommand(
                '_workbench.diff',
                uri1,
                uri2,
                title,
                [undefined, diffEditorOptions]
            );
        }
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
