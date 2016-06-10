
'use strict';

// TODO:
// * Create unmark sections command to reset and remove temp files
// * Revise the timing of taking a diff.
//   Does it need to be onlyafter the 2nd section selected?
class App {

    constructor(params) {
        this._vscode = params.vscode;
        this._logger = params.logger;
        this._diffPresenter = params.diffPresenter;
        this._tempFileWriter = params.tempFileWriter;
    }

    handleMarkSection1Command() {
        try {
            const editor = this._vscode.window.activeTextEditor;
            const selectedText = editor.document.getText(editor.selection);
            this._filePath1Promise = this._tempFileWriter.write(selectedText);
            return this._filePath1Promise;
        } catch (e) {
            this._handleError(e);
        }
    }

    handleMarkSection2AndTakeDiffCommand() {
        return Promise.resolve().then(() => {
            const editor = this._vscode.window.activeTextEditor;
            const selectedText = editor.document.getText(editor.selection);
            this._filePath2Promise = this._tempFileWriter.write(selectedText);
            return Promise.all([this._getFilePath(1), this._getFilePath(2)])
                .then(filePaths => this._diffPresenter.takeDiff(filePaths[0], filePaths[1]));
        }).catch(this._handleError.bind(this));
    }

    _getFilePath(number) {
        const filePathPromiseName = `_filePath${number}Promise`;
        const filePathName = `_filePath${number}`;
        if (this[filePathPromiseName]) {
            return this[filePathPromiseName].then(filePath => {
                this[filePathName] = filePath;
                this[filePathPromiseName] = null;
                return filePath;
            });
        }
        return Promise.resolve(this[filePathName] || null);
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }
}

module.exports = App;
