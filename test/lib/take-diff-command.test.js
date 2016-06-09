
const TakdDiffCommand = require('../../lib/take-diff-command');

suite('TakdDiffCommand', () => {

    test('it compares two texts', () => {
        const vscode = fakeVSCode();
        const logger = getLogger();
        const promise = new TakdDiffCommand({vscode, logger}).execute();
        return promise.then(() => {
            expect(vscode.workspace.openTextDocument.args).to.eql([
                ['URI_INSTANCE_1'], ['URI_INSTANCE_2']
            ]);
            expect(vscode.commands.executeCommand.args).to.eql([[
                'vscode.diff', 'URI_INSTANCE_1', 'URI_INSTANCE_2'
            ]]);
            expect(vscode.Uri.parse.args).to.eql([
                ['untitled:WORKSPACE_ROOT_PATH%2Ftmp-0'],
                ['untitled:WORKSPACE_ROOT_PATH%2Ftmp-1']
            ]);
            expect(vscode._otherStubs.builder.insert.args[0][1]).to.eql('TEXT_1');
            expect(vscode._otherStubs.builder.insert.args[1][1]).to.eql('TEXT_2');
        });
    });

    function fakeVSCode() {
        const Position = sinon.stub().returnsThis();
        const builder = {insert: sinon.spy()};
        const editor = {edit: sinon.stub().callsArgWith(0, builder)};
        const commands = {executeCommand: sinon.spy()};
        const window = {
            showTextDocument: sinon.stub().withArgs('TEXT_DOCUMENT_INSTNACE').returns(Promise.resolve(editor))
        };
        const workspace = {
            openTextDocument: sinon.stub().returns(Promise.resolve('TEXT_DOCUMENT_INSTNACE')),
            rootPath: 'WORKSPACE_ROOT_PATH'
        };
        const Uri = {parse: getReturnStub('URI_INSTANCE_1', 'URI_INSTANCE_2')};
        const _otherStubs = {builder};
        return {Position, Uri, commands, window, workspace, _otherStubs};
    }

    function getLogger() {
        return {error: () => {}};
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