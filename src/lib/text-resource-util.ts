import * as vscode from 'vscode';

export default class TextResourceUtil {
    private readonly extensionScheme: string;
    private readonly Uri: typeof vscode.Uri;
    private readonly getCurrentDateFn: () => Date;

    constructor(extensionScheme: string, Uri: typeof vscode.Uri, getCurrentDateFn: () => Date) {
        this.extensionScheme = extensionScheme;
        this.Uri = Uri;
        this.getCurrentDateFn = getCurrentDateFn;
    }

    getUri(textKey) {
        const timestamp = this.getCurrentDateFn().getTime();
        return this.Uri.parse(
            `${this.extensionScheme}:text/${textKey}?_ts=${timestamp}`
        ); // `_ts` for avoid cache
    }

    getTextKey(uri) {
        const match = uri.path.match(/^text\/([a-z\d]+)/);
        return match[1];
    }
}
