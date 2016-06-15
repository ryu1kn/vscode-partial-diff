
const DiffPresenter = require('../../lib/diff-presenter');

suite('DiffPresenter', () => {

    test('it compares two files', () => {
        const commands = fakeCommands();
        const diffPresenter = new DiffPresenter({commands});
        return diffPresenter.takeDiff('URI_INSTANCE_1', 'URI_INSTANCE_2').then(() => {
            expect(commands.executeCommand).to.have.been.calledWith(
                'vscode.diff', 'URI_INSTANCE_1', 'URI_INSTANCE_2', 'partial-diff'
            );
        });
    });

    function fakeCommands() {
        return {executeCommand: sinon.stub().returns(Promise.resolve())};
    }
});
