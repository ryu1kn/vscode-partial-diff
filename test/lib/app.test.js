
const App = require('../../lib/app');

suite('App', () => {

    suite('#handleMarkSection1Command', () => {

        test('it saves selected text', () => {
            const vscode = fakeVSCode();
            const logger = getLogger();
            const textRegistry = {register: sinon.spy()};
            const app = new App({vscode, logger, textRegistry});
            app.handleMarkSection1Command();
            expect(textRegistry.register.args).to.eql([[0, 'SELECTED_TEXT']]);
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
            const logger = getLogger();
            const textRegistry = {read: sinon.stub().returns('SELECTED_TEXT_0')};
            const diffPresenter = {compare: sinon.spy()};
            const app = new App({vscode, logger, diffPresenter, textRegistry});
            return app.handleMarkSection2AndTakeDiffCommand().then(() => {
                expect(diffPresenter.compare.args).to.eql([['SELECTED_TEXT_0', 'SELECTED_TEXT']]);
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

    function getLogger() {
        return {error: () => {}};
    }
});