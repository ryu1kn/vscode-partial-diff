
const DiffPresenter = require('../../lib/diff-presenter');

suite('DiffPresenter', () => {

    test('it compares two files', () => {
        const vscode = fakeVSCode();
        const diffPresenter = new DiffPresenter({vscode});
        return diffPresenter.takeDiff('/PATH/TO/FILE1', '/PATH/TO/FILE2').then(() => {
            expect(vscode.commands.executeCommand).to.have.been.calledWith(
                'vscode.diff', 'URI_INSTANCE_1', 'URI_INSTANCE_2', 'partial-diff'
            );
            expect(vscode.Uri.parse.args).to.eql([
                ['file://%2FPATH%2FTO%2FFILE1'],
                ['file://%2FPATH%2FTO%2FFILE2']
            ]);
        });
    });

    function fakeVSCode() {
        const commands = {executeCommand: sinon.stub().returns(Promise.resolve())};
        const Uri = {parse: getReturnStub('URI_INSTANCE_1', 'URI_INSTANCE_2')};
        return {Uri, commands};
    }

    function getReturnStub() {
        const args = Array.prototype.slice.call(arguments);
        return args.reduce(
            (stub, arg, i) => {
                stub.onCall(i).returns(arg);
                return stub;
            },
            sinon.stub()
        );
    }
});