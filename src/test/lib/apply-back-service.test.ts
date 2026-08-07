import * as assert from 'assert';
import * as vscode from 'vscode';
import {any, mockMethods, verify, when} from '../helpers';
import WorkspaceAdaptor from '../../lib/adaptors/workspace';
import WindowAdaptor from '../../lib/adaptors/window';
import ApplyBackService from '../../lib/apply-back-service';
import {DiffSession} from '../../lib/types/diff-session';

suite('ApplyBackService', () => {
    function wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function makeUri(raw: string): vscode.Uri {
        return {toString: () => raw} as unknown as vscode.Uri;
    }

    function makeTextDoc(uri: vscode.Uri, text: string): vscode.TextDocument {
        const offsetAt = (pos: vscode.Position) => {
            const lines = text.split('\n');
            let offset = 0;
            for (let i = 0; i < pos.line; i++) {
                offset += lines[i].length + 1;
            }
            return offset + pos.character;
        };
        const positionAt = (offset: number) => {
            const lines = text.split('\n');
            let remaining = offset;
            for (let i = 0; i < lines.length; i++) {
                if (remaining <= lines[i].length) {
                    return new vscode.Position(i, remaining);
                }
                remaining -= lines[i].length + 1;
            }
            return new vscode.Position(lines.length - 1, lines[lines.length - 1].length);
        };
        return {
            uri,
            getText: (range?: vscode.Range) =>
                range ? text.slice(offsetAt(range.start), offsetAt(range.end)) : text,
            positionAt,
            offsetAt
        } as unknown as vscode.TextDocument;
    }

    function makeWindowAdaptor(): WindowAdaptor {
        return mockMethods<WindowAdaptor>(['showWarningMessage', 'setSelectionInVisibleEditor']);
    }

    function makeSession(tempUri: vscode.Uri, sourceUri: vscode.Uri, originalText: string): DiffSession {
        return {
            id: '1',
            title: 'title',
            left: {
                textKey: 'left',
                tempUri,
                originalText,
                conflictNotified: false,
                sourceChangeNotified: false,
                selectionInfo: {
                    text: originalText,
                    fileName: 'a.ts',
                    lineRanges: [{start: 0, end: 0}],
                    sourceUri: sourceUri.toString(),
                    targetKind: 'selection',
                    selectionRange: {startLine: 0, startChar: 0, endLine: 0, endChar: 8}
                }
            },
            right: {
                textKey: 'right',
                tempUri: makeUri('untitled:right'),
                originalText: '',
                conflictNotified: false,
                sourceChangeNotified: false,
                selectionInfo: {text: '', fileName: '', lineRanges: [], targetKind: 'clipboard'}
            }
        };
    }

    function makeWorkspaceAdaptor(tempUri: vscode.Uri,
                                  tempDoc: vscode.TextDocument,
                                  sourceDoc: vscode.TextDocument): WorkspaceAdaptor {
        const workspaceAdaptor = mockMethods<WorkspaceAdaptor>(['openTextDocument', 'applyEdit']);
        when(workspaceAdaptor.openTextDocument(any())).thenDo(
            (arg: unknown) =>
                (arg as vscode.Uri).toString() === tempUri.toString() ? tempDoc : sourceDoc
        );
        return workspaceAdaptor;
    }

    test('it applies edited temp text back to a selection target', async () => {
        let sourceTextAtRange = 'ORIGINAL';
        const tempUri = makeUri('untitled:left');
        const sourceUri = makeUri('file:///source');
        const tempDoc = {
            uri: tempUri,
            getText: () => 'UPDATED'
        } as unknown as vscode.TextDocument;
        const sourceDoc = {
            uri: sourceUri,
            getText: () => sourceTextAtRange,
            positionAt: (offset: number) => new vscode.Position(0, offset),
            offsetAt: (pos: vscode.Position) => pos.character
        } as unknown as vscode.TextDocument;
        const workspaceAdaptor = makeWorkspaceAdaptor(tempUri, tempDoc, sourceDoc);
        when(workspaceAdaptor.applyEdit(any())).thenDo(() => {
            sourceTextAtRange = 'UPDATED';
            return true;
        });
        const service = new ApplyBackService(workspaceAdaptor, makeWindowAdaptor(), 1);
        const session = makeSession(tempUri, sourceUri, 'ORIGINAL');

        service.scheduleApply(session, session.left);
        await wait(10);

        assert.equal(session.left.originalText, 'UPDATED');
    });

    test('it updates selectionRange after successful apply', async () => {
        const tempUri = makeUri('untitled:left');
        const sourceUri = makeUri('file:///source');
        const tempDoc = {
            uri: tempUri,
            getText: () => 'LONGER_UPDATED_TEXT'
        } as unknown as vscode.TextDocument;
        const sourceDoc = {
            uri: sourceUri,
            getText: () => 'ORIGINAL',
            positionAt: (offset: number) => new vscode.Position(1, offset - 10),
            offsetAt: (pos: vscode.Position) => pos.line * 10 + pos.character
        } as unknown as vscode.TextDocument;
        const workspaceAdaptor = makeWorkspaceAdaptor(tempUri, tempDoc, sourceDoc);
        when(workspaceAdaptor.applyEdit(any())).thenDo(() => true);
        const windowAdaptor = makeWindowAdaptor();
        const service = new ApplyBackService(workspaceAdaptor, windowAdaptor, 1);
        const session = makeSession(tempUri, sourceUri, 'ORIGINAL');
        session.left.selectionInfo.selectionRange = {startLine: 1, startChar: 0, endLine: 1, endChar: 8};

        service.scheduleApply(session, session.left);
        await wait(10);

        const range = session.left.selectionInfo.selectionRange!;
        assert.equal(range.startLine, 1);
        assert.equal(range.startChar, 0);
        assert.equal(range.endLine, 1);
        assert.equal(range.endChar, 19);
        verify(windowAdaptor.setSelectionInVisibleEditor(sourceUri, {
            startLine: 1,
            startChar: 0,
            endLine: 1,
            endChar: 19
        }));
    });

    test('it blocks apply and warns once when source changed', async () => {
        const tempUri = makeUri('untitled:left');
        const sourceUri = makeUri('file:///source');
        const tempDoc = {uri: tempUri, getText: () => 'UPDATED'} as unknown as vscode.TextDocument;
        const sourceDoc = {
            uri: sourceUri,
            getText: () => 'DIFFERENT',
            positionAt: () => new vscode.Position(0, 0)
        } as unknown as vscode.TextDocument;
        const workspaceAdaptor = makeWorkspaceAdaptor(tempUri, tempDoc, sourceDoc);
        const windowAdaptor = makeWindowAdaptor();
        const service = new ApplyBackService(workspaceAdaptor, windowAdaptor, 1);
        const session = makeSession(tempUri, sourceUri, 'ORIGINAL');

        service.scheduleApply(session, session.left);
        await wait(10);
        service.scheduleApply(session, session.left);
        await wait(10);

        assert.equal(session.left.originalText, 'ORIGINAL');
        verify(windowAdaptor.showWarningMessage('Apply-back blocked: source changed since diff opened.', 'Force Apply'));
        verify(workspaceAdaptor.applyEdit(any()), {times: 0});
    });

    test('it force-applies when user chooses Force Apply', async () => {
        let sourceTextAtRange = 'DIFFERENT';
        const tempUri = makeUri('untitled:left');
        const sourceUri = makeUri('file:///source');
        const tempDoc = {uri: tempUri, getText: () => 'UPDATED'} as unknown as vscode.TextDocument;
        const sourceDoc = {
            uri: sourceUri,
            getText: () => sourceTextAtRange,
            positionAt: (offset: number) => new vscode.Position(0, offset),
            offsetAt: (pos: vscode.Position) => pos.character
        } as unknown as vscode.TextDocument;
        const workspaceAdaptor = makeWorkspaceAdaptor(tempUri, tempDoc, sourceDoc);
        let applyEditCallCount = 0;
        (workspaceAdaptor.applyEdit as unknown as (edit: vscode.WorkspaceEdit) => Promise<boolean>) = async () => {
            applyEditCallCount += 1;
            sourceTextAtRange = 'UPDATED';
            return true;
        };
        const windowAdaptor = makeWindowAdaptor();
        when(windowAdaptor.showWarningMessage(any(), any())).thenDo(() => 'Force Apply');
        const service = new ApplyBackService(workspaceAdaptor, windowAdaptor, 1);
        const session = makeSession(tempUri, sourceUri, 'ORIGINAL');

        service.scheduleApply(session, session.left);
        await wait(10);

        assert.equal(session.left.originalText, 'UPDATED');
        assert.equal(applyEditCallCount, 1);
    });

    test('it skips apply-back for clipboard sides', async () => {
        const tempUri = makeUri('untitled:left');
        const sourceUri = makeUri('file:///source');
        const tempDoc = {uri: tempUri, getText: () => 'UPDATED'} as unknown as vscode.TextDocument;
        const sourceDoc = {
            uri: sourceUri,
            getText: () => 'ORIGINAL'
        } as unknown as vscode.TextDocument;
        const workspaceAdaptor = makeWorkspaceAdaptor(tempUri, tempDoc, sourceDoc);
        const service = new ApplyBackService(workspaceAdaptor, makeWindowAdaptor(), 1);
        const session = makeSession(tempUri, sourceUri, 'ORIGINAL');

        service.scheduleApply(session, session.right);
        await wait(10);

        verify(workspaceAdaptor.openTextDocument(any()), {times: 0});
    });

    test('it catches apply-back errors from debounce callback', async () => {
        const workspaceAdaptor = mockMethods<WorkspaceAdaptor>(['openTextDocument', 'applyEdit']);
        when(workspaceAdaptor.openTextDocument(any())).thenDo(() => {
            throw new Error('open failed');
        });
        const service = new ApplyBackService(workspaceAdaptor, makeWindowAdaptor(), 1);
        const session = makeSession(makeUri('untitled:left'), makeUri('file:///source'), 'ORIGINAL');

        const originalConsoleError = console.error;
        const loggedErrors: unknown[][] = [];
        console.error = (...args: unknown[]) => {
            loggedErrors.push(args);
        };
        try {
            service.scheduleApply(session, session.left);
            await wait(10);
        } finally {
            console.error = originalConsoleError;
        }

        assert.equal(loggedErrors.length, 1);
        assert.equal(loggedErrors[0][0], 'Failed to apply editable diff changes back to source document.');
    });

    test('it skips the write when diff side and source are already in sync', async () => {
        const tempUri = makeUri('untitled:left');
        const sourceUri = makeUri('file:///source');
        const tempDoc = makeTextDoc(tempUri, 'SAME');
        const sourceDoc = makeTextDoc(sourceUri, 'SAME');
        const workspaceAdaptor = makeWorkspaceAdaptor(tempUri, tempDoc, sourceDoc);
        const service = new ApplyBackService(workspaceAdaptor, makeWindowAdaptor(), 1);
        const session = makeSession(tempUri, sourceUri, 'ORIGINAL');

        service.scheduleApply(session, session.left);
        await wait(10);

        assert.equal(session.left.originalText, 'SAME');
        verify(workspaceAdaptor.applyEdit(any()), {times: 0});
    });

    suite('source-to-diff refresh', () => {
        function makeRefreshWorkspaceAdaptor(tempUri: vscode.Uri,
                                             tempDoc: vscode.TextDocument,
                                             sourceDoc: vscode.TextDocument,
                                             written: {uri: vscode.Uri; content: string}[]): WorkspaceAdaptor {
            const workspaceAdaptor = mockMethods<WorkspaceAdaptor>(['openTextDocument', 'applyEdit', 'writeFile']);
            when(workspaceAdaptor.openTextDocument(any())).thenDo(
                (arg: unknown) =>
                    (arg as vscode.Uri).toString() === tempUri.toString() ? tempDoc : sourceDoc
            );
            (workspaceAdaptor.writeFile as unknown as (uri: vscode.Uri, content: Uint8Array) => Promise<void>) =
                async (uri: vscode.Uri, content: Uint8Array) => {
                    written.push({uri, content: Buffer.from(content).toString('utf8')});
                };
            return workspaceAdaptor;
        }

        function makeDocumentSide(tempUri: vscode.Uri,
                                  sourceUri: vscode.Uri,
                                  originalText: string): DiffSession['left'] {
            return {
                textKey: 'left',
                tempUri,
                originalText,
                conflictNotified: false,
                sourceChangeNotified: false,
                selectionInfo: {
                    text: originalText,
                    fileName: 'a.ts',
                    lineRanges: [],
                    sourceUri: sourceUri.toString(),
                    targetKind: 'document'
                }
            };
        }

        test('it refreshes an untouched diff side when the source document changes', async () => {
            const tempUri = makeUri('untitled:left');
            const sourceUri = makeUri('file:///source');
            const written: {uri: vscode.Uri; content: string}[] = [];
            const workspaceAdaptor = makeRefreshWorkspaceAdaptor(
                tempUri, makeTextDoc(tempUri, 'ORIGINAL'), makeTextDoc(sourceUri, 'NEW CONTENT'), written
            );
            const service = new ApplyBackService(workspaceAdaptor, makeWindowAdaptor(), 1);
            const session = makeSession(tempUri, sourceUri, 'ORIGINAL');
            session.left = makeDocumentSide(tempUri, sourceUri, 'ORIGINAL');

            service.scheduleRefresh(session, session.left);
            await wait(10);

            assert.equal(written.length, 1);
            assert.equal(written[0].content, 'NEW CONTENT');
            assert.equal(session.left.originalText, 'NEW CONTENT');
        });

        test('it does not write when the change came from our own apply-back', async () => {
            const tempUri = makeUri('untitled:left');
            const sourceUri = makeUri('file:///source');
            const written: {uri: vscode.Uri; content: string}[] = [];
            const workspaceAdaptor = makeRefreshWorkspaceAdaptor(
                tempUri, makeTextDoc(tempUri, 'SAME'), makeTextDoc(sourceUri, 'SAME'), written
            );
            const service = new ApplyBackService(workspaceAdaptor, makeWindowAdaptor(), 1);
            const session = makeSession(tempUri, sourceUri, 'ORIGINAL');
            session.left = makeDocumentSide(tempUri, sourceUri, 'ORIGINAL');

            service.scheduleRefresh(session, session.left);
            await wait(10);

            assert.equal(written.length, 0);
            assert.equal(session.left.originalText, 'SAME');
        });

        test('it never clobbers user edits in the diff view', async () => {
            const tempUri = makeUri('untitled:left');
            const sourceUri = makeUri('file:///source');
            const written: {uri: vscode.Uri; content: string}[] = [];
            const workspaceAdaptor = makeRefreshWorkspaceAdaptor(
                tempUri, makeTextDoc(tempUri, 'USER_EDIT'), makeTextDoc(sourceUri, 'NEW CONTENT'), written
            );
            const service = new ApplyBackService(workspaceAdaptor, makeWindowAdaptor(), 1);
            const session = makeSession(tempUri, sourceUri, 'ORIGINAL');
            session.left = makeDocumentSide(tempUri, sourceUri, 'ORIGINAL');

            service.scheduleRefresh(session, session.left);
            await wait(10);

            assert.equal(written.length, 0);
            assert.equal(session.left.originalText, 'ORIGINAL');
        });

        test('it re-anchors the selection range when the selected text only moved', async () => {
            const tempUri = makeUri('untitled:left');
            const sourceUri = makeUri('file:///source');
            const written: {uri: vscode.Uri; content: string}[] = [];
            const workspaceAdaptor = makeRefreshWorkspaceAdaptor(
                tempUri,
                makeTextDoc(tempUri, 'ORIGINAL'),
                makeTextDoc(sourceUri, 'AAAA\nBBBB\nORIGINAL\nCCCC'),
                written
            );
            const service = new ApplyBackService(workspaceAdaptor, makeWindowAdaptor(), 1);
            const session = makeSession(tempUri, sourceUri, 'ORIGINAL');

            service.scheduleRefresh(session, session.left);
            await wait(10);

            assert.equal(written.length, 0);
            assert.deepEqual(session.left.selectionInfo.selectionRange, {
                startLine: 2, startChar: 0, endLine: 2, endChar: 8
            });
        });

        test('it warns once when the selected text itself changed externally', async () => {
            const tempUri = makeUri('untitled:left');
            const sourceUri = makeUri('file:///source');
            const written: {uri: vscode.Uri; content: string}[] = [];
            const workspaceAdaptor = makeRefreshWorkspaceAdaptor(
                tempUri,
                makeTextDoc(tempUri, 'ORIGINAL'),
                makeTextDoc(sourceUri, 'CHANGED\nCCCC'),
                written
            );
            const windowAdaptor = makeWindowAdaptor();
            const service = new ApplyBackService(workspaceAdaptor, windowAdaptor, 1);
            const session = makeSession(tempUri, sourceUri, 'ORIGINAL');

            service.scheduleRefresh(session, session.left);
            await wait(10);
            service.scheduleRefresh(session, session.left);
            await wait(10);

            assert.equal(written.length, 0);
            assert.equal(session.left.originalText, 'ORIGINAL');
            verify(windowAdaptor.showWarningMessage(
                'Source text changed since diff opened. Close and re-run the compare to refresh the diff.'
            ));
        });
    });
});
