import NormalisationRuleStore from './normalisation-rule-store';
import SelectionInfoRegistry from './selection-info-registry';
import TextResourceUtil from './text-resource-util';
import TextTitleBuilder from './text-title-builder';

const DiffModeSymbols = {
  NORMALISED: '\u007e',
  AS_IS: '\u2194'
};

export default class DiffPresenter {
  private readonly _commands: any;
  private readonly _normalisationRuleStore: NormalisationRuleStore;
  private readonly _selectionInfoRegistry: SelectionInfoRegistry;
  private readonly _textResourceUtil: TextResourceUtil;
  private readonly _textTitleBuilder: TextTitleBuilder;

  constructor (params) {
    this._commands = params.commands;
    this._normalisationRuleStore = params.normalisationRuleStore;
    this._selectionInfoRegistry = params.selectionInfoRegistry;
    this._textResourceUtil = params.textResourceUtil;
    this._textTitleBuilder = params.textTitleBuilder;
  }

  takeDiff (textKey1, textKey2) {
    const getUri = textKey => this._textResourceUtil.getUri(textKey);
    const title = this._buildTitle(textKey1, textKey2);
    return this._commands.executeCommand(
      'vscode.diff',
      getUri(textKey1),
      getUri(textKey2),
      title
    );
  }

  private _buildTitle (textKey1, textKey2) {
    const title1 = this._buildTextTitle(textKey1);
    const title2 = this._buildTextTitle(textKey2);
    const comparisonSymbol = this._normalisationRuleStore.hasActiveRules
      ? DiffModeSymbols.NORMALISED
      : DiffModeSymbols.AS_IS;
    return `${title1} ${comparisonSymbol} ${title2}`;
  }

  private _buildTextTitle (textKey) {
    const textInfo = this._selectionInfoRegistry.get(textKey);
    return this._textTitleBuilder.build(textInfo);
  }
}
