
const TextRegistry = require('../../lib/text-registry');

suite('TextRegistry', () => {

    test('it saves a given text selection information with a given key', () => {
        const textRegistry = new TextRegistry();
        textRegistry.set('KEY', {
            text: 'TEXT',
            fileName: 'FILE_NAME',
            lineRange: 'LINE_RANGE',
            '..': '..'
        });
        expect(textRegistry.get('KEY')).to.eql({
            text: 'TEXT',
            fileName: 'FILE_NAME',
            lineRange: 'LINE_RANGE'
        });
    });

});
