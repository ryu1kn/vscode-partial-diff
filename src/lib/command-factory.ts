import SaveText1Command from './commands/save-text-1';
import CompareSelectionWithText1Command from './commands/compare-selection-with-text1';
import CompareSelectionWithClipboardCommand from './commands/compare-selection-with-clipboard';
import CompareVisibleEditorsCommand from './commands/compare-visible-editors';
import TextTitleBuilder from './text-title-builder';
import Clipboard from './clipboard';
import DiffPresenter from './diff-presenter';
import MessageBar from './message-bar';
import NormalisationRulePicker from './normalisation-rule-picker';
import ToggleNormalisationRulesCommand from './commands/toggle-normalisation-rules';
import NormalisationRuleStore from './normalisation-rule-store';
import SelectionInfoRegistry from './selection-info-registry';
import * as clipboardy from 'clipboardy';
import CommandAdaptor from './adaptors/command';
import WindowComponent from './adaptors/window';

export default class CommandFactory {
    private readonly normalisationRuleStore: NormalisationRuleStore;
    private readonly selectionInfoRegistry: SelectionInfoRegistry;
    private readonly commandAdaptor: CommandAdaptor;
    private readonly windowComponent: WindowComponent;
    private readonly vscode: any;
    private readonly getCurrentDate: () => Date;
    private clipboard?: Clipboard;
    private diffPresenter?: DiffPresenter;
    private messageBar?: MessageBar;

    constructor(selectionInfoRegistry: SelectionInfoRegistry,
                normalisationRuleStore: NormalisationRuleStore,
                commandAdaptor: CommandAdaptor,
                windowComponent: WindowComponent,
                vscode: any,
                getCurrentDate: () => Date) {
        this.normalisationRuleStore = normalisationRuleStore;
        this.selectionInfoRegistry = selectionInfoRegistry;
        this.commandAdaptor = commandAdaptor;
        this.windowComponent = windowComponent;
        this.getCurrentDate = getCurrentDate;
        this.vscode = vscode;
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
            this.getMessageBar(),
            this.windowComponent
        );
    }

    createToggleNormalisationRulesCommand() {
        return new ToggleNormalisationRulesCommand(
            this.normalisationRuleStore,
            new NormalisationRulePicker(this.vscode.window),
            this.getMessageBar()
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

    private getMessageBar() {
        this.messageBar = this.messageBar || this.createMessageBar();
        return this.messageBar;
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

    private createMessageBar() {
        return new MessageBar(this.vscode.window);
    }
}
