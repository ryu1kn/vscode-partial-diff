
const CompareSelectionWithClipboardCommand = require('../../../lib/commands/compare-selection-with-clipboard');

suite('CompareSelectionWithClipboardCommand', () => {

    const editor = {
        document: {
            fileName: 'FILENAME'
        }
    };

    test('it compares selected text with clipboard text', () => {
        const clipboard = {read: () => Promise.resolve('CLIPBOARD_TEXT')};
        const editorLineRangeExtractor = {extract: stubWithArgs([editor], 'SELECTED_RANGE')};
        const editorTextExtractor = {extract: stubWithArgs([editor], 'SELECTED_TEXT')};
        const textRegistry = {set: sinon.spy()};
        const diffPresenter = {takeDiff: sinon.spy()};
        const command = new CompareSelectionWithClipboardCommand({
            clipboard,
            diffPresenter,
            editorLineRangeExtractor,
            editorTextExtractor,
            textRegistry
        });
        return command.execute(editor).then(() => {
            expect(textRegistry.set).to.have.been.calledWith(
                'clipboard',
                {
                    text: 'CLIPBOARD_TEXT',
                    fileName: 'Clipboard'
                }
            );
            expect(textRegistry.set).to.have.been.calledWith(
                'reg2',
                {
                    text: 'SELECTED_TEXT',
                    fileName: 'FILENAME',
                    lineRange: 'SELECTED_RANGE'
                }
            );
            expect(diffPresenter.takeDiff).to.have.been.calledWith('clipboard', 'reg2');
        });
    });

    test('it prints callstack if error occurred', () => {
        const logger = {error: sinon.spy()};
        const command = new CompareSelectionWithClipboardCommand({logger});
        return command.execute(editor).then(() => {
            expect(logger.error).to.have.been.called;
        });
    });

});
