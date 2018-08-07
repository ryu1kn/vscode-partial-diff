export default class TextTitleBuilder {
  build (textInfo) {
    if (!textInfo) return 'N/A';

    const suffix = this._lineRangesSuffix(textInfo.lineRanges);
    return `${textInfo.fileName}${suffix}`;
  }

  _lineRangesSuffix (lineRanges) {
    return lineRanges.length !== 0
      ? ` (${lineRanges.map(this._lineRangeLabel)})`
      : '';
  }

  _lineRangeLabel (lineRange) {
    const isOneLine = lineRange.start === lineRange.end;
    return isOneLine
      ? `l.${lineRange.start + 1}`
      : `ll.${lineRange.start + 1}-${lineRange.end + 1}`;
  }
}
