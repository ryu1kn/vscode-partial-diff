const PLATFORM_WINDOWS = 'win32';

export default class Clipboard {
    private readonly clipboardy: any;
    private readonly platform: any;

    constructor(params) {
        this.clipboardy = params.clipboardy;
        this.platform = params.platform;
    }

    async read() {
        const text = await this.clipboardy.read();
        return this.windows ? this.dropCRFromEOL(text) : text;
    }

    private get windows() {
        return this.platform === PLATFORM_WINDOWS;
    }

    private dropCRFromEOL(text) {
        return text.split('\r\r\n').join('\r\n');
    }
}
