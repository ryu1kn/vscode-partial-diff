
const DiffPresenter = require('../../lib/diff-presenter');

suite('DiffPresenter', () => {

    test('it compares two files', () => {
        const commands = fakeCommands();
        const uriResolver = fakeUriResolver();
        const diffPresenter = new DiffPresenter({uriResolver, commands});
        return diffPresenter.takeDiff('/PATH/TO/FILE1', '/PATH/TO/FILE2').then(() => {
            expect(commands.executeCommand).to.have.been.calledWith(
                'vscode.diff', 'URI_INSTANCE_1', 'URI_INSTANCE_2', 'partial-diff'
            );
            expect(uriResolver.getFileUri.args).to.eql([
                ['/PATH/TO/FILE1'], ['/PATH/TO/FILE2']
            ]);
        });
    });

    function fakeUriResolver() {
        return {getFileUri: getReturnStub('URI_INSTANCE_1', 'URI_INSTANCE_2')};
    }

    function fakeCommands() {
        return {executeCommand: sinon.stub().returns(Promise.resolve())};
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
