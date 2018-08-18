import * as vscode from 'vscode';
import {EXTENSION_SCHEME} from './const';

export default class TextResourceUtil {
    private readonly getCurrentDate: () => Date;

    constructor(getCurrentDate: () => Date) {
        this.getCurrentDate = getCurrentDate;
    }

    getUri(textKey: string) {
        const timestamp = this.getCurrentDate().getTime();
        return `${EXTENSION_SCHEME}:text/${textKey}?_ts=${timestamp}`; // `_ts` to avoid cache
    }

    getTextKey(uri: vscode.Uri): string {
        const match = uri.path.match(/^text\/([a-z\d]+)/)!;
        return match[1];
    }
}
