
const SelectText1Command = require('../../../lib/commands/save-text-1');

suite('SelectText1Command', () => {

    const editor = {
        document: {
            fileName: 'FILENAME'
        }
    };

    test('it saves selected text', () => {
        const editorLineRangeExtractor = {extract: stubWithArgs([editor], 'SELECTED_RANGE')};
        const editorTextExtractor = {extract: stubWithArgs([editor], 'SELECTED_TEXT')};
        const textRegistry = {set: sinon.spy()};
        const command = new SelectText1Command({editorLineRangeExtractor, editorTextExtractor, textRegistry});
        command.execute(editor);
        expect(textRegistry.set).to.have.been.calledWith(
            'reg1',
            {
                text: 'SELECTED_TEXT',
                fileName: 'FILENAME',
                lineRange: 'SELECTED_RANGE'
            }
        );
    });

    test('it prints callstack if error occurred', () => {
        const logger = {error: sinon.spy()};
        const command = new SelectText1Command({logger});
        command.execute(editor);
        expect(logger.error).to.have.been.called;
    });

    test('it prints callstack if saving text failed', () => {
        const logger = {error: sinon.spy()};
        const editorLineRangeExtractor = {extract: () => 'SELECTED_RANGE'};
        const editorTextExtractor = {extract: () => 'SELECTED_TEXT'};
        const textRegistry = {set: sinon.stub().throws(new Error('UNEXPECTED_ERROR'))};
        const command = new SelectText1Command({logger, editorLineRangeExtractor, editorTextExtractor, textRegistry});
        command.execute(editor);
        expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
    });
});
