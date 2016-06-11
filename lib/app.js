
'use strict';

// TODO:
// * Create unmark sections command to reset and remove temp files
class App {

    constructor(params) {
        this._vscode = params.vscode;
        this._logger = params.logger;
        this._diffPresenter = params.diffPresenter;
        this._tempFileWriter = params.tempFileWriter;
    }

    handleMarkSection1Command() {
        return Promise.resolve().then(() => {
            this._filePath1Promise = this._saveSelectedText();
            return this._filePath1Promise;
        }).catch(this._handleError.bind(this));
    }

    handleMarkSection2AndTakeDiffCommand() {
        return Promise.resolve().then(() => {
            this._filePath2Promise = this._saveSelectedText();
            return this._takeDiff();
        }).catch(this._handleError.bind(this));
    }

    _saveSelectedText() {
        const editor = this._vscode.window.activeTextEditor;
        const selectedText = editor.document.getText(editor.selection);
        return this._tempFileWriter.write(selectedText);
    }

    _takeDiff() {
        const filePathPromises = [this._getFilePath(1), this._getFilePath(2)];
        return Promise.all(filePathPromises).then(filePaths => {
            if (filePaths[0] && filePaths[1]) {
                this._diffPresenter.takeDiff(filePaths[0], filePaths[1])
            }
        });
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
