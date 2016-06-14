
const Bootstrapper = require('../../lib/bootstrapper');

suite('Bootstrapper', () => {

    test('it registers commands', () => {
        const app = {
            saveSelectionAsText1: () => 'saveSelectionAsText1 called',
            saveSelectionAsText2AndTakeDiff: () => 'saveSelectionAsText2AndTakeDiff called'
        };
        const appFactory = {create: sinon.stub().returns(app)};
        const vscCommands = fakeVSCodeCommands();
        const context = {subscriptions: []};
        new Bootstrapper({appFactory, vscCommands}).initiate(context);

        expect(vscCommands._invokeCommand('extension.partialDiff.markSection1'))
            .to.eql('saveSelectionAsText1 called');
        expect(vscCommands._invokeCommand('extension.partialDiff.markSection2AndTakeDiff'))
            .to.eql('saveSelectionAsText2AndTakeDiff called');
    });

    function fakeVSCodeCommands() {
        return {
            registerTextEditorCommand: function (commandId, commandFn) {
                this[commandId] = commandFn;
            },
            _invokeCommand: function (commandId) {
                return this[commandId]();
            }
        };
    }
});
