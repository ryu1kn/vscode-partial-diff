import TextProcessRuleApplier from './text-process-rule-applier';
import SelectionInfoRegistry from './selection-info-registry';
import TextResourceUtil from './text-resource-util';

export default class ContentProvider {
  private readonly _selectionInfoRegistry: SelectionInfoRegistry;
  private readonly _textResourceUtil: TextResourceUtil;
  private readonly _textProcessRuleApplier: TextProcessRuleApplier;

  constructor (params) {
    this._selectionInfoRegistry = params.selectionInfoRegistry;
    this._textResourceUtil = params.textResourceUtil;
    this._textProcessRuleApplier = new TextProcessRuleApplier({
      normalisationRuleStore: params.normalisationRuleStore
    });
  }

  provideTextDocumentContent (uri) {
    const textKey = this._textResourceUtil.getTextKey(uri);
    const registeredText = (
      this._selectionInfoRegistry.get(textKey) || { text: '' }
    ).text;
    return this._textProcessRuleApplier.applyTo(registeredText);
  }
}
