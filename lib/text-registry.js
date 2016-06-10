
'use strict';

class TextRegistry {

    register(index, text) {
        this[`_${index}`] = text;
    }

    read(index) {
        return this[`_${index}`];
    }
}

module.exports = TextRegistry;
