
const App = require('../../lib/app');

suite('App', () => {

    suite('#saveSelectionAsText1', () => {

        test('it saves selected text', () => {
            const editorTextExtractor = {extract: stubWithArgs(['EDITOR'], 'SELECTED_TEXT')};
            const textRegistry = {set: sinon.spy()};
            const app = new App({editorTextExtractor, textRegistry});
            app.saveSelectionAsText1('EDITOR');
            expect(textRegistry.set).to.have.been.calledWith('1', 'SELECTED_TEXT');
        });

        test('it prints callstack if error occurred', () => {
            const logger = {error: sinon.spy()};
            const app = new App({logger});
            app.saveSelectionAsText1('EDITOR');
            expect(logger.error).to.have.been.called;
        });

        test('it prints callstack if saving to a file failed', () => {
            const logger = {error: sinon.spy()};
            const editorTextExtractor = {extract: sinon.stub().returns('SELECTED_TEXT')};
            const textRegistry = {set: sinon.stub().throws(new Error('WRITE_ERROR'))};
            const app = new App({logger, editorTextExtractor, textRegistry});
            app.saveSelectionAsText1('EDITOR');
            expect(logger.error.args[0][0].slice(0, 18)).to.eql('Error: WRITE_ERROR');
        });
    });

    suite('#saveSelectionAsText2AndTakeDiff', () => {

        test('it saves selected text and takes a diff of 2 texts', () => {
            const editorTextExtractor = {extract: () => {}};
            const textRegistry = {set: () => {}};
            const textResourceUtil = {getUri: textKey => `__${textKey}__`};
            const diffPresenter = {takeDiff: sinon.spy()};
            const app = new App({diffPresenter, editorTextExtractor, textRegistry, textResourceUtil});

            return app.saveSelectionAsText2AndTakeDiff().then(() => {
                expect(diffPresenter.takeDiff).to.have.been.calledWith('__1__', '__2__');
            });
        });

        test('it prints callstack if error occurred', () => {
            const logger = {error: sinon.spy()};
            const app = new App({logger});
            return app.saveSelectionAsText2AndTakeDiff('EDITOR').then(() => {
                expect(logger.error).to.have.been.called;
            });
        });
    });

    function stubWithArgs() {
        'use strict';

        const args = Array.prototype.slice.call(arguments);
        const stub = sinon.stub();
        for (let i = 0; i + 1 < args.length; i += 2) {
            stub.withArgs.apply(stub, args[i]).returns(args[i + 1]);
        }
        return stub;
    }
});
