import NormalisationRuleStore from './normalisation-rule-store';
import SelectionInfoRegistry from './selection-info-registry';
import {makeUriString} from './utils/text-resource';
import CommandAdaptor from './adaptors/command';
import DiffTitleBuilder from './diff-title-builder';
import WorkspaceAdaptor from './adaptors/workspace';
import WindowAdaptor from './adaptors/window';
import EditableDiffSessionManager from './editable-diff-session-manager';

export default class DiffPresenter {
    private readonly diffTitleBuilder: DiffTitleBuilder;

    constructor(private readonly selectionInfoRegistry: SelectionInfoRegistry,
                normalisationRuleStore: NormalisationRuleStore,
                private readonly workspaceAdaptor: WorkspaceAdaptor,
                private readonly commandAdaptor: CommandAdaptor,
                private readonly windowAdaptor: WindowAdaptor,
                private readonly editableDiffSessionManager: EditableDiffSessionManager,
                private readonly getCurrentDate: () => Date) {
        this.diffTitleBuilder = new DiffTitleBuilder(normalisationRuleStore, selectionInfoRegistry);
    }

    async takeDiff(textKey1: string, textKey2: string): Promise<{} | undefined | void> {
        const editableDiffsEnabled = this.workspaceAdaptor.get<boolean>('enableEditableDiffs');
        if (editableDiffsEnabled) {
            const left = this.selectionInfoRegistry.get(textKey1);
            const right = this.selectionInfoRegistry.get(textKey2);
            if (left.lineRanges.length > 1 || right.lineRanges.length > 1) {
                await this.windowAdaptor.showInformationMessage(
                    'Editable mode does not support multi-selection compare. Falling back to read-only diff.'
                );
            } else {
                const title = this.diffTitleBuilder.build(textKey1, textKey2, false);
                await this.editableDiffSessionManager.openDiff(textKey1, textKey2, title);
                return;
            }
        }
        const getUri = (textKey: string) => makeUriString(textKey, this.getCurrentDate());
        const title = this.diffTitleBuilder.build(textKey1, textKey2);
        return this.commandAdaptor.executeCommand('vscode.diff', getUri(textKey1), getUri(textKey2), title);
    }
}
