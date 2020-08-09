import SaveText1Command from './commands/save-text-1';
import CompareSelectionWithText1Command from './commands/compare-selection-with-text1';
import CompareSelectionWithClipboardCommand from './commands/compare-selection-with-clipboard';
import CompareWithGitBranchCommand from './commands/compare-with-git-branch';
import CompareVisibleEditorsCommand from './commands/compare-visible-editors';
import DiffPresenter from './diff-presenter';
import BranchManager from './branch-manager';
import ToggleNormalisationRulesCommand from './commands/toggle-normalisation-rules';
import NormalisationRuleStore from './normalisation-rule-store';
import SelectionInfoRegistry from './selection-info-registry';
import CommandAdaptor from './adaptors/command';
import WindowAdaptor from './adaptors/window';
import GitAdaptor from './adaptors/git';
import {Command} from './commands/command';
import * as vscode from 'vscode';

export default class CommandFactory {
    private diffPresenter?: DiffPresenter;
    private branchManager?: BranchManager;

    constructor(private readonly selectionInfoRegistry: SelectionInfoRegistry,
                private readonly normalisationRuleStore: NormalisationRuleStore,
                private readonly commandAdaptor: CommandAdaptor,
                private readonly windowAdaptor: WindowAdaptor,
                private readonly gitAdaptor: GitAdaptor,
                private readonly clipboard: typeof vscode.env.clipboard,
                private readonly getCurrentDate: () => Date) {
    }

    crateSaveText1Command(): Command {
        return new SaveText1Command(this.selectionInfoRegistry);
    }

    createCompareSelectionWithText1Command(): Command {
        return new CompareSelectionWithText1Command(
            this.getDiffPresenter(),
            this.selectionInfoRegistry
        );
    }

    createCompareWithBranchCommand(): Command {
       return new CompareWithGitBranchCommand(
           this.getDiffPresenter(),
           this.selectionInfoRegistry,
           this.getBranchManager()
       );
    }

    createCompareSelectionWithClipboardCommand(): Command {
        return new CompareSelectionWithClipboardCommand(
            this.getDiffPresenter(),
            this.selectionInfoRegistry,
            this.clipboard
        );
    }

    createCompareVisibleEditorsCommand(): Command {
        return new CompareVisibleEditorsCommand(
            this.getDiffPresenter(),
            this.selectionInfoRegistry,
            this.windowAdaptor
        );
    }

    createToggleNormalisationRulesCommand(): Command {
        return new ToggleNormalisationRulesCommand(
            this.normalisationRuleStore,
            this.windowAdaptor
        );
    }

    private getDiffPresenter(): DiffPresenter {
        this.diffPresenter = this.diffPresenter || this.createDiffPresenter();
        return this.diffPresenter;
    }

    private getBranchManager(): BranchManager {
        this.branchManager = this.branchManager || this.createBranchManager();
        return this.branchManager;
    }

    private createBranchManager(): BranchManager {
        return new BranchManager(
            this.gitAdaptor,
            this.windowAdaptor
        );
    }

    private createDiffPresenter(): DiffPresenter {
        return new DiffPresenter(
            this.selectionInfoRegistry,
            this.normalisationRuleStore,
            this.commandAdaptor,
            this.getCurrentDate
        );
    }
}
