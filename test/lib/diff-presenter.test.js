
const DiffPresenter = require('../../lib/diff-presenter');

suite('DiffPresenter', () => {

    test('it compares two files', () => {
        const commands = fakeCommands();
        const selectionInfoRegistry = {
            get: stubWithArgs(
                ['TEXT1'], 'TEXT_INFO_1',
                ['TEXT2'], 'TEXT_INFO_2'
            )
        };
        const textTitleBuilder = {build: textKey => `TITLE_${textKey}`};
        const textResourceUtil = {
            getUri: stubWithArgs(
                ['TEXT1'], 'URI_INSTANCE_1',
                ['TEXT2'], 'URI_INSTANCE_2'
            )
        };
        const diffPresenter = new DiffPresenter({commands, textTitleBuilder, selectionInfoRegistry, textResourceUtil});
        return diffPresenter.takeDiff('TEXT1', 'TEXT2').then(() => {
            expect(commands.executeCommand).to.have.been.calledWith(
                'vscode.diff', 'URI_INSTANCE_1', 'URI_INSTANCE_2', 'TITLE_TEXT_INFO_1 \u2194 TITLE_TEXT_INFO_2'
            );
        });
    });

    function fakeCommands() {
        return {executeCommand: sinon.stub().returns(Promise.resolve())};
    }

});
