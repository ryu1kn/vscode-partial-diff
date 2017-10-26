
const SelectionInfoRegistry = require('../../lib/selection-info-registry');

suite('SelectionInfoRegistry', () => {

    test('it saves a given text selection information with a given key', () => {
        const selectionInfoRegistry = new SelectionInfoRegistry();
        selectionInfoRegistry.set('KEY', {
            text: 'TEXT',
            fileName: 'FILE_NAME',
            lineRanges: 'LINE_RANGES',
            '..': '..'
        });
        expect(selectionInfoRegistry.get('KEY')).to.eql({
            text: 'TEXT',
            fileName: 'FILE_NAME',
            lineRanges: 'LINE_RANGES'
        });
    });

});
