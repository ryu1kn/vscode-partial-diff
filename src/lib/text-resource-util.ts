export default class TextResourceUtil {
  private readonly extensionScheme: any;
  private readonly Uri: any;
  private readonly getCurrentDateFn: any;

  constructor(params) {
    this.extensionScheme = params.extensionScheme;
    this.Uri = params.Uri;
    this.getCurrentDateFn = params.getCurrentDateFn;
  }

  getUri(textKey) {
    const timestamp = this.getCurrentDateFn().getTime();
    return this.Uri.parse(
      `${this.extensionScheme}:text/${textKey}?_ts=${timestamp}`
    ); // `_ts` for avoid cache
  }

  getTextKey(uri) {
    const match = uri.path.match(/^text\/([a-z\d]+)/);
    return match[1];
  }
}
