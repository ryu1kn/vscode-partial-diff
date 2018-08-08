import {ObjectMap} from './utils/collections';
import {SelectionInfo} from './entities/selection-info';

export default class SelectionInfoRegistry {
    private readonly data: ObjectMap<SelectionInfo>;

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
