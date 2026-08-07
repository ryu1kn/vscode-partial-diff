import * as assert from 'assert';
import * as vscode from 'vscode';
import EditableDiffSessionManager from '../../lib/editable-diff-session-manager';
import SelectionInfoRegistry from '../../lib/selection-info-registry';
import WorkspaceAdaptor from '../../lib/adaptors/workspace';
import CommandAdaptor from '../../lib/adaptors/command';
import ApplyBackService from '../../lib/apply-back-service';
import {EDITABLE_DIFF_SCHEME} from '../../lib/const';
import {any, mockMethods, verify} from '../helpers';

suite('EditableDiffSessionManager', () => {
    function createSelectionInfoRegistry(): SelectionInfoRegistry {
        const selectionInfoRegistry = new SelectionInfoRegistry();
        selectionInfoRegistry.set('left', {text: 'LEFT', fileName: 'a.ts', lineRanges: []});
        selectionInfoRegistry.set('right', {text: 'RIGHT', fileName: 'b.ts', lineRanges: []});
        return selectionInfoRegistry;
    }

    interface Listeners {
        onChange?: (event: vscode.TextDocumentChangeEvent) => void;
        onClose?: (doc: vscode.TextDocument) => void;
    }

    function createWorkspaceAdaptor(writtenUris: vscode.Uri[],
                                    deletedUris: vscode.Uri[],
                                    listeners: Listeners = {}): WorkspaceAdaptor {
        const workspaceAdaptor = mockMethods<WorkspaceAdaptor>([
            'writeFile',
            'deleteFile',
            'openTextDocument',
            'onDidChangeTextDocument',
            'onDidCloseTextDocument'
        ]);
        (workspaceAdaptor.writeFile as unknown as (uri: vscode.Uri, content: Uint8Array) => Promise<void>) =
            async (uri: vscode.Uri) => {
                writtenUris.push(uri);
            };
        (workspaceAdaptor.deleteFile as unknown as (uri: vscode.Uri) => Promise<void>) =
            async (uri: vscode.Uri) => {
                deletedUris.push(uri);
            };
        (workspaceAdaptor.onDidChangeTextDocument as unknown as (listener: (event: vscode.TextDocumentChangeEvent) => void) => vscode.Disposable) =
            (listener: (event: vscode.TextDocumentChangeEvent) => void) => {
                listeners.onChange = listener;
                return {dispose() {}};
            };
        (workspaceAdaptor.onDidCloseTextDocument as unknown as (listener: (doc: vscode.TextDocument) => void) => vscode.Disposable) =
            (listener: (doc: vscode.TextDocument) => void) => {
                listeners.onClose = listener;
                return {dispose() {}};
            };
        return workspaceAdaptor;
    }

    function createCommandAdaptor(onExecute?: (...args: unknown[]) => void): CommandAdaptor {
        const commandAdaptor = mockMethods<CommandAdaptor>(['executeDiffUris']);
        (commandAdaptor.executeDiffUris as unknown as (...args: unknown[]) => Promise<void>) =
            async (...args: unknown[]) => {
                if (onExecute) {
                    onExecute(...args);
                }
            };
        return commandAdaptor;
    }

    test('it creates temp files and starts a diff', async () => {
        const selectionInfoRegistry = createSelectionInfoRegistry();
        const writtenUris: vscode.Uri[] = [];
        const deletedUris: vscode.Uri[] = [];
        const listeners: Listeners = {};
        const workspaceAdaptor = createWorkspaceAdaptor(writtenUris, deletedUris, listeners);
        let diffCallCount = 0;
        const commandAdaptor = createCommandAdaptor(() => {
            diffCallCount += 1;
        });
        const applyBackService = mockMethods<ApplyBackService>(['scheduleApply', 'cancelSession']);
        const manager = new EditableDiffSessionManager(
            selectionInfoRegistry,
            workspaceAdaptor,
            commandAdaptor,
            applyBackService
        );

        await manager.openDiff('left', 'right', 'TITLE');

        assert.equal(writtenUris.length, 2);
        assert.equal(writtenUris[0].scheme, EDITABLE_DIFF_SCHEME);
        assert.equal(writtenUris[1].scheme, EDITABLE_DIFF_SCHEME);
        assert.equal(diffCallCount, 1);
        assert.ok(listeners.onChange);
        assert.ok(listeners.onClose);
        assert.equal(deletedUris.length, 0);
    });

    test('it disables editing on original side when left side is clipboard', async () => {
        const selectionInfoRegistry = new SelectionInfoRegistry();
        selectionInfoRegistry.set('left', {
            text: 'CLIP',
            fileName: 'Clipboard',
            lineRanges: [],
            targetKind: 'clipboard'
        });
        selectionInfoRegistry.set('right', {
            text: 'RIGHT',
            fileName: 'a.ts',
            lineRanges: [{start: 0, end: 0}],
            sourceUri: 'file:///a.ts',
            targetKind: 'selection',
            selectionRange: {startLine: 0, startChar: 0, endLine: 0, endChar: 5}
        });
        const writtenUris: vscode.Uri[] = [];
        const deletedUris: vscode.Uri[] = [];
        const workspaceAdaptor = createWorkspaceAdaptor(writtenUris, deletedUris);

        let capturedOptions: {originalEditable?: boolean} | undefined;
        const commandAdaptor = createCommandAdaptor((_left, _right, _title, options) => {
            capturedOptions = options as {originalEditable?: boolean};
        });
        const applyBackService = mockMethods<ApplyBackService>(['scheduleApply', 'cancelSession']);
        const manager = new EditableDiffSessionManager(
            selectionInfoRegistry,
            workspaceAdaptor,
            commandAdaptor,
            applyBackService
        );

        await manager.openDiff('left', 'right', 'TITLE');

        assert.deepEqual(capturedOptions, {originalEditable: false});
        const uriStrings = writtenUris.map(uri => uri.toString());
        assert.ok(uriStrings.some(uri => uri.includes('-left-') && uri.includes('-readonly.txt')));
        assert.ok(uriStrings.some(uri => uri.includes('-right-') && !uri.includes('-readonly.txt')));
    });

    test('it routes temp document changes to apply-back and cleans up on close', async () => {
        const selectionInfoRegistry = createSelectionInfoRegistry();
        const writtenUris: vscode.Uri[] = [];
        const deletedUris: vscode.Uri[] = [];
        const listeners: Listeners = {};
        const workspaceAdaptor = createWorkspaceAdaptor(writtenUris, deletedUris, listeners);
        const commandAdaptor = createCommandAdaptor();
        const applyBackService = mockMethods<ApplyBackService>(['scheduleApply', 'cancelSession']);
        const manager = new EditableDiffSessionManager(
            selectionInfoRegistry,
            workspaceAdaptor,
            commandAdaptor,
            applyBackService
        );
        await manager.openDiff('left', 'right', 'TITLE');
        const leftDoc = {uri: writtenUris[0]} as vscode.TextDocument;

        listeners.onChange!({document: leftDoc} as vscode.TextDocumentChangeEvent);
        verify(applyBackService.scheduleApply(any(), any()));

        listeners.onClose!(leftDoc);
        verify(applyBackService.cancelSession(any()));
        assert.equal(deletedUris.length, 2);
    });

    test('it routes source document changes to source-to-diff refresh', async () => {
        const selectionInfoRegistry = new SelectionInfoRegistry();
        selectionInfoRegistry.set('left', {
            text: 'LEFT',
            fileName: 'a.ts',
            lineRanges: [],
            sourceUri: 'file:///a.ts',
            targetKind: 'document'
        });
        selectionInfoRegistry.set('right', {
            text: 'RIGHT',
            fileName: 'Clipboard',
            lineRanges: [],
            targetKind: 'clipboard'
        });
        const writtenUris: vscode.Uri[] = [];
        const deletedUris: vscode.Uri[] = [];
        const listeners: Listeners = {};
        const workspaceAdaptor = createWorkspaceAdaptor(writtenUris, deletedUris, listeners);
        const commandAdaptor = createCommandAdaptor();
        const applyBackService = mockMethods<ApplyBackService>(['scheduleApply', 'scheduleRefresh', 'cancelSession']);
        const manager = new EditableDiffSessionManager(
            selectionInfoRegistry,
            workspaceAdaptor,
            commandAdaptor,
            applyBackService
        );
        await manager.openDiff('left', 'right', 'TITLE');

        listeners.onChange!({document: {uri: {toString: () => 'file:///a.ts'}} as vscode.TextDocument} as vscode.TextDocumentChangeEvent);
        verify(applyBackService.scheduleRefresh(any(), any()));
        verify(applyBackService.scheduleApply(any(), any()), {times: 0});

        listeners.onChange!({document: {uri: {toString: () => 'file:///unrelated.ts'}} as vscode.TextDocument} as vscode.TextDocumentChangeEvent);
        verify(applyBackService.scheduleRefresh(any(), any()), {times: 1});
    });

    test('it generates unique session IDs in temp file names across rapid opens', async () => {
        const selectionInfoRegistry = createSelectionInfoRegistry();
        const writtenUris: vscode.Uri[] = [];
        const deletedUris: vscode.Uri[] = [];
        const workspaceAdaptor = createWorkspaceAdaptor(writtenUris, deletedUris);
        const commandAdaptor = createCommandAdaptor();
        const applyBackService = mockMethods<ApplyBackService>(['scheduleApply', 'cancelSession']);
        const manager = new EditableDiffSessionManager(
            selectionInfoRegistry,
            workspaceAdaptor,
            commandAdaptor,
            applyBackService
        );

        await manager.openDiff('left', 'right', 'TITLE1');
        await manager.openDiff('left', 'right', 'TITLE2');

        assert.equal(writtenUris.length, 4);
        const uriStrings = writtenUris.map(uri => uri.toString());
        assert.ok(uriStrings.some(uri => uri.includes('session-0-left')));
        assert.ok(uriStrings.some(uri => uri.includes('session-0-right')));
        assert.ok(uriStrings.some(uri => uri.includes('session-1-left')));
        assert.ok(uriStrings.some(uri => uri.includes('session-1-right')));
    });

    test('it cleans up temp files if diff command fails', async () => {
        const selectionInfoRegistry = createSelectionInfoRegistry();
        const writtenUris: vscode.Uri[] = [];
        const deletedUris: vscode.Uri[] = [];
        const workspaceAdaptor = createWorkspaceAdaptor(writtenUris, deletedUris);
        const commandAdaptor = mockMethods<CommandAdaptor>(['executeDiffUris']);
        (commandAdaptor.executeDiffUris as unknown as () => Promise<void>) =
            async () => {
                throw new Error('diff failed');
            };
        const applyBackService = mockMethods<ApplyBackService>(['scheduleApply', 'cancelSession']);
        const manager = new EditableDiffSessionManager(
            selectionInfoRegistry,
            workspaceAdaptor,
            commandAdaptor,
            applyBackService
        );

        await assert.rejects(
            manager.openDiff('left', 'right', 'TITLE'),
            (err: unknown) => (err as Error).message === 'diff failed'
        );
        assert.equal(writtenUris.length, 2);
        assert.equal(deletedUris.length, 2);
    });
});
