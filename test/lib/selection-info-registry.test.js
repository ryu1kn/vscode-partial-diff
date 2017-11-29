
const SelectionInfoRegistry = require('../../lib/selection-info-registry');

suite('SelectionInfoRegistry', () => {

    test('it saves selected text with a given key', () => {
        const selectionInfoRegistry = new SelectionInfoRegistry();
        selectionInfoRegistry.set('KEY', {text: 'TEXT'});
        expect(selectionInfoRegistry.get('KEY').text).to.include('TEXT');
    });

    test('it saves the file name of the selected text with a given key', () => {
        const selectionInfoRegistry = new SelectionInfoRegistry();
        selectionInfoRegistry.set('KEY', {fileName: 'FILE_NAME'});
        expect(selectionInfoRegistry.get('KEY').fileName).to.eql('FILE_NAME');
    });

    test('it saves the line ranges of the selected text with a given key', () => {
        const selectionInfoRegistry = new SelectionInfoRegistry();
        selectionInfoRegistry.set('KEY', {lineRanges: 'LINE_RANGES'});
        expect(selectionInfoRegistry.get('KEY').lineRanges).to.eql('LINE_RANGES');
    });

    test('it ignores other attributes given in text info', () => {
        const selectionInfoRegistry = new SelectionInfoRegistry();
        selectionInfoRegistry.set('KEY', {SOMETHING: '..'});
        expect(selectionInfoRegistry.get('KEY').SOMETHING).to.be.undefined;
    });

    test('it sets an empty list for line ranges if they are not given', () => {
        const selectionInfoRegistry = new SelectionInfoRegistry();
        selectionInfoRegistry.set('KEY', {});
        expect(selectionInfoRegistry.get('KEY').lineRanges).to.eql([]);
    });

});
