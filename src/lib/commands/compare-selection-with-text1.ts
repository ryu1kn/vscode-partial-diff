import DiffPresenter from '../diff-presenter';
import SelectionInfoRegistry from '../selection-info-registry';
import {TextKey} from '../const';
import {SelectionInfo} from '../types/selection-info';
import {Command} from './command';
import TextEditor from '../adaptors/text-editor';       

export default class CompareSelectionWithText1Command implements Command {
    constructor(private readonly diffPresenter: DiffPresenter,
                private readonly selectionInfoRegistry: SelectionInfoRegistry) {}

    async execute(editor: TextEditor) {
        const textInfo: SelectionInfo = {
            text: editor.selectedText,
            fileName: editor.fileName,
            lineRanges: editor.selectedLineRanges,
            sourceUri: editor.uri,
            targetKind: editor.selectedLineRanges.length === 0 ? 'document' : 'selection',
            selectionRange: editor.singleSelectionRange
        };
        this.selectionInfoRegistry.set(TextKey.REGISTER2, textInfo);

        await 'HACK'; // HACK: To avoid TextEditor has been disposed error
        await this.diffPresenter.takeDiff(TextKey.REGISTER1, TextKey.REGISTER2);
    }

}
