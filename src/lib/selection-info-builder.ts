import {basename} from 'path';
import {LineRange, SelectionInfo} from './entities/selection-info';
import {Selection, TextEditor} from 'vscode';

export default class SelectionInfoBuilder {
    extract(editor: TextEditor): SelectionInfo {
        const validSelections = this.collectNonEmptySelections(editor.selections);
        const extractText = (selection?: Selection) => editor.document.getText(selection);

        return {
            text: this.extractText(validSelections, extractText),
            fileName: basename(editor.document.fileName),
            lineRanges: this.extractLineRanges(validSelections)
        };
    }

    private collectNonEmptySelections(selections: Selection[]): Selection[] {
        return selections.filter(s => !s.isEmpty).sort((s1, s2) => {
            const lineComparison = s1.start.line - s2.start.line;
            return lineComparison !== 0
                ? lineComparison
                : s1.start.character - s2.start.character;
        });
    }

    private extractText(selections: Selection[], extractText: (s?: Selection) => string) {
        return selections.length === 0
            ? extractText()
            : selections.map(extractText).join('\n');
    }

    private extractLineRanges(selections: Selection[]): LineRange[] {
        return selections.map(selection => ({
            start: selection.start.line,
            end: selection.end.line
        }));
    }
}
