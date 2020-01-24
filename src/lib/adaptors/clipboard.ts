import * as vscode from 'vscode';

export default class Clipboard {
    constructor(private readonly vsClipboard: typeof vscode.env.clipboard) {}

    async readText(): Promise<string> {
        return this.vsClipboard.readText();
    }
}
