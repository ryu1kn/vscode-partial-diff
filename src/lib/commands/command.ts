import * as vscode from 'vscode';

export interface Command {
    execute(editor?: vscode.TextEditor): Promise<void> | void;
}
