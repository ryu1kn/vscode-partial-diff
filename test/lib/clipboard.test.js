
const Clipboard = require('../../lib/clipboard');

suite('Clipboard', () => {

    test('it reads text from clipboard', () => {
        const clipboardy = {read: () => Promise.resolve('LINE1\r\r\nLINE2\r\r\n')};
        const clipboard = new Clipboard({clipboardy});
        return clipboard.read().then(text => {
            expect(text).to.eql('LINE1\r\r\nLINE2\r\r\n');
        });
    });

    test('it replaces `\\r\\r\\n` to `\\r\\n` on Windows', () => {
        const clipboardy = {read: () => Promise.resolve('LINE1\r\r\nLINE2\r\r\n')};
        const platform = 'win32';
        const clipboard = new Clipboard({clipboardy, platform});
        return clipboard.read().then(text => {
            expect(text).to.eql('LINE1\r\nLINE2\r\n');
        });
    });

});
