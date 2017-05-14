
class ContentProvider {

    constructor(params) {
        this._selectionInfoRegistry = params.selectionInfoRegistry;
        this._textResourceUtil = params.textResourceUtil;
    }

    provideTextDocumentContent(uri) {
        const textKey = this._textResourceUtil.getTextKey(uri);
        return (this._selectionInfoRegistry.get(textKey) || {text: ''}).text;
    }

}

module.exports = ContentProvider;
