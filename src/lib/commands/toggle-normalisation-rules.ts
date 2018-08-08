import MessageBar from '../message-bar';
import NormalisationRulePicker from '../normalisation-rule-picker';
import NormalisationRuleStore from '../normalisation-rule-store';
import {Command} from './command';

export default class ToggleNormalisationRulesCommand implements Command {
    private readonly messageBar: MessageBar;
    private readonly normalisationRulePicker: NormalisationRulePicker;
    private readonly normalisationRuleStore: NormalisationRuleStore;

    constructor(normalisationRuleStore: NormalisationRuleStore,
                normalisationRulePicker: NormalisationRulePicker,
                messageBar: MessageBar) {
        this.messageBar = messageBar;
        this.normalisationRulePicker = normalisationRulePicker;
        this.normalisationRuleStore = normalisationRuleStore;
    }

    async execute() {
        const rules = this.normalisationRuleStore.getAllRules();
        if (rules.length > 0) {
            const newRules = await this.normalisationRulePicker.show(rules);
            this.normalisationRuleStore.specifyActiveRules(newRules);
        } else {
            await this.messageBar.showInfo(
                'Please set `partialDiff.preComparisonTextNormalizationRules` first'
            );
        }
    }

}
