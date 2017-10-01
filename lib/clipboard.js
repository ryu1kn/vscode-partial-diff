
class Clipboard {

    constructor(params) {
        this._clipboardy = params.clipboardy;
    }

    read() {
        return this._clipboardy.read();
    }

}

module.exports = Clipboard;
