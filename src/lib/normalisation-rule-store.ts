import ConfigStore from './config-store';
import isEqual = require('lodash.isequal');
import omit = require('lodash.omit');
import {LoadedNormalisationRule, SavedNormalisationRule} from './entities/normalisation-rule';

const clone = (value: any) => JSON.parse(JSON.stringify(value));

export default class NormalisationRuleStore {
    private readonly configStore: ConfigStore;
    private baseRules?: SavedNormalisationRule[];
    private rules?: LoadedNormalisationRule[];

    constructor(configStore: ConfigStore) {
        this.configStore = configStore;
        this.setupRules(this.configStore.preComparisonTextNormalizationRules);
    }

    private setupRules(rules: SavedNormalisationRule[]) {
        this.baseRules = clone(rules);
        this.rules = this.resetRuleStatus(this.baseRules!);
    }

    private resetRuleStatus(rules: SavedNormalisationRule[]): LoadedNormalisationRule[] {
        return rules.map(rule =>
            Object.assign({}, omit(rule, ['enableOnStart']), {
                active: rule.enableOnStart !== false
            })
        );
    }

    getAllRules(): LoadedNormalisationRule[] {
        const newBaseRules = this.configStore.preComparisonTextNormalizationRules;
        if (!isEqual(newBaseRules, this.baseRules)) {
            this.setupRules(newBaseRules);
        }
        return this.rules!;
    }

    get activeRules(): LoadedNormalisationRule[] {
        return this.getAllRules().filter(rule => rule.active);
    }

    get hasActiveRules(): boolean {
        return this.activeRules.length > 0;
    }

    specifyActiveRules(ruleIndices: number[]) {
        this.rules = this.rules!.map((rule, index) =>
            Object.assign({}, rule, {active: ruleIndices.includes(index)})
        );
    }
}
