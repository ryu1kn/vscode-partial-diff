
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
        return text.replace(new RegExp(rule.match, 'g'), rule.replaceWith);
    }

}

module.exports = ContentProvider;
