import MessageBar from '../message-bar';
import NormalisationRulePicker from '../normalisation-rule-picker';
import NormalisationRuleStore from '../normalisation-rule-store';

export default class ToggleNormalisationRulesCommand {
  private _logger: Console;
  private _messageBar: MessageBar;
  private _normalisationRulePicker: NormalisationRulePicker;
  private _normalisationRuleStore: NormalisationRuleStore;

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

  _handleError (e) {
    this._logger.error(e.stack);
  }
}
