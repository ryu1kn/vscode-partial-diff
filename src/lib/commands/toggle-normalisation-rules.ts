import MessageBar from '../message-bar';
import NormalisationRulePicker from '../normalisation-rule-picker';
import NormalisationRuleStore from '../normalisation-rule-store';

export default class ToggleNormalisationRulesCommand {
  private readonly _logger: Console;
  private readonly _messageBar: MessageBar;
  private readonly _normalisationRulePicker: NormalisationRulePicker;
  private readonly _normalisationRuleStore: NormalisationRuleStore;

  constructor (params) {
    this._logger = params.logger;
    this._messageBar = params.messageBar;
    this._normalisationRulePicker = params.normalisationRulePicker;
    this._normalisationRuleStore = params.normalisationRuleStore;
  }

  async execute () {
    try {
      const rules = this._normalisationRuleStore.getAllRules();
      if (rules.length > 0) {
        const newRules = await this._normalisationRulePicker.show(rules);
        this._normalisationRuleStore.specifyActiveRules(newRules);
      } else {
        await this._messageBar.showInfo(
          'Please set `partialDiff.preComparisonTextNormalizationRules` first'
        );
      }
    } catch (e) {
      this._handleError(e);
    }
  }

  private _handleError (e) {
    this._logger.error(e.stack);
  }
}
