
const TextRegistry = require('../../lib/text-registry');

suite('TextRegistry', () => {

    test('it saves a given text with a given key', () => {
        const textRegistry = new TextRegistry();
        textRegistry.set('KEY', 'TEXT');
        expect(textRegistry.get('KEY').text).to.eql('TEXT');
    });

});
