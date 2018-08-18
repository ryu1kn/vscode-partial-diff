import SaveText1Command from './commands/save-text-1';
import CompareSelectionWithText1Command from './commands/compare-selection-with-text1';
import CompareSelectionWithClipboardCommand from './commands/compare-selection-with-clipboard';
import CompareVisibleEditorsCommand from './commands/compare-visible-editors';
import TextTitleBuilder from './text-title-builder';
import Clipboard from './clipboard';
import DiffPresenter from './diff-presenter';
import NormalisationRulePicker from './normalisation-rule-picker';
import ToggleNormalisationRulesCommand from './commands/toggle-normalisation-rules';
import NormalisationRuleStore from './normalisation-rule-store';
import SelectionInfoRegistry from './selection-info-registry';
import * as clipboardy from 'clipboardy';
import CommandAdaptor from './adaptors/command';
import WindowAdaptor from './adaptors/window';

export default class CommandFactory {
    private readonly normalisationRuleStore: NormalisationRuleStore;
    private readonly selectionInfoRegistry: SelectionInfoRegistry;
    private readonly commandAdaptor: CommandAdaptor;
    private readonly windowAdaptor: WindowAdaptor;
    private readonly getCurrentDate: () => Date;
    private clipboard?: Clipboard;
    private diffPresenter?: DiffPresenter;

    constructor(selectionInfoRegistry: SelectionInfoRegistry,
                normalisationRuleStore: NormalisationRuleStore,
                commandAdaptor: CommandAdaptor,
                windowAdaptor: WindowAdaptor,
                getCurrentDate: () => Date) {
        this.normalisationRuleStore = normalisationRuleStore;
        this.selectionInfoRegistry = selectionInfoRegistry;
        this.commandAdaptor = commandAdaptor;
        this.windowAdaptor = windowAdaptor;
        this.getCurrentDate = getCurrentDate;
    }

    crateSaveText1Command() {
        return new SaveText1Command(this.selectionInfoRegistry);
    }

    createCompareSelectionWithText1Command() {
        return new CompareSelectionWithText1Command(
            this.getDiffPresenter(),
            this.selectionInfoRegistry
        );
    }

    createCompareSelectionWithClipboardCommand() {
        return new CompareSelectionWithClipboardCommand(
            this.getDiffPresenter(),
            this.selectionInfoRegistry,
            this.getClipboard()!
        );
    }

    createCompareVisibleEditorsCommand() {
        return new CompareVisibleEditorsCommand(
            this.getDiffPresenter(),
            this.selectionInfoRegistry,
            this.windowAdaptor
        );
    }

    createToggleNormalisationRulesCommand() {
        return new ToggleNormalisationRulesCommand(
            this.normalisationRuleStore,
            new NormalisationRulePicker(this.windowAdaptor),
            this.windowAdaptor
        );
    }

    private getClipboard() {
        this.clipboard = this.clipboard || this.createClipboard();
        return this.clipboard;
    }

    private getDiffPresenter() {
        this.diffPresenter = this.diffPresenter || this.createDiffPresenter();
        return this.diffPresenter;
    }

    private createClipboard() {
        return new Clipboard(clipboardy, process.platform);
    }

    private createDiffPresenter() {
        return new DiffPresenter(
            this.selectionInfoRegistry,
            this.normalisationRuleStore,
            new TextTitleBuilder(),
            this.commandAdaptor,
            this.getCurrentDate
        );
    }
}
