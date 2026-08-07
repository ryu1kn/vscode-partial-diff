import * as vscode from 'vscode';
import SelectionInfoRegistry from './selection-info-registry';
import WorkspaceAdaptor from './adaptors/workspace';
import CommandAdaptor from './adaptors/command';
import {DiffSession, DiffSessionSide} from './types/diff-session';
import ApplyBackService from './apply-back-service';
import {EDITABLE_DIFF_SCHEME} from './const';

/**
 * Opens diffs as editable sessions: each side is materialised into a
 * writable in-memory temp file so that the diff editor allows editing,
 * and edits are routed to ApplyBackService which writes them back to
 * the source document. Temp files are cleaned up when the diff closes.
 */
export default class EditableDiffSessionManager {
    private readonly sessionsByTempUri = new Map<string, DiffSession>();
    private readonly listeners: vscode.Disposable[];
    private nextSessionId = 0;

    constructor(private readonly selectionInfoRegistry: SelectionInfoRegistry,
                private readonly workspaceAdaptor: WorkspaceAdaptor,
                private readonly commandAdaptor: CommandAdaptor,
                private readonly applyBackService: ApplyBackService) {
        this.listeners = [
            this.workspaceAdaptor.onDidChangeTextDocument(event => this.onDidChangeTextDocument(event)),
            this.workspaceAdaptor.onDidCloseTextDocument(doc => this.onDidCloseTextDocument(doc))
        ];
    }

    dispose(): void {
        this.listeners.forEach(listener => listener.dispose());
        const sessionsById = new Map<string, DiffSession>();
        this.sessionsByTempUri.forEach(session => sessionsById.set(session.id, session));
        sessionsById.forEach(session => {
            this.applyBackService.cancelSession(session);
            void this.deleteTempFile(session.left.tempUri);
            void this.deleteTempFile(session.right.tempUri);
        });
        this.sessionsByTempUri.clear();
    }

    async openDiff(textKey1: string, textKey2: string, title: string): Promise<void> {
        const leftInfo = this.selectionInfoRegistry.get(textKey1);
        const rightInfo = this.selectionInfoRegistry.get(textKey2);
        const sessionId = String(this.nextSessionId++);
        const [leftTempUri, rightTempUri] = await Promise.all([
            this.createTempFile(sessionId, 'left', leftInfo.text, leftInfo.targetKind === 'clipboard'),
            this.createTempFile(sessionId, 'right', rightInfo.text, rightInfo.targetKind === 'clipboard')
        ]);
        const session: DiffSession = {
            id: sessionId,
            title,
            left: {
                textKey: textKey1,
                selectionInfo: leftInfo,
                originalText: leftInfo.text,
                tempUri: leftTempUri,
                conflictNotified: false,
                sourceChangeNotified: false
            },
            right: {
                textKey: textKey2,
                selectionInfo: rightInfo,
                originalText: rightInfo.text,
                tempUri: rightTempUri,
                conflictNotified: false,
                sourceChangeNotified: false
            }
        };
        this.sessionsByTempUri.set(leftTempUri.toString(), session);
        this.sessionsByTempUri.set(rightTempUri.toString(), session);
        try {
            await this.commandAdaptor.executeDiffUris(leftTempUri, rightTempUri, title, {
                originalEditable: leftInfo.targetKind !== 'clipboard'
            });
        } catch (error) {
            this.sessionsByTempUri.delete(leftTempUri.toString());
            this.sessionsByTempUri.delete(rightTempUri.toString());
            await Promise.all([this.deleteTempFile(leftTempUri), this.deleteTempFile(rightTempUri)]);
            throw error;
        }
    }

    private onDidChangeTextDocument(event: vscode.TextDocumentChangeEvent): void {
        const uriString = event.document.uri.toString();
        const session = this.sessionsByTempUri.get(uriString);
        if (session) {
            const side = this.getSideByUri(session, event.document.uri);
            if (side) {
                this.applyBackService.scheduleApply(session, side);
            }
            return;
        }
        this.routeSourceChange(uriString);
    }

    private routeSourceChange(uriString: string): void {
        const seenSessionIds = new Set<string>();
        this.sessionsByTempUri.forEach(session => {
            if (seenSessionIds.has(session.id)) {
                return;
            }
            seenSessionIds.add(session.id);
            [session.left, session.right]
                .filter(side => side.selectionInfo.sourceUri === uriString)
                .forEach(side => this.applyBackService.scheduleRefresh(session, side));
        });
    }

    private onDidCloseTextDocument(document: vscode.TextDocument): void {
        const session = this.sessionsByTempUri.get(document.uri.toString());
        if (!session) {
            return;
        }
        this.cleanupSession(session);
    }

    private cleanupSession(session: DiffSession): void {
        this.applyBackService.cancelSession(session);
        this.sessionsByTempUri.delete(session.left.tempUri.toString());
        this.sessionsByTempUri.delete(session.right.tempUri.toString());
        void this.deleteTempFile(session.left.tempUri);
        void this.deleteTempFile(session.right.tempUri);
    }

    private getSideByUri(session: DiffSession, uri: vscode.Uri): DiffSessionSide | undefined {
        const key = uri.toString();
        if (session.left.tempUri.toString() === key) {
            return session.left;
        }
        if (session.right.tempUri.toString() === key) {
            return session.right;
        }
        return undefined;
    }

    private async createTempFile(sessionId: string,
                                 side: 'left' | 'right',
                                 text: string,
                                 readOnly: boolean): Promise<vscode.Uri> {
        const readOnlySuffix = readOnly ? '-readonly' : '';
        const fileName = `session-${sessionId}-${side}-${Date.now()}-${Math.floor(Math.random() * 1000000000)}${readOnlySuffix}.txt`;
        const uri = vscode.Uri.parse(`${EDITABLE_DIFF_SCHEME}:/${fileName}`);
        await this.workspaceAdaptor.writeFile(uri, Buffer.from(text, 'utf8'));
        return uri;
    }

    private async deleteTempFile(uri: vscode.Uri): Promise<void> {
        try {
            await this.workspaceAdaptor.deleteFile(uri);
        } catch (error) {
            // Ignore cleanup failures for already-removed files.
        }
    }
}
