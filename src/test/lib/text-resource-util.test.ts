import TextResourceUtil, {makeUriString} from '../../lib/text-resource-util';
import * as assert from 'assert';

suite('TextResourceUtil', () => {
    const date = new Date('2016-06-15T11:43:00Z');
    const textResourceUtil = new TextResourceUtil();

    suite('#makeUriString', () => {
        test('it converts a given text key into an uri', () => {
            assert.deepEqual(makeUriString('reg1', date), 'partialdiff:text/reg1?_ts=1465990980000');
        });
    });

    suite('#getTextKey', () => {
        test('it extracts a text key information from the given uri', () => {
            const uri = {path: 'text/reg1'};
            assert.deepEqual(textResourceUtil.getTextKey(uri as any), 'reg1');
        });
    });
});
