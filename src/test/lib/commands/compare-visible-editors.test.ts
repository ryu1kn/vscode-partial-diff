import {mock, mockMethods, mockType, verify} from '../../helpers';
import SelectionInfoRegistry from '../../../lib/selection-info-registry';
import TextEditor from '../../../lib/adaptors/text-editor';
import WindowAdaptor from '../../../lib/adaptors/window';
import CommandFactory from '../../../lib/command-factory';
import CommandAdaptor from '../../../lib/adaptors/command';
import NormalisationRuleStore from '../../../lib/normalisation-rule-store';
import * as assert from 'assert';
import * as vscode from 'vscode';
import GitAdapter from '../../../lib/adaptors/git';

suite('CompareVisibleEditorsCommand', () => {
    const editor1 = mockType<TextEditor>({
        viewColumn: 1,
        selectedText: 'SELECTED_TEXT_1',
        fileName: 'FILE1',
        selectedLineRanges: [{start: 5, end: 10}]
    });
    const editor2 = mockType<TextEditor>({
        viewColumn: 2,
        selectedText: 'SELECTED_TEXT_2',
        fileName: 'FILE2',
        selectedLineRanges: [{start: 15, end: 20}]
    });

    test('it compares 2 visible editors', async () => {
        const {command, deps} = createCommand([editor1, editor2]);
        await command.execute();

        assert.deepEqual(deps.selectionInfoRegistry.get('visible1'), {
            text: 'SELECTED_TEXT_1',
            fileName: 'FILE1',
            lineRanges: [{start: 5, end: 10}]
        });
        assert.deepEqual(deps.selectionInfoRegistry.get('visible2'), {
            text: 'SELECTED_TEXT_2',
            fileName: 'FILE2',
            lineRanges: [{start: 15, end: 20}]
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
            lineRanges: [{start: 5, end: 10}]
        });
        assert.deepEqual(deps.selectionInfoRegistry.get('visible2'), {
            text: 'SELECTED_TEXT_2',
            fileName: 'FILE2',
            lineRanges: [{start: 15, end: 20}]
        });
    });

    test('it tells you that it needs 2 visible editors', async () => {
        const {command, deps} = createCommand([editor1]);
        await command.execute();

        verify(deps.windowAdaptor.showInformationMessage('Please first open 2 documents to compare.'));
    });

    function createCommand(visibleTextEditors: TextEditor[]) {
        const dependencies = {
            windowAdaptor: mockMethods<WindowAdaptor>(['showInformationMessage'], {visibleTextEditors}),
            selectionInfoRegistry: new SelectionInfoRegistry(),
            commandAdaptor: mock(CommandAdaptor),
            gitAdapter: mock(GitAdapter)
        };
        const commandFactory = new CommandFactory(
            dependencies.selectionInfoRegistry,
            mock(NormalisationRuleStore),
            dependencies.commandAdaptor,
            dependencies.windowAdaptor,
            dependencies.gitAdapter,
            mockType<typeof vscode.env.clipboard>(),
            () => new Date('2016-06-15T11:43:00Z')
        );
        return {
            command: commandFactory.createCompareVisibleEditorsCommand(),
            deps: dependencies
        };
    }
});
