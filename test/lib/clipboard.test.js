
const Clipboard = require('../../lib/clipboard');

suite('Clipboard', () => {

    test('it reads text from clipboard', () => {
        const clipboardy = {read: () => Promise.resolve('CLIPBOARD_TEXT')};
        const clipboard = new Clipboard({clipboardy});
        return clipboard.read().then(text => {
            expect(text).to.eql('CLIPBOARD_TEXT');
        });
    });

});
