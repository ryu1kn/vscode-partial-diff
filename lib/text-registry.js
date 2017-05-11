
// TODO: Rename class

const _ = require('lodash');

class TextRegistry {

    constructor() {
        this._data = Object.create(null);
    }

    set(key, textData) {
        this._data[key] = _.pick(textData, ['text', 'fileName', 'lineRange']);
    }

    get(key) {
        return this._data[key];
    }

}

module.exports = TextRegistry;
