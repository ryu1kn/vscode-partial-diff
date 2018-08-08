import * as vscode from 'vscode';

type UriParser = (uri: string) => vscode.Uri;

export default class TextResourceUtil {
    private readonly extensionScheme: string;
    private readonly parseUri: UriParser;
    private readonly getCurrentDate: () => Date;

    constructor(extensionScheme: string, parseUri: UriParser, getCurrentDate: () => Date) {
        this.extensionScheme = extensionScheme;
        this.parseUri = parseUri;
        this.getCurrentDate = getCurrentDate;
    }

    getUri(textKey: string) {
        const timestamp = this.getCurrentDate().getTime();
        return this.parseUri(`${this.extensionScheme}:text/${textKey}?_ts=${timestamp}`); // `_ts` to avoid cache
    }

    getTextKey(uri: vscode.Uri): string {
        const match = uri.path.match(/^text\/([a-z\d]+)/)!;
        return match[1];
    }
}
