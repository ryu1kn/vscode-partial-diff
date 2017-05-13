
const DiffPresenter = require('../../lib/diff-presenter');

suite('DiffPresenter', () => {

    test('it compares two files', () => {
        const commands = fakeCommands();
        const textRegistry = {
            get: stubWithArgs(
                ['1'], {fileName: 'FILE_NAME_1'},
                ['2'], {fileName: 'FILE_NAME_2'}
            )
        };
        const textResourceUtil = {
            getUri: stubWithArgs(
                ['1'], 'URI_INSTANCE_1',
                ['2'], 'URI_INSTANCE_2'
            )
        };
        const diffPresenter = new DiffPresenter({commands, textRegistry, textResourceUtil});
        return diffPresenter.takeDiff('1', '2').then(() => {
            expect(commands.executeCommand).to.have.been.calledWith(
                'vscode.diff', 'URI_INSTANCE_1', 'URI_INSTANCE_2', 'FILE_NAME_1 \u2194 FILE_NAME_2'
            );
        });
    });

    function fakeCommands() {
        return {executeCommand: sinon.stub().returns(Promise.resolve())};
    }

});
