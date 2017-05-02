
class App {

    constructor(params) {
        this._logger = params.logger;
        this._diffPresenter = params.diffPresenter;
        this._editorTextExtractor = params.editorTextExtractor;
        this._textRegistry = params.textRegistry;
        this._textResourceUtil = params.textResourceUtil;
        this._vscode = params.vscode;
        this._path = params.path;
    }

    saveSelectionAsText1(editor) {
        try {
            this._saveSelectionAsText('1', editor);
            this._vscode.commands.executeCommand('setContext', 'partialDiff:hasSelectedText', true);
        } catch (e) {
            this._handleError(e);
        }
    }

    _saveSelectionAsText(textKey, editor) {
        const fileName = this._path.basename(editor.document.fileName);
        const selection = editor.selection.isEmpty ? null : editor.selection;
        return this._textRegistry.set(textKey, this._editorTextExtractor.extract(editor),
            fileName, selection);
    }

    _getTitlePart(item) {
        const suffix = item.selection ? `:${item.selection.start.line}-${item.selection.end.line}` : '';
        return `${item.fileName}${suffix}`;
    }

    saveSelectionAsText2AndTakeDiff(editor) {
        return Promise.resolve().then(() => {
            const first = this._textRegistry.get('1');
            const second = this._saveSelectionAsText('2', editor);

            const title = `${this._getTitlePart(first)} \u2194 ${this._getTitlePart(second)}`;

            return this._takeDiff(title);
        }).catch(this._handleError.bind(this));
    }

    _takeDiff(title) {
        const getUri = textKey => this._textResourceUtil.getUri(textKey);
        return this._diffPresenter.takeDiff(title, getUri('1'), getUri('2'));
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = App;
