import * as vscode from 'vscode';
import TextEditor from './text-editor';

export default class WindowComponent {
    private window: typeof vscode.window;

    constructor(window: typeof vscode.window) {
        this.window = window;
    }

    get visibleTextEditors(): TextEditor[] {
        return this.window.visibleTextEditors.map(editor => new TextEditor(editor));
    }
}
