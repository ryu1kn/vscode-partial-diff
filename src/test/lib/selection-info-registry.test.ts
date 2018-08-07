import SelectionInfoRegistry from '../../lib/selection-info-registry';
import * as assert from 'assert';

suite('SelectionInfoRegistry', () => {
    test('it saves selected text with a given key', () => {
        const selectionInfoRegistry = new SelectionInfoRegistry();
        selectionInfoRegistry.set('KEY', {text: 'TEXT'});
        assert.deepEqual(selectionInfoRegistry.get('KEY').text, 'TEXT');
    });

    test('it saves the file name of the selected text with a given key', () => {
        const selectionInfoRegistry = new SelectionInfoRegistry();
        selectionInfoRegistry.set('KEY', {fileName: 'FILE_NAME'});
        assert.deepEqual(selectionInfoRegistry.get('KEY').fileName, 'FILE_NAME');
    });

    test('it saves the line ranges of the selected text with a given key', () => {
        const selectionInfoRegistry = new SelectionInfoRegistry();
        selectionInfoRegistry.set('KEY', {lineRanges: 'LINE_RANGES'});
        assert.deepEqual(selectionInfoRegistry.get('KEY').lineRanges, 'LINE_RANGES');
    });

    test('it ignores other attributes given in text info', () => {
        const selectionInfoRegistry = new SelectionInfoRegistry();
        selectionInfoRegistry.set('KEY', {SOMETHING: '..'});
        assert.equal(selectionInfoRegistry.get('KEY').SOMETHING, undefined);
    });

    test('it sets an empty list for line ranges if they are not given', () => {
        const selectionInfoRegistry = new SelectionInfoRegistry();
        selectionInfoRegistry.set('KEY', {});
        assert.deepEqual(selectionInfoRegistry.get('KEY').lineRanges, []);
    });
});
