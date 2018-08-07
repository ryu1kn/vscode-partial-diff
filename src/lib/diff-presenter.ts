import NormalisationRuleStore from './normalisation-rule-store';
import SelectionInfoRegistry from './selection-info-registry';
import TextResourceUtil from './text-resource-util';
import TextTitleBuilder from './text-title-builder';

const DiffModeSymbols = {
  NORMALISED: '\u007e',
  AS_IS: '\u2194'
};

export default class DiffPresenter {
  private readonly commands: any;
  private readonly normalisationRuleStore: NormalisationRuleStore;
  private readonly selectionInfoRegistry: SelectionInfoRegistry;
  private readonly textResourceUtil: TextResourceUtil;
  private readonly textTitleBuilder: TextTitleBuilder;

  constructor(params) {
    this.commands = params.commands;
    this.normalisationRuleStore = params.normalisationRuleStore;
    this.selectionInfoRegistry = params.selectionInfoRegistry;
    this.textResourceUtil = params.textResourceUtil;
    this.textTitleBuilder = params.textTitleBuilder;
  }

  takeDiff(textKey1, textKey2) {
    const getUri = textKey => this.textResourceUtil.getUri(textKey);
    const title = this.buildTitle(textKey1, textKey2);
    return this.commands.executeCommand(
      'vscode.diff',
      getUri(textKey1),
      getUri(textKey2),
      title
    );
  }

  private buildTitle(textKey1, textKey2) {
    const title1 = this.buildTextTitle(textKey1);
    const title2 = this.buildTextTitle(textKey2);
    const comparisonSymbol = this.normalisationRuleStore.hasActiveRules
      ? DiffModeSymbols.NORMALISED
      : DiffModeSymbols.AS_IS;
    return `${title1} ${comparisonSymbol} ${title2}`;
  }

  private buildTextTitle(textKey) {
    const textInfo = this.selectionInfoRegistry.get(textKey);
    return this.textTitleBuilder.build(textInfo);
  }
}
