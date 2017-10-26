
const SelectText1Command = require('../../../lib/commands/save-text-1');

suite('SelectText1Command', () => {

    test('it saves selected text', () => {
        const selectionInfoBuilder = {
            extract: stubWithArgs(['EDITOR'], {
                text: 'SELECTED_TEXT',
                fileName: 'FILENAME',
                lineRanges: 'SELECTED_RANGE'
            })
        };
        const selectionInfoRegistry = {set: sinon.spy()};
        const command = new SelectText1Command({selectionInfoBuilder, selectionInfoRegistry});
        command.execute('EDITOR');
        expect(selectionInfoRegistry.set).to.have.been.calledWith(
            'reg1',
            {
                text: 'SELECTED_TEXT',
                fileName: 'FILENAME',
                lineRanges: 'SELECTED_RANGE'
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
                lineRanges: 'SELECTED_RANGE'
            })
        };
        const selectionInfoRegistry = {set: sinon.stub().throws(new Error('UNEXPECTED_ERROR'))};
        const command = new SelectText1Command({logger, selectionInfoBuilder, selectionInfoRegistry});
        command.execute('EDITOR');
        expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
    });
});
