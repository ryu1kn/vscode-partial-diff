import {EXTENSION_ID} from '../const';
import * as vscode from 'vscode';
import ContentProvider from '../content-provider';

export default class WorkspaceAdaptor {
    constructor(private readonly workspace: typeof vscode.workspace) {}

    get<T>(configName: string): T {
        const extensionConfig = this.workspace.getConfiguration(EXTENSION_ID);
        return extensionConfig.get(configName) as T;
    }

    registerTextDocumentContentProvider(EXTENSION_SCHEME: string, contentProvider: ContentProvider): vscode.Disposable {
        return this.workspace.registerTextDocumentContentProvider(EXTENSION_SCHEME, contentProvider);
    }

    registerFileSystemProvider(scheme: string,
                               provider: vscode.FileSystemProvider,
                               options?: {isCaseSensitive?: boolean; isReadonly?: boolean}): vscode.Disposable {
        return this.workspace.registerFileSystemProvider(scheme, provider, options);
    }

    openTextDocument(uri: vscode.Uri): Thenable<vscode.TextDocument> {
        return this.workspace.openTextDocument(uri);
    }

    onDidChangeTextDocument(listener: (event: vscode.TextDocumentChangeEvent) => void): vscode.Disposable {
        return this.workspace.onDidChangeTextDocument(listener);
    }

    onDidCloseTextDocument(listener: (document: vscode.TextDocument) => void): vscode.Disposable {
        return this.workspace.onDidCloseTextDocument(listener);
    }

    applyEdit(edit: vscode.WorkspaceEdit): Thenable<boolean> {
        return this.workspace.applyEdit(edit);
    }

    writeFile(uri: vscode.Uri, content: Uint8Array): Thenable<void> {
        return this.workspace.fs.writeFile(uri, content);
    }

    deleteFile(uri: vscode.Uri): Thenable<void> {
        return this.workspace.fs.delete(uri);
    }
}
