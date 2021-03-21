import {Selection, TextEditor as VsTextEditor, ViewColumn} from 'vscode';
import {basename} from 'path';
import {LineRange} from '../types/selection-info';

export default class TextEditor {
    constructor(private readonly vsEditor: VsTextEditor) {}

    get fileName(): string {
        return basename(this.vsEditor.document.fileName);
    }

    get fileUri(): string {
        return this.vsEditor.document.fileName;
    }

    get viewColumn(): ViewColumn {
        return this.vsEditor.viewColumn!;
    }

    get getText(): string {
        return this.vsEditor.document.getText();
    } 

    get selectedText(): string {
        const validSelections = this.collectNonEmptySelections(this.vsEditor.selections);
        return this.extractText(validSelections);
    }

    get selectedLineRanges(): LineRange[] {
        const validSelections = this.collectNonEmptySelections(this.vsEditor.selections);
        return this.extractLineRanges(validSelections);
    }

    private collectNonEmptySelections(selections: Selection[]): Selection[] {
        return selections.filter(s => !s.isEmpty).sort((s1, s2) => {
            const lineComparison = s1.start.line - s2.start.line;
            return lineComparison !== 0
                ? lineComparison
                : s1.start.character - s2.start.character;
        });
    }

    private extractText(selections: Selection[]): string {
        return selections.length === 0
            ? this.extractTextFromSelection()
            : selections.map(this.extractTextFromSelection).join('\n');
    }

    private extractTextFromSelection = (selection?: Selection) =>
        this.vsEditor.document.getText(selection)

    private extractLineRanges(selections: Selection[]): LineRange[] {
        return selections.map(selection => ({
            start: selection.start.line,
            end: selection.end.line
        }));
    }
}
