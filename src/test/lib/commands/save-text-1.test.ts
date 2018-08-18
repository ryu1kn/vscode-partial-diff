import SelectText1Command from '../../../lib/commands/save-text-1';
import {mock, mockType, verify, wrapVerify} from '../../helpers';
import SelectionInfoRegistry from '../../../lib/selection-info-registry';
import TextEditor from '../../../lib/adaptors/text-editor';

suite('SelectText1Command', () => {

    const editor = mockType<TextEditor>({
        selectedText: 'SELECTED_TEXT',
        fileName: 'FILENAME',
        selectedLineRanges: 'SELECTED_RANGE'
    });

    test('it saves selected text', () => {
        const selectionInfoRegistry = mock(SelectionInfoRegistry);
        const command = new SelectText1Command(selectionInfoRegistry);

        command.execute(editor);

        wrapVerify((c1, c2) => verify(selectionInfoRegistry.set(c1(), c2())), [
            [
                'reg1',
                {
                    text: 'SELECTED_TEXT',
                    fileName: 'FILENAME',
                    lineRanges: 'SELECTED_RANGE'
                }
            ]
        ]);
    });
});
