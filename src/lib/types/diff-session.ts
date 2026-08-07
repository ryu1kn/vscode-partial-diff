import * as vscode from 'vscode';
import {SelectionInfo} from './selection-info';

export interface DiffSessionSide {
    textKey: string;
    selectionInfo: SelectionInfo;
    originalText: string;
    tempUri: vscode.Uri;
    conflictNotified: boolean;
    sourceChangeNotified: boolean;
}

export interface DiffSession {
    id: string;
    title: string;
    left: DiffSessionSide;
    right: DiffSessionSide;
}
