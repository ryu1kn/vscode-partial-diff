
const TextTitleBuilder = require('../../lib/text-title-builder');

suite('TextTitleBuilder', () => {

    test('it uses both file name and line numbers', () => {
        const textInfo = {
            fileName: 'FILE_NAME',
            lineRange: {start: 0, end: 1}
        };
        const textTitleBuilder = new TextTitleBuilder();
        expect(textTitleBuilder.build(textInfo)).to.eql('FILE_NAME (1-2)');
    });

    test('it uses only file name if line numbers are not available', () => {
        const textInfo = {
            fileName: 'FILE_NAME'
        };
        const textTitleBuilder = new TextTitleBuilder();
        expect(textTitleBuilder.build(textInfo)).to.eql('FILE_NAME');
    });

    test('it uses "N/A" as text tile if text is not yet registered', () => {
        const textInfo = null;
        const textTitleBuilder = new TextTitleBuilder();
        expect(textTitleBuilder.build(textInfo)).to.eql('N/A');
    });

});
