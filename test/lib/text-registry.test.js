
const TextRegistry = require('../../lib/text-registry');

suite('TextRegistry', () => {

    test('it can store text with index', () => {
        const textRegistry = new TextRegistry();
        const index = 0;
        textRegistry.register(index, 'TEXT_1');
        expect(textRegistry.read(index)).to.eql('TEXT_1');
    });

});