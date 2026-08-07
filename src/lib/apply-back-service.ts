import * as vscode from 'vscode';
import WorkspaceAdaptor from './adaptors/workspace';
import WindowAdaptor from './adaptors/window';
import {DiffSession, DiffSessionSide} from './types/diff-session';
import {SelectionRange} from './types/selection-info';

/**
 * Applies edits made in an editable diff session back to the source
 * document the text was taken from. Writes are debounced so that
 * intermediate states while typing do not trigger a write per keystroke.
 */
export default class ApplyBackService {
    private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

    constructor(private readonly workspaceAdaptor: WorkspaceAdaptor,
                private readonly windowAdaptor: WindowAdaptor,
                private readonly debounceMs: number) {}

    scheduleApply(session: DiffSession, side: DiffSessionSide): void {
        this.schedule(this.sessionKey(session, side), () => this.applySide(side),
            'Failed to apply editable diff changes back to source document.');
    }

    scheduleRefresh(session: DiffSession, side: DiffSessionSide): void {
        this.schedule(`${this.sessionKey(session, side)}:refresh`, () => this.refreshSide(side),
            'Failed to refresh editable diff from source document.');
    }

    cancelSession(session: DiffSession): void {
        [session.left, session.right].forEach(side => {
            const baseKey = this.sessionKey(session, side);
            [baseKey, `${baseKey}:refresh`].forEach(key => {
                const timer = this.timers.get(key);
                if (timer) {
                    clearTimeout(timer);
                    this.timers.delete(key);
                }
            });
        });
    }

    private schedule(key: string, task: () => Promise<void>, errorMessage: string): void {
        const existingTimer = this.timers.get(key);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        const timer = setTimeout(() => {
            this.timers.delete(key);
            void task().catch(error => {
                console.error(errorMessage, error);
            });
        }, this.debounceMs);
        this.timers.set(key, timer);
    }

    private sessionKey(session: DiffSession, side: DiffSessionSide): string {
        return `${session.id}:${side.textKey}`;
    }

    private async applySide(side: DiffSessionSide, force = false): Promise<void> {
        const info = side.selectionInfo;
        if (info.targetKind === 'clipboard' || !info.sourceUri) {
            return;
        }

        const tempDoc = await this.workspaceAdaptor.openTextDocument(side.tempUri);
        const nextText = tempDoc.getText();
        const sourceDoc = await this.workspaceAdaptor.openTextDocument(vscode.Uri.parse(info.sourceUri));
        const {range, text: currentTargetText} = this.getTargetRangeAndText(sourceDoc, info);

        if (nextText === currentTargetText) {
            // Already in sync (e.g. this write was triggered by a source-to-diff refresh).
            side.originalText = nextText;
            side.conflictNotified = false;
            return;
        }

        if (!force && currentTargetText !== side.originalText) {
            if (!side.conflictNotified) {
                side.conflictNotified = true;
                const choice = await this.windowAdaptor.showWarningMessage(
                    'Apply-back blocked: source changed since diff opened.',
                    'Force Apply'
                );
                if (choice === 'Force Apply') {
                    return this.applySide(side, true);
                }
            }
            return;
        }

        const edit = new vscode.WorkspaceEdit();
        edit.replace(sourceDoc.uri, range, nextText);
        const applied = await this.workspaceAdaptor.applyEdit(edit);
        if (applied) {
            side.originalText = nextText;
            side.conflictNotified = false;
            const selectionRange = this.updateSelectionRange(side, range, nextText, sourceDoc);
            if (selectionRange) {
                this.windowAdaptor.setSelectionInVisibleEditor(sourceDoc.uri, selectionRange);
            }
        }
    }

    private async refreshSide(side: DiffSessionSide): Promise<void> {
        const info = side.selectionInfo;
        if (info.targetKind === 'clipboard' || !info.sourceUri) {
            return;
        }

        const sourceDoc = await this.workspaceAdaptor.openTextDocument(vscode.Uri.parse(info.sourceUri));
        const tempDoc = await this.workspaceAdaptor.openTextDocument(side.tempUri);
        const tempText = tempDoc.getText();
        const {text: targetText} = this.getTargetRangeAndText(sourceDoc, info);

        if (targetText === side.originalText) {
            return; // Target region unchanged by this source edit.
        }
        if (targetText === tempText) {
            // Already in sync (e.g. triggered by our own apply-back write).
            side.originalText = targetText;
            return;
        }
        if (tempText !== side.originalText) {
            // The user has edits in the diff view; never clobber them.
            // The apply-back conflict prompt covers this case.
            return;
        }

        if (info.targetKind === 'selection') {
            if (this.tryReanchorSelection(sourceDoc, side)) {
                return; // Selected text only moved; range re-anchored, diff content unchanged.
            }
            if (!side.sourceChangeNotified) {
                side.sourceChangeNotified = true;
                await this.windowAdaptor.showWarningMessage(
                    'Source text changed since diff opened. Close and re-run the compare to refresh the diff.'
                );
            }
            return;
        }

        // Whole-document target: safe to push the new source text into the diff view.
        await this.workspaceAdaptor.writeFile(side.tempUri, Buffer.from(targetText, 'utf8'));
        side.originalText = targetText;
        side.conflictNotified = false;
        side.sourceChangeNotified = false;
    }

    private tryReanchorSelection(doc: vscode.TextDocument, side: DiffSessionSide): boolean {
        const info = side.selectionInfo;
        if (!info.selectionRange || side.originalText.length === 0) {
            return false;
        }
        const fullText = doc.getText();
        const firstIndex = fullText.indexOf(side.originalText);
        if (firstIndex === -1 || fullText.indexOf(side.originalText, firstIndex + 1) !== -1) {
            return false; // Not found or ambiguous.
        }
        const start = doc.positionAt(firstIndex);
        const end = doc.positionAt(firstIndex + side.originalText.length);
        info.selectionRange = {
            startLine: start.line,
            startChar: start.character,
            endLine: end.line,
            endChar: end.character
        };
        return true;
    }

    private updateSelectionRange(side: DiffSessionSide,
                                 replacedRange: vscode.Range,
                                 newText: string,
                                 doc: vscode.TextDocument): SelectionRange | undefined {
        if (side.selectionInfo.targetKind !== 'selection' || !side.selectionInfo.selectionRange) {
            return undefined;
        }
        const startOffset = doc.offsetAt(replacedRange.start);
        const newEnd = doc.positionAt(startOffset + newText.length);
        const selectionRange = {
            startLine: replacedRange.start.line,
            startChar: replacedRange.start.character,
            endLine: newEnd.line,
            endChar: newEnd.character
        };
        side.selectionInfo.selectionRange = selectionRange;
        return selectionRange;
    }

    private getTargetRangeAndText(doc: vscode.TextDocument,
                                  info: DiffSessionSide['selectionInfo']): {range: vscode.Range; text: string} {
        if (info.targetKind === 'selection' && info.selectionRange) {
            const range = new vscode.Range(
                new vscode.Position(info.selectionRange.startLine, info.selectionRange.startChar),
                new vscode.Position(info.selectionRange.endLine, info.selectionRange.endChar)
            );
            return {range, text: doc.getText(range)};
        }
        const text = doc.getText();
        const end = doc.positionAt(text.length);
        const range = new vscode.Range(new vscode.Position(0, 0), end);
        return {range, text};
    }
}
