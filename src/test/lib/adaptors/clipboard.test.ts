import Clipboard from '../../../lib/adaptors/clipboard';
import * as assert from 'assert';

suite('Clipboard', () => {
    test('it reads text from clipboard', async () => {
        const vsClipboard = {readText: () => Promise.resolve('TEXT'), writeText: () => Promise.resolve()};
        const clipboard = new Clipboard(vsClipboard);
        const text = await clipboard.readText();
        assert.deepEqual(text, 'TEXT');
    });
});
