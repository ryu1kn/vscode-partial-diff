import CompareVisibleEditorsCommand from '../../../lib/commands/compare-visible-editors';
import {mockMethods, mockObject, mockType, verify, when} from '../../helpers';
import {Logger} from '../../../lib/logger';
import DiffPresenter from '../../../lib/diff-presenter';
import SelectionInfoRegistry from '../../../lib/selection-info-registry';
import MessageBar from '../../../lib/message-bar';
import * as vscode from 'vscode';

suite('CompareVisibleEditorsCommand', () => {
    const editor1 = mockType<vscode.TextEditor>({viewColumn: 1});
    const editor2 = mockType<vscode.TextEditor>({viewColumn: 2});

    test('it compares 2 visible editors', async () => {
        const {command, deps} = createCommand([editor1, editor2]);
        await command.execute();

        verify(deps.selectionInfoRegistry.set('visible1', 'TEXT_INFO1'));
        verify(deps.selectionInfoRegistry.set('visible2', 'TEXT_INFO2'));
        verify(deps.diffPresenter.takeDiff('visible1', 'visible2'));
    });

    test('it keeps the visual order of the editors when presents a diff', async () => {
        const {command, deps} = createCommand([editor2, editor1]);
        await command.execute();

        verify(deps.selectionInfoRegistry.set('visible1', 'TEXT_INFO1'));
        verify(deps.selectionInfoRegistry.set('visible2', 'TEXT_INFO2'));
    });

    test('it tells you that it needs 2 visible editors', async () => {
        const {command, deps} = createCommand([editor1]);
        await command.execute();

        verify(
            deps.messageBar.showInfo('Please first open 2 documents to compare.')
        );
    });

    function createCommand(visibleTextEditors: vscode.TextEditor[]) {
        const selectionInfoBuilder = mockObject('extract') as any;
        when(selectionInfoBuilder.extract(editor1)).thenReturn('TEXT_INFO1');
        when(selectionInfoBuilder.extract(editor2)).thenReturn('TEXT_INFO2');

        const dependencies = {
            editorWindow: mockType<typeof vscode.window>({visibleTextEditors}),
            diffPresenter: mockMethods<DiffPresenter>(['takeDiff']),
            messageBar: mockMethods<MessageBar>(['showInfo']),
            selectionInfoBuilder,
            selectionInfoRegistry: mockMethods<SelectionInfoRegistry>(['set'])
        };
        const command = new CompareVisibleEditorsCommand(
            dependencies.diffPresenter,
            dependencies.selectionInfoBuilder,
            dependencies.selectionInfoRegistry,
            dependencies.messageBar,
            dependencies.editorWindow,
            mockType<Logger>()
        );
        return {command, deps: dependencies} as any;
    }
});
