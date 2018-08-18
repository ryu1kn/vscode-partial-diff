import {SelectionInfo} from './entities/selection-info';
import {TextEditor as VsTextEditor} from 'vscode';
import TextEditor from './adaptors/text-editor';

export default class SelectionInfoBuilder {
    extract(vseditor: VsTextEditor): SelectionInfo {
        const editor = new TextEditor(vseditor);

        return {
            text: editor.selectedText,
            fileName: editor.fileName,
            lineRanges: editor.selectedLineRanges
        };
    }
}
