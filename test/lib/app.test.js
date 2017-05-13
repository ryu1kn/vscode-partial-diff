
const App = require('../../lib/app');

const editor = {
    document: {
        fileName: 'FILENAME'
    }
};

suite('App', () => {

    suite('#saveSelectionAsText1', () => {

        test('it saves selected text', () => {
            const editorLineRangeExtractor = {extract: stubWithArgs([editor], 'SELECTED_RANGE')};
            const editorTextExtractor = {extract: stubWithArgs([editor], 'SELECTED_TEXT')};
            const textRegistry = {set: sinon.spy()};
            const app = new App({editorLineRangeExtractor, editorTextExtractor, textRegistry});
            app.saveSelectionAsText1(editor);
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
            const app = new App({logger});
            app.saveSelectionAsText1(editor);
            expect(logger.error).to.have.been.called;
        });

        test('it prints callstack if saving text failed', () => {
            const logger = {error: sinon.spy()};
            const editorLineRangeExtractor = {extract: () => 'SELECTED_RANGE'};
            const editorTextExtractor = {extract: () => 'SELECTED_TEXT'};
            const textRegistry = {set: sinon.stub().throws(new Error('UNEXPECTED_ERROR'))};
            const app = new App({logger, editorLineRangeExtractor, editorTextExtractor, textRegistry});
            app.saveSelectionAsText1(editor);
            expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
        });
    });

    suite('#saveSelectionAsText2AndTakeDiff', () => {

        test('it saves selected text and takes a diff of 2 texts', () => {
            const editorLineRangeExtractor = {extract: stubWithArgs([editor], 'SELECTED_RANGE')};
            const editorTextExtractor = {extract: stubWithArgs([editor], 'SELECTED_TEXT')};
            const textRegistry = {set: sinon.spy()};
            const diffPresenter = {takeDiff: sinon.spy()};
            const app = new App({diffPresenter, editorLineRangeExtractor, editorTextExtractor, textRegistry});
            return app.saveSelectionAsText2AndTakeDiff(editor).then(() => {
                expect(textRegistry.set).to.have.been.calledWith(
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
            const app = new App({logger});
            return app.saveSelectionAsText2AndTakeDiff(editor).then(() => {
                expect(logger.error).to.have.been.called;
            });
        });
    });

});
