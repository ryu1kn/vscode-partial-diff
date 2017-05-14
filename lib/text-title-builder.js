
class TextTitleBuilder {

    build(textInfo) {
        if (!textInfo) return 'N/A';

        const suffix = this._lineRangeSuffix(textInfo.lineRange);
        return `${textInfo.fileName}${suffix}`;
    }

    _lineRangeSuffix(lineRange) {
        if (!lineRange) return '';

        const startLine = lineRange.start + 1;
        const endLine = lineRange.end + 1;
        return ` (${startLine}-${endLine})`;
    }

}

module.exports = TextTitleBuilder;
