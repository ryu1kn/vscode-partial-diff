
'use strict';

class TextRegistry {
    constructor() {
        this._data = {};
    }

    set(key, text) {
        this._data[key] = text;
    }

    get(key) {
        return this._data[key];
    }
}

module.exports = TextRegistry;
