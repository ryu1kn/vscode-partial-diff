
class App {

    constructor(params) {
        this._logger = params.logger;
        this._diffPresenter = params.diffPresenter;
        this._editorTextExtractor = params.editorTextExtractor;
        this._textRegistry = params.textRegistry;
        this._textResourceUtil = params.textResourceUtil;
        this._vscode = params.vscode;
    }

    saveSelectionAsText1(editor) {
        try {
            this._textRegistry.set('1', this._editorTextExtractor.extract(editor));
            this._vscode.commands.executeCommand('setContext', 'partialDiff:hasSelectedText', true);
        } catch (e) {
            this._handleError(e);
        }
    }

    saveSelectionAsText2AndTakeDiff(editor) {
        return Promise.resolve().then(() => {
            this._textRegistry.set('2', this._editorTextExtractor.extract(editor));
            return this._takeDiff();
        }).catch(this._handleError.bind(this));
    }

    _takeDiff() {
        const getUri = textKey => this._textResourceUtil.getUri(textKey);
        return this._diffPresenter.takeDiff(getUri('1'), getUri('2'));
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = App;
