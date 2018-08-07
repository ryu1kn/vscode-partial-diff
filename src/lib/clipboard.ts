const PLATFORM_WINDOWS = 'win32';

export default class Clipboard {
    private readonly clipboardy: any;
    private readonly platform: string;

    constructor(clipboardy: any, platform: string) {
        this.clipboardy = clipboardy;
        this.platform = platform;
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
