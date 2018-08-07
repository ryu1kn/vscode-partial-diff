import NormalisationRuleStore from './normalisation-rule-store';

export default class TextProcessRuleApplier {
  private readonly _normalisationRuleStore: NormalisationRuleStore;

  constructor (params) {
    this._normalisationRuleStore = params.normalisationRuleStore;
  }

  applyTo (text) {
    const rules = this._normalisationRuleStore.activeRules;
    return rules.length !== 0 ? this._applyRulesToText(rules, text) : text;
  }

  private _applyRulesToText (rules, text) {
    return rules.reduce(
      (newText, rule) => this._applyRuleToText(rule, newText),
      text
    );
  }

  private _applyRuleToText (rule, text) {
    const pattern = new RegExp(rule.match, 'g');

    if (typeof rule.replaceWith === 'string') {
      return text.replace(pattern, rule.replaceWith);
    }

    return text.replace(pattern, matched => {
      switch (rule.replaceWith.letterCase) {
        case 'lower':
          return matched.toLowerCase();
        case 'upper':
          return matched.toUpperCase();
        default:
          return matched;
      }
    });
  }
}
