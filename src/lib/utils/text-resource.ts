import {URLSearchParams} from 'url';
import * as vscode from 'vscode';
import {EXTENSION_SCHEME} from '../const';

export const makeUriString = (textKey: string, fileName: string, timestamp: Date): string =>
    `${EXTENSION_SCHEME}:text/${fileName}?key=${textKey}&_ts=${timestamp.getTime()}`; // `_ts` to avoid cache

export const extractTextKey = (uri: vscode.Uri): string =>
    new URLSearchParams(uri.query).get('key')!;
