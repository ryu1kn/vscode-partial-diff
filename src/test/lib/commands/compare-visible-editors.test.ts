import CompareVisibleEditorsCommand from '../../../lib/commands/compare-visible-editors';
import {mockMethods, mockType, verify} from '../../helpers';
import DiffPresenter from '../../../lib/diff-presenter';
import SelectionInfoRegistry from '../../../lib/selection-info-registry';
import MessageBar from '../../../lib/message-bar';
import TextEditor from '../../../lib/adaptors/text-editor';
import WindowComponent from '../../../lib/adaptors/window';

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

        verify(deps.selectionInfoRegistry.set('visible1', {
            text: 'SELECTED_TEXT_1',
            fileName: 'FILE1',
            lineRanges: [{start: 5, end: 10}]
        }));
        verify(deps.selectionInfoRegistry.set('visible2', {
            text: 'SELECTED_TEXT_2',
            fileName: 'FILE2',
            lineRanges: [{start: 15, end: 20}]
        }));
        verify(deps.diffPresenter.takeDiff('visible1', 'visible2'));
    });

    test('it keeps the visual order of the editors when presents a diff', async () => {
        const {command, deps} = createCommand([editor2, editor1]);
        await command.execute();

        verify(deps.selectionInfoRegistry.set('visible1', {
            text: 'SELECTED_TEXT_1',
            fileName: 'FILE1',
            lineRanges: [{start: 5, end: 10}]
        }));
        verify(deps.selectionInfoRegistry.set('visible2', {
            text: 'SELECTED_TEXT_2',
            fileName: 'FILE2',
            lineRanges: [{start: 15, end: 20}]
        }));
    });

    test('it tells you that it needs 2 visible editors', async () => {
        const {command, deps} = createCommand([editor1]);
        await command.execute();

        verify(
            deps.messageBar.showInfo('Please first open 2 documents to compare.')
        );
    });

    function createCommand(visibleTextEditors: TextEditor[]) {
        const dependencies = {
            windowComponent: mockType<WindowComponent>({visibleTextEditors}),
            diffPresenter: mockMethods<DiffPresenter>(['takeDiff']),
            messageBar: mockMethods<MessageBar>(['showInfo']),
            selectionInfoRegistry: mockMethods<SelectionInfoRegistry>(['set'])
        };
        const command = new CompareVisibleEditorsCommand(
            dependencies.diffPresenter,
            dependencies.selectionInfoRegistry,
            dependencies.messageBar,
            dependencies.windowComponent
        );
        return {command, deps: dependencies} as any;
    }
});
