
const SelectText1Command = require('../../../lib/commands/save-text-1');

suite('SelectText1Command', () => {

    test('it saves selected text', () => {
        const selectionInfoBuilder = {
            extract: stubWithArgs(['EDITOR'], {
                text: 'SELECTED_TEXT',
                fileName: 'FILENAME',
                lineRange: 'SELECTED_RANGE'
            })
        };
        const textRegistry = {set: sinon.spy()};
        const command = new SelectText1Command({selectionInfoBuilder, textRegistry});
        command.execute('EDITOR');
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
        command.execute('EDITOR');
        expect(logger.error).to.have.been.called;
    });

    test('it prints callstack if saving text failed', () => {
        const logger = {error: sinon.spy()};
        const selectionInfoBuilder = {
            extract: stubWithArgs(['EDITOR'], {
                text: 'SELECTED_TEXT',
                fileName: 'FILENAME',
                lineRange: 'SELECTED_RANGE'
            })
        };
        const textRegistry = {set: sinon.stub().throws(new Error('UNEXPECTED_ERROR'))};
        const command = new SelectText1Command({logger, selectionInfoBuilder, textRegistry});
        command.execute('EDITOR');
        expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
    });
});
