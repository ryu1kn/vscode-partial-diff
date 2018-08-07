export default class TextTitleBuilder {
    build(textInfo) {
        if (!textInfo) return 'N/A';

        const suffix = this.lineRangesSuffix(textInfo.lineRanges);
        return `${textInfo.fileName}${suffix}`;
    }

    private lineRangesSuffix(lineRanges) {
        return lineRanges.length !== 0
            ? ` (${lineRanges.map(this.lineRangeLabel)})`
            : '';
    }

    private lineRangeLabel(lineRange) {
        const isOneLine = lineRange.start === lineRange.end;
        return isOneLine
            ? `l.${lineRange.start + 1}`
            : `ll.${lineRange.start + 1}-${lineRange.end + 1}`;
    }
}
