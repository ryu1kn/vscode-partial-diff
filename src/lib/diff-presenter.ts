import NormalisationRuleStore from './normalisation-rule-store';
import SelectionInfoRegistry from './selection-info-registry';
import {makeUriString} from './utils/text-resource';
import CommandAdaptor from './adaptors/command';
import DiffTitleBuilder from './diff-title-builder';

export default class DiffPresenter {
    private readonly diffTitleBuilder: DiffTitleBuilder;

    constructor(selectionInfoRegistry: SelectionInfoRegistry,
                normalisationRuleStore: NormalisationRuleStore,
                private readonly commandAdaptor: CommandAdaptor,
                private readonly getCurrentDate: () => Date) {
        this.getCurrentDate = getCurrentDate;
        this.diffTitleBuilder = new DiffTitleBuilder(normalisationRuleStore, selectionInfoRegistry);
        this.commandAdaptor = commandAdaptor;
    }

    takeDiff(textKey1: string, textKey2: string): Promise<{} | undefined> {
        const getUri = (textKey: string) => makeUriString(textKey, this.getCurrentDate());
        const title = this.diffTitleBuilder.build(textKey1, textKey2);
        return this.commandAdaptor.executeCommand('vscode.diff', getUri(textKey1), getUri(textKey2), title);
    }
}
