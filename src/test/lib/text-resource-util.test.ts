import TextResourceUtil from '../../lib/text-resource-util';
import * as assert from 'assert';

suite('TextResourceUtil', () => {
    const extensionScheme = 'EXTENSION_SCHEME';
    const Uri = {parse: (uriString: string) => `__${uriString}__`};
    const getCurrentDateFn = () => new Date('2016-06-15T11:43:00Z');

    const textResourceUtil = new TextResourceUtil(extensionScheme, Uri as any, getCurrentDateFn);

    suite('#getUri', () => {
        test('it converts a given text key into an uri', () => {
            assert.deepEqual(textResourceUtil.getUri('reg1'),
                '__EXTENSION_SCHEME:text/reg1?_ts=1465990980000__'
            );
        });
    });

    suite('#getTextKey', () => {
        test('it extracts a text key information from the given uri', () => {
            const uri = {path: 'text/reg1'};
            assert.deepEqual(textResourceUtil.getTextKey(uri as any), 'reg1');
        });
    });
});
