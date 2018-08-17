import NormalisationRuleStore from './normalisation-rule-store';
import SelectionInfoRegistry from './selection-info-registry';
import TextResourceUtil from './text-resource-util';
import TextTitleBuilder from './text-title-builder';
import CommandAdaptor from './adaptors/command';

const DiffModeSymbols = {
    NORMALISED: '\u007e',
    AS_IS: '\u2194'
};

export default class DiffPresenter {
    private readonly normalisationRuleStore: NormalisationRuleStore;
    private readonly selectionInfoRegistry: SelectionInfoRegistry;
    private readonly textResourceUtil: TextResourceUtil;
    private readonly textTitleBuilder: TextTitleBuilder;
    private readonly commandAdaptor: CommandAdaptor;

    constructor(selectionInfoRegistry: SelectionInfoRegistry,
                normalisationRuleStore: NormalisationRuleStore,
                textTitleBuilder: TextTitleBuilder,
                textResourceUtil: TextResourceUtil,
                commandAdaptor: CommandAdaptor) {
        this.normalisationRuleStore = normalisationRuleStore;
        this.selectionInfoRegistry = selectionInfoRegistry;
        this.textResourceUtil = textResourceUtil;
        this.textTitleBuilder = textTitleBuilder;
        this.commandAdaptor = commandAdaptor;
    }

    takeDiff(textKey1: string, textKey2: string) {
        const getUri = (textKey: string) => this.textResourceUtil.getUri(textKey);
        const title = this.buildTitle(textKey1, textKey2);
        return this.commandAdaptor.executeCommand('vscode.diff', getUri(textKey1), getUri(textKey2), title);
    }

    private buildTitle(textKey1: string, textKey2: string) {
        const title1 = this.buildTextTitle(textKey1);
        const title2 = this.buildTextTitle(textKey2);
        const comparisonSymbol = this.normalisationRuleStore.hasActiveRules
            ? DiffModeSymbols.NORMALISED
            : DiffModeSymbols.AS_IS;
        return `${title1} ${comparisonSymbol} ${title2}`;
    }

    private buildTextTitle(textKey: string) {
        const textInfo = this.selectionInfoRegistry.get(textKey);
        return this.textTitleBuilder.build(textInfo);
    }
}
