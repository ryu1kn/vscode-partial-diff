import * as vscode from 'vscode';

export default class MessageBar {
    private vscWindow: typeof vscode.window;

    constructor(vscWindow: typeof vscode.window) {
        this.vscWindow = vscWindow;
    }

    async showInfo(message: string) {
        await this.vscWindow.showInformationMessage(message);
    }
}
