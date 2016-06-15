
'use strict';

class ContentProvider {
    constructor(params) {
        this._textRegistry = params.textRegistry;
        this._textResourceUtil = params.textResourceUtil;
    }

    provideTextDocumentContent(uri) {
        const textKey = this._textResourceUtil.getTextKey(uri);
        return this._textRegistry.get(textKey) || '';
    }
}

module.exports = ContentProvider;
