import TextResourceUtil from '../../lib/text-resource-util';
import * as assert from 'assert';

suite('TextResourceUtil', () => {
  suite('#getUri', () => {
    test('it converts a given text key into an uri', () => {
      const extensionScheme = 'EXTENSION_SCHEME';
      const Uri = {parse: uriString => `__${uriString}__`};
      const getCurrentDateFn = () => new Date('2016-06-15T11:43:00Z');
      const textResourceUtil = new TextResourceUtil({
        extensionScheme,
        Uri,
        getCurrentDateFn
      });
      assert.deepEqual(textResourceUtil.getUri('reg1'),
        '__EXTENSION_SCHEME:text/reg1?_ts=1465990980000__'
      );
    });
  });

  suite('#getTextKey', () => {
    test('it extracts a text key information from the given uri', () => {
      const uri = {path: 'text/reg1'};
      const textResourceUtil = new TextResourceUtil({});
      assert.deepEqual(textResourceUtil.getTextKey(uri), 'reg1');
    });
  });
});
