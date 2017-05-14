
class TextTitleBuilder {

    build(textInfo) {
        if (!textInfo) return 'N/A';

        const suffix = textInfo.lineRange ? ` (${textInfo.lineRange.start}-${textInfo.lineRange.end})` : '';
        return `${textInfo.fileName}${suffix}`;
    }

}

module.exports = TextTitleBuilder;
