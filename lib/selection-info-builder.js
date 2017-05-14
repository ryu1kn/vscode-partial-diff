
const path = require('path');

class SelectionInfoBuilder {

    constructor(params) {
        this._editorTextExtractor = params.editorTextExtractor;
        this._editorLineRangeExtractor = params.editorLineRangeExtractor;
    }

    extract(editor) {
        return {
            text: this._editorTextExtractor.extract(editor),
            fileName: path.basename(editor.document.fileName),
            lineRange: this._editorLineRangeExtractor.extract(editor)
        };
    }

}

module.exports = SelectionInfoBuilder;
