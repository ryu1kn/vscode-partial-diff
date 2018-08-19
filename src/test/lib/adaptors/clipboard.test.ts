import Clipboard from '../../../lib/adaptors/clipboard';
import * as assert from 'assert';

suite('Clipboard', () => {
    test('it reads text from clipboard', async () => {
        const clipboardy = {read: () => Promise.resolve('LINE1\r\r\nLINE2\r\r\n')};
        const clipboard = new Clipboard(clipboardy, 'non-win32');
        const text = await clipboard.read();
        assert.deepEqual(text, 'LINE1\r\r\nLINE2\r\r\n');
    });

    test('it replaces `\\r\\r\\n` to `\\r\\n` on Windows', async () => {
        const clipboardy = {read: () => Promise.resolve('LINE1\r\r\nLINE2\r\r\n')};
        const platform = 'win32';
        const clipboard = new Clipboard(clipboardy, platform);
        const text = await clipboard.read();
        assert.deepEqual(text, 'LINE1\r\nLINE2\r\n');
    });
});
