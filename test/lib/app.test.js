
const App = require('../../lib/app');

suite('App', () => {

    suite('#handleMarkSection1Command', () => {

        test('it saves selected text', () => {
            const vscode = fakeVSCode();
            const tempFileWriter = {write: sinon.spy()};
            const app = new App({vscode, tempFileWriter});
            app.handleMarkSection1Command();
            expect(tempFileWriter.write).to.have.been.calledWith('SELECTED_TEXT');
        });

        test('it prints callstack if error occurred', () => {
            const vscode = {}
            const logger = {error: sinon.spy()};
            const app = new App({vscode, logger});
            app.handleMarkSection1Command();
            expect(logger.error.args[0][0].slice(0, 63)).to.eql(
                "TypeError: Cannot read property 'activeTextEditor' of undefined"
            );
        });
    });

    suite('#handleMarkSection2AndTakeDiffCommand', () => {

        test('it saves selected text', () => {
            const vscode = fakeVSCode();
            const logger = console;
            const tempFileWriter = {write: sinon.stub().returns(Promise.resolve('FILE_PATH'))};
            const diffPresenter = {takeDiff: sinon.spy()};
            const app = new App({vscode, logger, diffPresenter, tempFileWriter});
            return app.handleMarkSection2AndTakeDiffCommand().then(() => {
                expect(diffPresenter.takeDiff).to.have.been.calledWith(null, 'FILE_PATH');
            });
        });

        test('it prints callstack if error occurred', () => {
            const vscode = {}
            const logger = {error: sinon.spy()};
            const app = new App({vscode, logger});
            return app.handleMarkSection2AndTakeDiffCommand().then(() => {
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
});