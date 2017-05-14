
const CompareSelectionWithText1 = require('../../../lib/commands/compare-selection-with-text1');

suite('CompareSelectionWithText1', () => {

    test('it saves selected text and takes a diff of 2 texts', () => {
        const selectionInfoBuilder = {
            extract: stubWithArgs(['EDITOR'], {
                text: 'SELECTED_TEXT',
                fileName: 'FILENAME',
                lineRange: 'SELECTED_RANGE'
            })
        };
        const selectionInfoRegistry = {set: sinon.spy()};
        const diffPresenter = {takeDiff: sinon.spy()};
        const command = new CompareSelectionWithText1({diffPresenter, selectionInfoBuilder, selectionInfoRegistry});
        return command.execute('EDITOR').then(() => {
            expect(selectionInfoRegistry.set).to.have.been.calledWith(
                'reg2',
                {
                    text: 'SELECTED_TEXT',
                    fileName: 'FILENAME',
                    lineRange: 'SELECTED_RANGE'
                }
            );
            expect(diffPresenter.takeDiff).to.have.been.calledWith('reg1', 'reg2');
        });
    });

    test('it prints callstack if error occurred', () => {
        const logger = {error: sinon.spy()};
        const command = new CompareSelectionWithText1({logger});
        return command.execute('EDITOR').then(() => {
            expect(logger.error).to.have.been.called;
        });
    });

});
