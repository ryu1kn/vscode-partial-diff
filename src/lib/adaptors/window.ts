import * as vscode from 'vscode';
import TextEditor from './text-editor';
import {QuickPickItem, TextEditor as VsTextEditor} from 'vscode';

export default class WindowAdaptor {
    constructor(private readonly window: typeof vscode.window) {}

    get visibleTextEditors(): TextEditor[] {
        return this.window.visibleTextEditors.map((editor: VsTextEditor) => new TextEditor(editor));
    }
    get activeTextEditor(): any {
        return this.window.activeTextEditor;
    } 

    async showQuickPick<T extends QuickPickItem>(items: T[], canPickMany: boolean = true): Promise<T[] | undefined> {
        // @ts-ignore
        return this.window.showQuickPick(items, {canPickMany});
    }

    async showInformationMessage(message: string): Promise<string | undefined> {
        return this.window.showInformationMessage(message);
    }
}
