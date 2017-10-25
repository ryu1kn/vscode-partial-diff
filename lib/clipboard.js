
const PLATFORM_WINDOWS = 'win32';

class Clipboard {

    constructor(params) {
        this._clipboardy = params.clipboardy;
        this._platform = params.platform;
    }

    async read() {
        const text = await this._clipboardy.read();
        return this._windows ? this._dropCRFromEOL(text) : text;
    }

    get _windows() {
        return this._platform === PLATFORM_WINDOWS;
    }

    _dropCRFromEOL(text) {
        return text.split('\r\r\n').join('\r\n');
    }

}

module.exports = Clipboard;
