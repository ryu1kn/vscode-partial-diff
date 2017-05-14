
class TextTitleBuilder {

    build(textInfo) {
        if (!textInfo) return 'N/A';

        const suffix = this._lineRangeSuffix(textInfo.lineRange);
        return `${textInfo.fileName}${suffix}`;
    }

    _lineRangeSuffix(lineRange) {
        if (!lineRange) return '';
        const isOneLine = lineRange.start === lineRange.end;
        return isOneLine ?
            ` (l.${lineRange.start + 1})` :
            ` (ll.${lineRange.start + 1}-${lineRange.end + 1})`;
    }

}

module.exports = TextTitleBuilder;
