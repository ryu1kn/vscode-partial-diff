
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

const vscode = {
    commands: {
        executeCommand: () => {}
    }
};

suite('App', () => {

    suite('#saveSelectionAsText1', () => {

        test('it saves selected text', () => {
            const editorTextExtractor = {extract: stubWithArgs([editor], 'SELECTED_TEXT')};
            const textRegistry = {set: sinon.spy()};
            const app = new App({editorTextExtractor, textRegistry, vscode, path});
            app.saveSelectionAsText1(editor);
            expect(textRegistry.set).to.have.been.calledWith('1', 'SELECTED_TEXT', 'FILENAME', null);
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
            const app = new App({logger, editorTextExtractor, textRegistry, vscode, path});
            app.saveSelectionAsText1(editor);
            expect(logger.error.args[0][0].slice(0, 18)).to.eql('Error: WRITE_ERROR');
        });
    });

    suite('#saveSelectionAsText2AndTakeDiff', () => {

        test('it saves selected text and takes a diff of 2 texts', () => {
            const editorTextExtractor = {extract: () => {}};
            const textRegistry = {
                get: () => {return {text: '', fileName: 'FILENAME_1'};},
                set: () => {return {text: '', fileName: 'FILENAME_2'};}
            };
            const textResourceUtil = {getUri: textKey => `__${textKey}__`};
            const diffPresenter = {takeDiff: sinon.spy()};
            const app = new App({
                diffPresenter,
                editorTextExtractor,
                textRegistry,
                textResourceUtil,
                vscode,
                path
            });

            return app.saveSelectionAsText2AndTakeDiff(editor).then(() => {
                expect(diffPresenter.takeDiff).to.have.been.calledWith('FILENAME_1 \u2194 FILENAME_2',
                    '__1__', '__2__');
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
