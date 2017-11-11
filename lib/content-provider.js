
class ContentProvider {

    constructor(params) {
        this._selectionInfoRegistry = params.selectionInfoRegistry;
        this._textResourceUtil = params.textResourceUtil;
        this._configStore = params.configStore;
    }

    provideTextDocumentContent(uri) {
        const selectedText = this._retrieveSelectedText(uri);
        const rules = this._configStore.get('preComparisonTextProcessRules');
        return rules.length !== 0 ? this._applyRulesToText(rules, selectedText) : selectedText;
    }

    _retrieveSelectedText(uri) {
        const textKey = this._textResourceUtil.getTextKey(uri);
        return (this._selectionInfoRegistry.get(textKey) || {text: ''}).text;
    }

    _applyRulesToText(rules, text) {
        return rules.reduce((newText, rule) => this._applyRuleToText(rule, newText), text);
    }

    _applyRuleToText(rule, text) {
        const replaceText = replaceExpr => text.replace(new RegExp(rule.match, 'g'), replaceExpr);
        if (typeof rule.replaceWith === 'string') return replaceText(rule.replaceWith);

        const newText = replaceText(rule.replaceWith.expression);
        switch (rule.replaceWith.letterCase) {
        case 'lower': return newText.toLowerCase();
        case 'upper': return newText.toUpperCase();
        default: return newText;
        }
    }

    _replaceText(text, pattern, replacePattern) {
        return text.replace(new RegExp(pattern, 'g'), replacePattern);
    }

}

module.exports = ContentProvider;
