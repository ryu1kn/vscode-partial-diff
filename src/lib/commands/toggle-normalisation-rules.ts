import MessageBar from '../message-bar';
import NormalisationRulePicker from '../normalisation-rule-picker';
import NormalisationRuleStore from '../normalisation-rule-store';

export default class ToggleNormalisationRulesCommand {
    private readonly logger: Console;
    private readonly messageBar: MessageBar;
    private readonly normalisationRulePicker: NormalisationRulePicker;
    private readonly normalisationRuleStore: NormalisationRuleStore;

    constructor(params) {
        this.logger = params.logger;
        this.messageBar = params.messageBar;
        this.normalisationRulePicker = params.normalisationRulePicker;
        this.normalisationRuleStore = params.normalisationRuleStore;
    }

    async execute() {
        try {
            const rules = this.normalisationRuleStore.getAllRules();
            if (rules.length > 0) {
                const newRules = await this.normalisationRulePicker.show(rules);
                this.normalisationRuleStore.specifyActiveRules(newRules);
            } else {
                await this.messageBar.showInfo(
                    'Please set `partialDiff.preComparisonTextNormalizationRules` first'
                );
            }
        } catch (e) {
            this.handleError(e);
        }
    }

    private handleError(e) {
        this.logger.error(e.stack);
    }
}
