import ConfigStore from './config-store';

import * as isEqual from 'lodash.isequal';
import * as omit from 'lodash.omit';

const clone = value => JSON.parse(JSON.stringify(value));

export default class NormalisationRuleStore {
  private readonly configStore: ConfigStore;
  private baseRules: any;
  private rules: any;

  constructor (params) {
    this.configStore = params.configStore;
    this.setupRules(this.configStore.preComparisonTextNormalizationRules);
  }

  private setupRules (rules) {
    this.baseRules = clone(rules);
    this.rules = this.resetRuleStatus(this.baseRules);
  }

  private resetRuleStatus (rules) {
    return rules.map(rule =>
      Object.assign({}, omit(rule, ['enableOnStart']), {
        active: rule.enableOnStart !== false
      })
    );
  }

  getAllRules () {
    const newBaseRules = this.configStore.preComparisonTextNormalizationRules;
    if (!isEqual(newBaseRules, this.baseRules)) {
      this.setupRules(newBaseRules);
    }
    return this.rules;
  }

  get activeRules () {
    return this.getAllRules().filter(rule => rule.active);
  }

  get hasActiveRules () {
    return this.activeRules.length > 0;
  }

  specifyActiveRules (ruleIndices) {
    this.rules = this.rules.map((rule, index) =>
      Object.assign({}, rule, { active: ruleIndices.includes(index) })
    );
  }
}
