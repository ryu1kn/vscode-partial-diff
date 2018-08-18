import TextTitleBuilder from '../../lib/text-title-builder';
import * as assert from 'assert';
import {mockType} from '../helpers';
import {SelectionInfo} from '../../lib/entities/selection-info';

suite('TextTitleBuilder', () => {
    const textTitleBuilder = new TextTitleBuilder();

    test('it uses both file name and line numbers', () => {
        const textInfo = mockType<SelectionInfo>({
            fileName: 'FILE_NAME',
            lineRanges: [{start: 0, end: 1}]
        });
        assert.deepEqual(textTitleBuilder.build(textInfo), 'FILE_NAME (ll.1-2)');
    });

    test('it shows only one line number', () => {
        const textInfo = mockType<SelectionInfo>({
            fileName: 'FILE_NAME',
            lineRanges: [{start: 10, end: 10}]
        });
        assert.deepEqual(textTitleBuilder.build(textInfo), 'FILE_NAME (l.11)');
    });

    test('it uses all line ranges to build title', () => {
        const textInfo = mockType<SelectionInfo>({
            fileName: 'FILE_NAME',
            lineRanges: [{start: 0, end: 1}, {start: 5, end: 7}]
        });
        assert.deepEqual(textTitleBuilder.build(textInfo), 'FILE_NAME (ll.1-2,ll.6-8)');
    });

    test('it uses only file name if line numbers are not available', () => {
        const textInfo = mockType<SelectionInfo>({
            fileName: 'FILE_NAME',
            lineRanges: []
        });
        assert.deepEqual(textTitleBuilder.build(textInfo), 'FILE_NAME');
    });

    test('it uses "N/A" as text tile if text is not yet registered', () => {
        const textInfo = null;
        assert.deepEqual(textTitleBuilder.build(textInfo), 'N/A');
    });
});
