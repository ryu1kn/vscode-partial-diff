
class SelectionInfoRegistry {

    constructor() {
        this._data = Object.create(null);
    }

    set(key, textInfo) {
        this._data[key] = {
            text: textInfo.text,
            fileName: textInfo.fileName,
            lineRanges: textInfo.lineRanges
        };
    }

    get(key) {
        return this._data[key];
    }

}

module.exports = SelectionInfoRegistry;
