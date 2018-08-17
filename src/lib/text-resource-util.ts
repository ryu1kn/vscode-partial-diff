import * as vscode from 'vscode';

export default class TextResourceUtil {
    private readonly extensionScheme: string;
    private readonly getCurrentDate: () => Date;

    constructor(extensionScheme: string, getCurrentDate: () => Date) {
        this.extensionScheme = extensionScheme;
        this.getCurrentDate = getCurrentDate;
    }

    getUri(textKey: string) {
        const timestamp = this.getCurrentDate().getTime();
        return `${this.extensionScheme}:text/${textKey}?_ts=${timestamp}`; // `_ts` to avoid cache
    }

    getTextKey(uri: vscode.Uri): string {
        const match = uri.path.match(/^text\/([a-z\d]+)/)!;
        return match[1];
    }
}
