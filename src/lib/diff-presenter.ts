import NormalisationRuleStore from './normalisation-rule-store';
import SelectionInfoRegistry from './selection-info-registry';
import TextResourceUtil from './text-resource-util';
import CommandAdaptor from './adaptors/command';
import DiffTitleBuilder from './diff-title-builder';

export default class DiffPresenter {
    private readonly textResourceUtil: TextResourceUtil;
    private readonly diffTitleBuilder: DiffTitleBuilder;
    private readonly commandAdaptor: CommandAdaptor;

    constructor(selectionInfoRegistry: SelectionInfoRegistry,
                normalisationRuleStore: NormalisationRuleStore,
                commandAdaptor: CommandAdaptor,
                getCurrentDate: () => Date) {
        this.textResourceUtil = new TextResourceUtil(getCurrentDate);
        this.diffTitleBuilder = new DiffTitleBuilder(normalisationRuleStore, selectionInfoRegistry);
        this.commandAdaptor = commandAdaptor;
    }

    takeDiff(textKey1: string, textKey2: string) {
        const getUri = (textKey: string) => this.textResourceUtil.getUri(textKey);
        const title = this.diffTitleBuilder.build(textKey1, textKey2);
        return this.commandAdaptor.executeCommand('vscode.diff', getUri(textKey1), getUri(textKey2), title);
    }
}
