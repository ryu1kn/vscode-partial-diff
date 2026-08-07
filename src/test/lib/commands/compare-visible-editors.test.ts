import {mock, mockMethods, mockType, verify} from '../../helpers';
import SelectionInfoRegistry from '../../../lib/selection-info-registry';
import TextEditor from '../../../lib/adaptors/text-editor';
import WindowAdaptor from '../../../lib/adaptors/window';
import CommandFactory from '../../../lib/command-factory';
import CommandAdaptor from '../../../lib/adaptors/command';
import NormalisationRuleStore from '../../../lib/normalisation-rule-store';
import WorkspaceAdaptor from '../../../lib/adaptors/workspace';
import EditableDiffSessionManager from '../../../lib/editable-diff-session-manager';
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('CompareVisibleEditorsCommand', () => {
    const editor1 = mockType<TextEditor>({
        viewColumn: 1,
        selectedText: 'SELECTED_TEXT_1',
        fileName: 'FILE1',
        uri: 'file:///1',
        selectedLineRanges: [{start: 5, end: 10}],
        singleSelectionRange: {startLine: 5, startChar: 0, endLine: 10, endChar: 1}
    });
    const editor2 = mockType<TextEditor>({
        viewColumn: 2,
        selectedText: 'SELECTED_TEXT_2',
        fileName: 'FILE2',
        uri: 'file:///2',
        selectedLineRanges: [{start: 15, end: 20}],
        singleSelectionRange: {startLine: 15, startChar: 0, endLine: 20, endChar: 1}
    });

    test('it compares 2 visible editors', async () => {
        const {command, deps} = createCommand([editor1, editor2]);
        await command.execute();

        assert.deepEqual(deps.selectionInfoRegistry.get('visible1'), {
            text: 'SELECTED_TEXT_1',
            fileName: 'FILE1',
            lineRanges: [{start: 5, end: 10}],
            sourceUri: 'file:///1',
            targetKind: 'selection',
            selectionRange: {startLine: 5, startChar: 0, endLine: 10, endChar: 1}
        });
        assert.deepEqual(deps.selectionInfoRegistry.get('visible2'), {
            text: 'SELECTED_TEXT_2',
            fileName: 'FILE2',
            lineRanges: [{start: 15, end: 20}],
            sourceUri: 'file:///2',
            targetKind: 'selection',
            selectionRange: {startLine: 15, startChar: 0, endLine: 20, endChar: 1}
        });
        verify(deps.commandAdaptor.executeCommand(
            'vscode.diff',
            'partialdiff:text/visible1?_ts=1465990980000',
            'partialdiff:text/visible2?_ts=1465990980000',
            'FILE1 (ll.6-11) ↔ FILE2 (ll.16-21)'
        ));
    });

    test('it keeps the visual order of the editors when presents a diff', async () => {
        const {command, deps} = createCommand([editor2, editor1]);
        await command.execute();

        assert.deepEqual(deps.selectionInfoRegistry.get('visible1'), {
            text: 'SELECTED_TEXT_1',
            fileName: 'FILE1',
            lineRanges: [{start: 5, end: 10}],
            sourceUri: 'file:///1',
            targetKind: 'selection',
            selectionRange: {startLine: 5, startChar: 0, endLine: 10, endChar: 1}
        });
        assert.deepEqual(deps.selectionInfoRegistry.get('visible2'), {
            text: 'SELECTED_TEXT_2',
            fileName: 'FILE2',
            lineRanges: [{start: 15, end: 20}],
            sourceUri: 'file:///2',
            targetKind: 'selection',
            selectionRange: {startLine: 15, startChar: 0, endLine: 20, endChar: 1}
        });
    });

    test('it tells you that it needs 2 visible editors when fewer are open', async () => {
        const {command, deps} = createCommand([editor1]);
        await command.execute();

        verify(deps.windowAdaptor.showInformationMessage(
            'This command requires exactly 2 visible editors, but 1 is/are currently open. Please split your editor to show 2 files (either horizontally or vertically) and try again.'
        ));
    });

    test('it tells you that it needs 2 visible editors when more than 2 are open', async () => {
        const editor3 = mockType<TextEditor>({
            viewColumn: 3,
            selectedText: 'SELECTED_TEXT_3',
            fileName: 'FILE3',
            uri: 'file:///3',
            selectedLineRanges: [{start: 25, end: 30}],
            singleSelectionRange: {startLine: 25, startChar: 0, endLine: 30, endChar: 1}
        });
        const {command, deps} = createCommand([editor1, editor2, editor3]);
        await command.execute();

        verify(deps.windowAdaptor.showInformationMessage(
            'This command requires exactly 2 visible editors, but 3 is/are currently open. Please split your editor to show 2 files (either horizontally or vertically) and try again.'
        ));
    });

    function createCommand(visibleTextEditors: TextEditor[]) {
        const dependencies = {
            windowAdaptor: mockMethods<WindowAdaptor>(['showInformationMessage'], {visibleTextEditors}),
            selectionInfoRegistry: new SelectionInfoRegistry(),
            commandAdaptor: mock(CommandAdaptor)
        };
        const commandFactory = new CommandFactory(
            dependencies.selectionInfoRegistry,
            mock(NormalisationRuleStore),
            mock(WorkspaceAdaptor),
            dependencies.commandAdaptor,
            dependencies.windowAdaptor,
            mock(EditableDiffSessionManager),
            mockType<typeof vscode.env.clipboard>(),
            () => new Date('2016-06-15T11:43:00Z')
        );
        return {
            command: commandFactory.createCompareVisibleEditorsCommand(),
            deps: dependencies
        };
    }
});
