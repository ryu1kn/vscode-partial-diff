export default class SelectionInfoRegistry {
    private readonly data: any;

    constructor() {
        this.data = Object.create(null);
    }

    set(key, textInfo) {
        this.data[key] = {
            text: textInfo.text,
            fileName: textInfo.fileName,
            lineRanges: textInfo.lineRanges || []
        };
    }

    get(key) {
        return this.data[key];
    }
}
