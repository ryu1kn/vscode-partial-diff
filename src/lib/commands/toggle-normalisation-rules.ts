import NormalisationRulePicker from '../normalisation-rule-picker';
import NormalisationRuleStore from '../normalisation-rule-store';
import {Command} from './command';
import WindowAdaptor from '../adaptors/window';

export default class ToggleNormalisationRulesCommand implements Command {
    private readonly normalisationRulePicker: NormalisationRulePicker;

    constructor(private readonly normalisationRuleStore: NormalisationRuleStore,
                private readonly windowAdaptor: WindowAdaptor) {
        this.normalisationRulePicker = new NormalisationRulePicker(windowAdaptor);
    }

    async execute() {
        const rules = this.normalisationRuleStore.getAllRules();
        if (rules.length > 0) {
            const newRules = await this.normalisationRulePicker.show(rules);
            this.normalisationRuleStore.specifyActiveRules(newRules);
        } else {
            await this.windowAdaptor.showInformationMessage(
                'Please set `partialDiff.preComparisonTextNormalizationRules` first'
            );
        }
    }

}
