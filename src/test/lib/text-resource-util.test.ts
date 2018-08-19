import {extractTextKey, makeUriString} from '../../lib/utils/text-resource';
import * as assert from 'assert';
import {Uri} from 'vscode';

suite('Text Resource Utilities', () => {
    const date = new Date('2016-06-15T11:43:00Z');

    suite('#makeUriString', () => {
        test('it converts a given text key into an uri', () => {
            assert.deepEqual(makeUriString('reg1', date), 'partialdiff:text/reg1?_ts=1465990980000');
        });
    });

    suite('#extractTextKey', () => {
        test('it extracts a text key information from the given uri', () => {
            const uri = {path: 'text/reg1'};
            assert.deepEqual(extractTextKey(uri as Uri), 'reg1');
        });
    });
});
