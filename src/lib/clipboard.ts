const PLATFORM_WINDOWS = 'win32';

export default class Clipboard {
  private readonly _clipboardy: any;
  private readonly _platform: any;

  constructor (params) {
    this._clipboardy = params.clipboardy;
    this._platform = params.platform;
  }

  async read () {
    const text = await this._clipboardy.read();
    return this._windows ? this._dropCRFromEOL(text) : text;
  }

  private get _windows () {
    return this._platform === PLATFORM_WINDOWS;
  }

  private _dropCRFromEOL (text) {
    return text.split('\r\r\n').join('\r\n');
  }
}
