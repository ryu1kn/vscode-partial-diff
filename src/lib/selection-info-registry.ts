import {ObjectMap} from './utils/collections';
import {SelectionInfo} from './types/selection-info';

export default class SelectionInfoRegistry {
    private readonly data: ObjectMap<SelectionInfo>;

    constructor() {
        this.data = Object.create(null);
    }

    set(key: string, textInfo: SelectionInfo): void {
        const normalised: SelectionInfo = {
            text: textInfo.text,
            fileName: textInfo.fileName,
            lineRanges: textInfo.lineRanges || []
        };
        if (textInfo.sourceUri) {
            normalised.sourceUri = textInfo.sourceUri;
        }
        if (textInfo.targetKind) {
            normalised.targetKind = textInfo.targetKind;
        }
        if (textInfo.selectionRange) {
            normalised.selectionRange = textInfo.selectionRange;
        }
        this.data[key] = normalised;
    }

    get(key: string): SelectionInfo {
        return this.data[key];
    }
}
