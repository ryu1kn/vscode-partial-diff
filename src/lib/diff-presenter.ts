import NormalisationRuleStore from './normalisation-rule-store';
import SelectionInfoRegistry from './selection-info-registry';
import {makeUri} from './utils/text-resource';
import CommandAdaptor from './adaptors/command';
import DiffTitleBuilder from './diff-title-builder';
import {PartialDiffFileSystem} from './file-system-provider';

export default class DiffPresenter {
    private readonly diffTitleBuilder: DiffTitleBuilder;
    private readonly commandAdaptor: CommandAdaptor;
    private readonly partialDiffFileSystem: PartialDiffFileSystem;
    private readonly selectionInfoRegistry: SelectionInfoRegistry;

    constructor(selectionInfoRegistry: SelectionInfoRegistry,
                normalisationRuleStore: NormalisationRuleStore,
                partialDiffFileSystem: PartialDiffFileSystem,
                commandAdaptor: CommandAdaptor) {
        this.partialDiffFileSystem = partialDiffFileSystem;
        this.diffTitleBuilder = new DiffTitleBuilder(normalisationRuleStore, selectionInfoRegistry);
        this.selectionInfoRegistry = selectionInfoRegistry;
        this.commandAdaptor = commandAdaptor;
    }

    takeDiff(textKey1: string, textKey2: string): Promise<{}> {
        const getUri = (textKey: string) => makeUri(textKey);
        this.partialDiffFileSystem.writeFile(getUri(textKey1), Buffer.from(this.selectionInfoRegistry.get(textKey1).text), {create: true, overwrite: true});
        this.partialDiffFileSystem.writeFile(getUri(textKey2), Buffer.from(this.selectionInfoRegistry.get(textKey2).text), {create: true, overwrite: true});
        const title = this.diffTitleBuilder.build(textKey1, textKey2);
        return this.commandAdaptor.executeCommand('vscode.diff', getUri(textKey1), getUri(textKey2), title);
    }
}
