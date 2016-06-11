
const App = require('../../lib/app');

suite('App', () => {

    suite('#saveSelectionAsText1', () => {

        test('it saves selected text', () => {
            const vscode = fakeVSCode();
            const tempFileWriter = {write: sinon.spy()};
            const app = new App({vscode, tempFileWriter});
            return app.saveSelectionAsText1().then(() => {
                expect(tempFileWriter.write).to.have.been.calledWith('SELECTED_TEXT');
            });
        });

        test('it prints callstack if error occurred', () => {
            const vscode = {};
            const logger = {error: sinon.spy()};
            const app = new App({vscode, logger});
            return app.saveSelectionAsText1().then(() => {
                expect(logger.error.args[0][0].slice(0, 63)).to.eql(
                    "TypeError: Cannot read property 'activeTextEditor' of undefined"
                );
            });
        });

        test('it prints callstack if saving to a file failed', () => {
            const vscode = fakeVSCode();
            const logger = {error: sinon.spy()};
            const tempFileWriter = {write: sinon.stub().returns(Promise.reject(new Error('WRITE_ERROR')))};
            const app = new App({vscode, logger, tempFileWriter});
            return app.saveSelectionAsText1().then(() => {
                expect(logger.error.args[0][0].slice(0, 18)).to.eql('Error: WRITE_ERROR');
            });
        });
    });

    suite('#saveSelectionAsText2AndTakeDiff', () => {

        test('it saves selected text and takes a diff of 2 texts', () => {
            const vscode = fakeVSCode();
            const tempFileWriter = fakeTempFileWriter('FILE_PATH_1', 'FILE_PATH_2');
            const diffPresenter = {takeDiff: sinon.spy()};
            const app = new App({vscode, diffPresenter, tempFileWriter});
            return Promise.resolve()
                .then(app.saveSelectionAsText1.bind(app))
                .then(app.saveSelectionAsText2AndTakeDiff.bind(app))
                .then(() => {
                    expect(diffPresenter.takeDiff).to.have.been.calledWith('FILE_PATH_1', 'FILE_PATH_2');
                });
        });

        test('it does nothing if text1 is not yet selected', () => {
            const vscode = fakeVSCode();
            const tempFileWriter = fakeTempFileWriter(null, 'FILE_PATH_2');
            const diffPresenter = {takeDiff: sinon.spy()};
            const app = new App({vscode, diffPresenter, tempFileWriter});
            return Promise.resolve()
                .then(app.saveSelectionAsText1.bind(app))
                .then(app.saveSelectionAsText2AndTakeDiff.bind(app))
                .then(() => {
                    expect(diffPresenter.takeDiff).to.have.been.not.called;
                });
        });

        test('it prints callstack if error occurred', () => {
            const vscode = {}
            const logger = {error: sinon.spy()};
            const app = new App({vscode, logger});
            return app.saveSelectionAsText2AndTakeDiff().then(() => {
                expect(logger.error.args[0][0].slice(0, 63)).to.eql(
                    "TypeError: Cannot read property 'activeTextEditor' of undefined"
                );
            });
        });
    });

    function fakeVSCode() {
        const window = {
            activeTextEditor: {
                selection: {text: 'SELECTED_TEXT'},
                document: {getText: selection => selection.text}
            }
        };
        return {window};
    }

    function fakeTempFileWriter(filePath1, filePath2) {
        const stub = sinon.stub();
        stub.onCall(0).returns(Promise.resolve(filePath1));
        stub.onCall(1).returns(Promise.resolve(filePath2));
        return {write: stub};
    }
});