import SelectionInfoRegistry from '../selection-info-registry';
import {TextKey} from '../const';
import {Command} from './command';
import TextEditor from '../adaptors/text-editor';

export default class SaveText1Command implements Command {
    constructor(private readonly selectionInfoRegistry: SelectionInfoRegistry) {}

    execute(editor: TextEditor) {
        const textInfo = {
            text: editor.selectedText,
            fileName: editor.fileName,
            lineRanges: editor.selectedLineRanges
        };
        this.selectionInfoRegistry.set(TextKey.REGISTER1, textInfo);
    }

}
