
const App = require('../../lib/app');

suite('App', () => {

    suite('#saveSelectionAsText1', () => {

        test('it saves selected text', () => {
            const textRegistry = {set: sinon.spy()};
            const app = new App({textRegistry});
            app.saveSelectionAsText1(fakeEditor('SELECTED_TEXT'));
            expect(textRegistry.set).to.have.been.calledWith('1', 'SELECTED_TEXT');
        });

        test('it prints callstack if error occurred', () => {
            const logger = {error: sinon.spy()};
            const app = new App({logger});
            app.saveSelectionAsText1(fakeEditor());
            expect(logger.error).to.have.been.called;
        });

        test('it prints callstack if saving to a file failed', () => {
            const logger = {error: sinon.spy()};
            const textRegistry = {set: sinon.stub().throws(new Error('WRITE_ERROR'))};
            const app = new App({logger, textRegistry});
            app.saveSelectionAsText1(fakeEditor());
            expect(logger.error.args[0][0].slice(0, 18)).to.eql('Error: WRITE_ERROR');
        });
    });

    suite('#saveSelectionAsText2AndTakeDiff', () => {

        test('it saves selected text and takes a diff of 2 texts', () => {
            const textRegistry = {set: () => {}};
            const textResourceUtil = {getUri: textKey => `__${textKey}__`};
            const diffPresenter = {takeDiff: sinon.spy()};
            const app = new App({diffPresenter, textRegistry, textResourceUtil, logger: console});

            app.saveSelectionAsText1(fakeEditor('TEXT1'));
            return app.saveSelectionAsText2AndTakeDiff(fakeEditor('TEXT2')).then(() => {
                expect(diffPresenter.takeDiff).to.have.been.calledWith('__1__', '__2__');
            });
        });

        test('it prints callstack if error occurred', () => {
            const logger = {error: sinon.spy()};
            const app = new App({logger});
            return app.saveSelectionAsText2AndTakeDiff(fakeEditor()).then(() => {
                expect(logger.error).to.have.been.called;
            });
        });
    });

    function fakeEditor(selectedText) {
        return {
            selection: {text: selectedText},
            document: {getText: selection => selection.text}
        };
    }
});
