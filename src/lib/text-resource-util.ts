import * as vscode from 'vscode';
import {EXTENSION_SCHEME} from './const';

export const makeUriString = (textKey: string, timestamp: Date) =>
    `${EXTENSION_SCHEME}:text/${textKey}?_ts=${timestamp.getTime()}`; // `_ts` to avoid cache

export default class TextResourceUtil {

    getTextKey(uri: vscode.Uri): string {
        const match = uri.path.match(/^text\/([a-z\d]+)/)!;
        return match[1];
    }
}
