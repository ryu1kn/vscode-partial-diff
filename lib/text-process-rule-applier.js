
class TextProcessRuleApplier {

    constructor(params) {
        this._configStore = params.configStore;
    }

    applyTo(text) {
        const rules = this._configStore.get('preComparisonTextProcessRules');
        return rules.length !== 0 ? this._applyRulesToText(rules, text) : text;
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

module.exports = TextProcessRuleApplier;
