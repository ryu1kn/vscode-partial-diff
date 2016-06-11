
const Bootstrapper = require('../../lib/bootstrapper');

suite('Bootstrapper', () => {

    test('it registers commands', () => {
        const app = {
            saveSelectionAsText1: () => 'saveSelectionAsText1 called',
            saveSelectionAsText2AndTakeDiff: () => 'saveSelectionAsText2AndTakeDiff called'
        };
        const appFactory = {create: sinon.stub().returns(app)};
        const vscode = fakeVSCode();
        const context = {subscriptions: []};
        new Bootstrapper({appFactory, vscode}).initiate(context);

        expect(vscode._invokeCommand('extension.partialDiff.markSection1'))
            .to.eql('saveSelectionAsText1 called');
        expect(vscode._invokeCommand('extension.partialDiff.markSection2AndTakeDiff'))
            .to.eql('saveSelectionAsText2AndTakeDiff called');
    });

    function fakeVSCode() {
        return {
            commands: {
                registerCommand: function (commandId, commandFn) {
                    this[commandId] = commandFn;
                }
            },
            _invokeCommand: function (commandId) {
                return this.commands[commandId]();
            }
        };
    }
});