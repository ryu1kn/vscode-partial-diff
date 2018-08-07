import {basename} from 'path';

export default class SelectionInfoBuilder {
  extract (editor) {
    const validSelections = this._collectNonEmptySelections(editor.selections);
    const extractText = selection => editor.document.getText(selection);

    return {
      text: this._extractText(validSelections, extractText),
      fileName: basename(editor.document.fileName),
      lineRanges: this._extractLineRanges(validSelections)
    };
  }

  private _collectNonEmptySelections (selections) {
    return selections.filter(s => !s.isEmpty).sort((s1, s2) => {
      const lineComparison = s1.start.line - s2.start.line;
      return lineComparison !== 0
        ? lineComparison
        : s1.start.character - s2.start.character;
    });
  }

  private _extractText (selections, extractText) {
    return selections.length === 0
      ? extractText()
      : selections.map(extractText).join('\n');
  }

  private _extractLineRanges (selections) {
    return selections.map(selection => ({
      start: selection.start.line,
      end: selection.end.line
    }));
  }
}
