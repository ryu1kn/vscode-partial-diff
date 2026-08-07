

export interface SelectionInfo {
    text: string;
    fileName: string;
    lineRanges: LineRange[];
    sourceUri?: string;
    targetKind?: ApplyTargetKind;
    selectionRange?: SelectionRange;
}

export type LineRange = {
    start: number;
    end: number;
};

export type SelectionRange = {
    startLine: number;
    startChar: number;
    endLine: number;
    endChar: number;
};

export type ApplyTargetKind = 'document' | 'selection' | 'clipboard';
