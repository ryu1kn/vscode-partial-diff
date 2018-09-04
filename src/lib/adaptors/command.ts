import * as vscode from 'vscode';

type UriParser = (uri: string) => vscode.Uri;

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
}
