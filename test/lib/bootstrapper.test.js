
const Bootstrapper = require('../../lib/bootstrapper');

suite('Bootstrapper', () => {

    test('it registers commands', () => {
        const app = {
            saveSelectionAsText1: () => 'saveSelectionAsText1 called',
            saveSelectionAsText2AndTakeDiff: () => 'saveSelectionAsText2AndTakeDiff called'
        };
        const commands = fakeVSCodeCommands();
        const extensionScheme = 'EXTENSION_SCHEME';
        const workspace = fakeVSCodeWorkspace();
        const vscode = {commands, workspace};
        const contentProvider = 'CONTENT_PROVIDER';
        const context = {subscriptions: []};
        new Bootstrapper({app, contentProvider, extensionScheme, vscode}).initiate(context);

        expect(commands._invokeCommand('extension.partialDiff.markSection1'))
            .to.eql('saveSelectionAsText1 called');
        expect(commands._invokeCommand('extension.partialDiff.markSection2AndTakeDiff'))
            .to.eql('saveSelectionAsText2AndTakeDiff called');
        expect(workspace.registerTextDocumentContentProvider).to.have.been.calledWith(
            'EXTENSION_SCHEME', 'CONTENT_PROVIDER'
        );
        expect(context.subscriptions).to.eql([
            'DISPOSABLE_scheme',
            'DISPOSABLE_extension.partialDiff.markSection1',
            'DISPOSABLE_extension.partialDiff.markSection2AndTakeDiff'
        ]);
    });

    function fakeVSCodeCommands() {
        return {
            registerTextEditorCommand: function (commandId, commandFn) {
                this[commandId] = commandFn;
                return `DISPOSABLE_${commandId}`;
            },
            _invokeCommand: function (commandId) {
                return this[commandId]();
            }
        };
    }

    function fakeVSCodeWorkspace() {
        return {
            registerTextDocumentContentProvider: sinon.stub().returns('DISPOSABLE_scheme')
        };
    }
});
