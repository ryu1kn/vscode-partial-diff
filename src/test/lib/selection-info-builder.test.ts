import SelectionInfoBuilder from '../../lib/selection-info-builder';
import * as assert from 'assert';

suite('SelectionInfoBuilder', () => {
  test('it extracts text from editor', () => {
    const textInfo = extractTextInfo(['SELECTED_TEXT']);
    assert.equal(textInfo.text, 'SELECTED_TEXT');
  });

  test('it extracts a whole text if no text is currently selected', () => {
    const textInfo = extractTextInfo(['']);
    assert.equal(textInfo.text, 'ENTIRE TEXT');
  });

  test('it extracts texts selected by all cursors and join them with newline character', () => {
    const textInfo = extractTextInfo(['SELECTED_TEXT_1', 'SELECTED_TEXT_2']);
    assert.equal(textInfo.text, 'SELECTED_TEXT_1\nSELECTED_TEXT_2');
  });

  test('it ignores cursor that is not selecting text if others are selecting one', () => {
    const textInfo = extractTextInfo([
      '',
      'SELECTED_TEXT_1',
      '',
      'SELECTED_TEXT_2'
    ]);
    assert.equal(textInfo.text, 'SELECTED_TEXT_1\nSELECTED_TEXT_2');
  });

  test('it extracts the whole text if no cursors are selecting text', () => {
    const textInfo = extractTextInfo(['', '', '']);
    assert.equal(textInfo.text, 'ENTIRE TEXT');
  });

  test('it extracts selected line ranges from editor', () => {
    const textInfo = extractTextInfo(['SELECTED_TEXT']);
    assert.deepEqual(textInfo.lineRanges, [
      {start: 'START_LINE_1', end: 'END_LINE_1'}
    ]);
  });

  test('it returns an empty list if no text is selected', () => {
    const textInfo = extractTextInfo(['']);
    assert.deepEqual(textInfo.lineRanges, []);
  });

  test('it extracts all the line ranges of text selections', () => {
    const textInfo = extractTextInfo(['SELECTED_TEXT_1', 'SELECTED_TEXT_2']);
    assert.deepEqual(textInfo.lineRanges, [
      {start: 'START_LINE_1', end: 'END_LINE_1'},
      {start: 'START_LINE_2', end: 'END_LINE_2'}
    ]);
  });

  test('it skips all cursors that are not selecting any text', () => {
    const textInfo = extractTextInfo(['SELECTED_TEXT_1', '', 'SELECTED_TEXT_3']);
    assert.deepEqual(textInfo.lineRanges, [
      {start: 'START_LINE_1', end: 'END_LINE_1'},
      {start: 'START_LINE_3', end: 'END_LINE_3'}
    ]);
  });

  test('it sorts the selections by ascending order of line number', () => {
    const selections = [
      {start: {line: 5 }, end: { line: 6}, text: 'A'},
      {start: {line: 1 }, end: { line: 2}, text: 'B'}
    ];
    const textInfo = extractTextInfoFromSelections(selections);
    assert.deepEqual(textInfo.text, 'B\nA');
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
    const textInfo = extractTextInfoFromSelections(selections);
    assert.deepEqual(textInfo.text, 'C\nB\nA');
  });

  test('it extracts a file name from editor', () => {
    const textInfo = extractTextInfo(['SELECTED_TEXT']);
    assert.equal(textInfo.fileName, 'FILENAME');
  });

  function extractTextInfo (selectedTexts) {
    const selections = selectedTexts.map((text, i) => ({
      text,
      start: {line: `START_LINE_${i + 1}`},
      end: {line: `END_LINE_${i + 1}`}
    }));
    return extractTextInfoFromSelections(selections);
  }

  function extractTextInfoFromSelections (selections) {
    const selectionInfoBuilder = new SelectionInfoBuilder();
    const selectionWithIsEmptyFlag = selections.map(s =>
      Object.assign({}, s, {isEmpty: !s.text})
    );
    return selectionInfoBuilder.extract(fakeEditor(selectionWithIsEmptyFlag));
  }

  function fakeEditor (selections) {
    return {
      selections,
      selection: selections[0],
      document: {
        fileName: 'FILENAME',
        _entireText: 'ENTIRE TEXT',
        getText (selection) {
          return selection ? selection.text : this._entireText;
        }
      }
    };
  }
});
