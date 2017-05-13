
const App = require('../../lib/app');
const path = require('path');

const editor = {
    document: {
        fileName: 'FILENAME'
    },
    selection: {
        isEmpty: true
    }
};

suite('App', () => {

    suite('#saveSelectionAsText1', () => {

        test('it saves selected text', () => {
            const editorTextExtractor = {extract: stubWithArgs([editor], 'SELECTED_TEXT')};
            const textRegistry = {set: sinon.spy()};
            const app = new App({editorTextExtractor, textRegistry, path});
            app.saveSelectionAsText1(editor);
            expect(textRegistry.set).to.have.been.calledWith(
                'reg1',
                {
                    text: 'SELECTED_TEXT',
                    fileName: 'FILENAME',
                    lineRange: null
                }
            );
        });

        test('it prints callstack if error occurred', () => {
            const logger = {error: sinon.spy()};
            const app = new App({logger});
            app.saveSelectionAsText1(editor);
            expect(logger.error).to.have.been.called;
        });

        test('it prints callstack if saving to a file failed', () => {
            const logger = {error: sinon.spy()};
            const editorTextExtractor = {extract: sinon.stub().returns('SELECTED_TEXT')};
            const textRegistry = {set: sinon.stub().throws(new Error('WRITE_ERROR'))};
            const app = new App({logger, editorTextExtractor, textRegistry, path});
            app.saveSelectionAsText1(editor);
            expect(logger.error.args[0][0].slice(0, 18)).to.eql('Error: WRITE_ERROR');
        });
    });

    suite('#saveSelectionAsText2AndTakeDiff', () => {

        test('it saves selected text and takes a diff of 2 texts', () => {
            const editorTextExtractor = {extract: stubWithArgs([editor], 'SELECTED_TEXT')};
            const textRegistry = {set: sinon.spy()};
            const diffPresenter = {takeDiff: sinon.spy()};
            const app = new App({diffPresenter, editorTextExtractor, textRegistry});
            return app.saveSelectionAsText2AndTakeDiff(editor).then(() => {
                expect(textRegistry.set).to.have.been.calledWith(
                    'reg2',
                    {
                        text: 'SELECTED_TEXT',
                        fileName: 'FILENAME',
                        lineRange: null
                    }
                );
                expect(diffPresenter.takeDiff).to.have.been.calledWith();
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
