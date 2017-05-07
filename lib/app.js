class App {

    constructor(params) {
        this._logger = params.logger;
        this._diffPresenter = params.diffPresenter;
        this._editorTextExtractor = params.editorTextExtractor;
        this._textRegistry = params.textRegistry;
        this._textResourceUtil = params.textResourceUtil;
        this._vscode = params.vscode;
        this._path = params.path;
        this._copyPaste = params.copyPaste;
    }

    diffSelectionWithClipboard(editor) {
        return new Promise((resolve, reject) => {
            this._copyPaste.paste((err, text) => {
                if (err) return reject(err);
                if (!text) return resolve();

                this._textRegistry.set('1', text, 'Clipboard', null);
                this._setContext();
                resolve();
            });

            // Cancel the promise if it doesn't succeed after a short (1.5s) timeout
            setTimeout(() => reject(new Error('Clipboard timed out')), 1500);
        })
            .then(() => this.saveSelectionAsText2AndTakeDiff(editor))
            .catch(this._handleError.bind(this));
    }

    saveSelectionAsText1(editor) {
        try {
            this._saveSelectionAsText('1', editor);
            this._setContext();
        } catch (e) {
            this._handleError(e);
        }
    }

    _setContext() {
        return this._vscode.commands.executeCommand('setContext', 'partialDiff:hasSelectedText', true);
    }

    _saveSelectionAsText(textKey, editor) {
        const fileName = this._path.basename(editor.document.fileName);
        const selection = editor.selection.isEmpty ? null : editor.selection;
        return this._textRegistry.set(textKey, this._editorTextExtractor.extract(editor),
            fileName, selection);
    }

    _getTitlePart(item) {
        const suffix = item.selection ? ` (${item.selection.start.line}-${item.selection.end.line})` : '';
        return `${item.fileName}${suffix}`;
    }

    saveSelectionAsText2AndTakeDiff(editor) {
        return Promise.resolve().then(() => {
            const left = this._textRegistry.get('1');
            const right = this._saveSelectionAsText('2', editor);

            const title = `${this._getTitlePart(left)} \u2194 ${this._getTitlePart(right)}`;

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
