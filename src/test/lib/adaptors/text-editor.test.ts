import TextEditor from '../../../lib/adaptors/text-editor';
import * as assert from 'assert';
import {mockType} from '../../helpers';
import * as vscode from 'vscode';

suite('TextEditor', () => {

    test('it extracts text from editor', () => {
        const editor = createEditorWithTexts(['SELECTED_TEXT']);
        assert.equal(editor.selectedText, 'SELECTED_TEXT');
    });

    test('it extracts a whole text if no text is currently selected', () => {
        const editor = createEditorWithTexts(['']);
        assert.equal(editor.selectedText, 'ENTIRE TEXT');
    });

    test('it extracts texts selected by all cursors and join them with newline character', () => {
        const editor = createEditorWithTexts(['SELECTED_TEXT_1', 'SELECTED_TEXT_2']);
        assert.equal(editor.selectedText, 'SELECTED_TEXT_1\nSELECTED_TEXT_2');
    });

    test('it ignores cursor that is not selecting text if others are selecting one', () => {
        const editor = createEditorWithTexts([
            '',
            'SELECTED_TEXT_1',
            '',
            'SELECTED_TEXT_2'
        ]);
        assert.equal(editor.selectedText, 'SELECTED_TEXT_1\nSELECTED_TEXT_2');
    });

    test('it extracts the whole text if no cursors are selecting text', () => {
        const editor = createEditorWithTexts(['', '', '']);
        assert.equal(editor.selectedText, 'ENTIRE TEXT');
    });

    test('it extracts selected line ranges from editor', () => {
        const editor = createEditorWithTexts(['SELECTED_TEXT']);
        assert.deepEqual(editor.selectedLineRanges, [
            {start: 'START_LINE_1', end: 'END_LINE_1'}
        ]);
    });

    test('it returns an empty list if no text is selected', () => {
        const editor = createEditorWithTexts(['']);
        assert.deepEqual(editor.selectedLineRanges, []);
    });

    test('it extracts all the line ranges of text selections', () => {
        const editor = createEditorWithTexts(['SELECTED_TEXT_1', 'SELECTED_TEXT_2']);
        assert.deepEqual(editor.selectedLineRanges, [
            {start: 'START_LINE_1', end: 'END_LINE_1'},
            {start: 'START_LINE_2', end: 'END_LINE_2'}
        ]);
    });

    test('it skips all cursors that are not selecting any text', () => {
        const editor = createEditorWithTexts(['SELECTED_TEXT_1', '', 'SELECTED_TEXT_3']);
        assert.deepEqual(editor.selectedLineRanges, [
            {start: 'START_LINE_1', end: 'END_LINE_1'},
            {start: 'START_LINE_3', end: 'END_LINE_3'}
        ]);
    });

    test('it sorts the selections by ascending order of line number', () => {
        const selections = [
            {start: {line: 5}, end: {line: 6}, text: 'A'},
            {start: {line: 1}, end: {line: 2}, text: 'B'}
        ];
        const editor = createEditorWithSelections(selections);
        assert.deepEqual(editor.selectedText, 'B\nA');
    });

    test('it sorts the selections by ascending order of column number if in the same line', () => {
        const selections = [
            {
                start: {line: 5, character: 7},
                end: {line: 5, character: 8},
                text: 'A'
            },
            {
                start: {line: 5, character: 4},
                end: {line: 5, character: 5},
                text: 'B'
            },
            {
                start: {line: 1, character: 1},
                end: {line: 1, character: 2},
                text: 'C'
            }
        ];
        const editor = createEditorWithSelections(selections);
        assert.deepEqual(editor.selectedText, 'C\nB\nA');
    });

    test('it extracts a file name from editor', () => {
        const editor = createEditorWithTexts(['SELECTED_TEXT']);
        assert.equal(editor.fileName, 'FILENAME');
    });

    function createEditorWithTexts(selectedTexts: string[]) {
        const selections = selectedTexts.map((text, i) => ({
            text,
            start: {line: `START_LINE_${i + 1}`},
            end: {line: `END_LINE_${i + 1}`}
        }));
        return createEditorWithSelections(selections);
    }

    function createEditorWithSelections(selections: any[]) {
        const selectionWithIsEmptyFlag = selections.map(s =>
            Object.assign({}, s, {isEmpty: !s.text})
        );
        return new TextEditor(fakeEditor(selectionWithIsEmptyFlag) as any);
    }

    function fakeEditor(selections: any[]) {
        return mockType<vscode.TextEditor>({
            selections,
            selection: selections[0],
            document: {
                fileName: 'FILENAME',
                _entireText: 'ENTIRE TEXT',
                getText(selection: any) {
                    return selection ? selection.text : this._entireText;
                }
            }
        });
    }
});
