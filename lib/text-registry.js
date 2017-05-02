
class TextRegistry {

    constructor() {
        this._data = Object.create(null);
    }

    set(key, text, fileName, selection) {
        const item = {
            text,
            fileName,
            selection
        };
        this._data[key] = item;
        return item;
    }

    get(key) {
        return this._data[key];
    }

}

module.exports = TextRegistry;
