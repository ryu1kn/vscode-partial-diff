import * as vscode from 'vscode';
import {EXTENSION_SCHEME} from '../const';

export const makeUriString = (textKey: string): string =>
    `${EXTENSION_SCHEME}:/${textKey}`;

export const makeUri = (textKey: string): vscode.Uri => vscode.Uri.parse(makeUriString(textKey));

export const extractTextKey = (uri: vscode.Uri): string =>
    uri.path.match(/^text\/([a-z\d]+)/)![1];
