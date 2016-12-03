
class TextResourceUtil {

    constructor(params) {
        this._extensionScheme = params.extensionScheme;
        this._Uri = params.Uri;
        this._getCurrentDateFn = params.getCurrentDateFn;
    }

    getUri(textKey) {
        const timestamp = this._getCurrentDateFn().getTime();
        return this._Uri.parse(`${this._extensionScheme}:text/${textKey}?_ts=${timestamp}`);    // `_ts` for avoid cache
    }

    getTextKey(uri) {
        const match = uri.path.match(/^text\/(\d+)/);
        return match[1];
    }

}

module.exports = TextResourceUtil;
