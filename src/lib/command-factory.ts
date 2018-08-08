import SaveText1Command from './commands/save-text-1';
import CompareSelectionWithText1Command from './commands/compare-selection-with-text1';
import CompareSelectionWithClipboardCommand from './commands/compare-selection-with-clipboard';
import CompareVisibleEditorsCommand from './commands/compare-visible-editors';
import TextTitleBuilder from './text-title-builder';
import Clipboard from './clipboard';
import DiffPresenter from './diff-presenter';
import MessageBar from './message-bar';
import NormalisationRulePicker from './normalisation-rule-picker';
import SelectionInfoBuilder from './selection-info-builder';
import ToggleNormalisationRulesCommand from './commands/toggle-normalisation-rules';
import NormalisationRuleStore from './normalisation-rule-store';
import SelectionInfoRegistry from './selection-info-registry';
import TextResourceUtil from './text-resource-util';
import * as clipboardy from 'clipboardy';
import {Logger} from './logger';
import {Command} from './commands/command';
import CommandWrapper from './command-wrapper';

export default class CommandFactory {
    private readonly normalisationRuleStore: NormalisationRuleStore;
    private readonly selectionInfoRegistry: SelectionInfoRegistry;
    private readonly textResourceUtil: TextResourceUtil;
    private readonly vscode: any;
    private readonly logger: Logger;
    private clipboard?: Clipboard;
    private diffPresenter?: DiffPresenter;
    private messageBar?: MessageBar;
    private selectionInfoBuilder?: SelectionInfoBuilder;

    constructor(selectionInfoRegistry: SelectionInfoRegistry,
                normalisationRuleStore: NormalisationRuleStore,
                textResourceUtil: TextResourceUtil,
                vscode: any,
                logger: Logger) {
        this.normalisationRuleStore = normalisationRuleStore;
        this.selectionInfoRegistry = selectionInfoRegistry;
        this.textResourceUtil = textResourceUtil;
        this.vscode = vscode;
        this.logger = logger;
    }

    crateSaveText1Command() {
        return this.wrapCommand(new SaveText1Command(
            this.getSelectionInfoBuilder(),
            this.selectionInfoRegistry,
            this.logger
        ));
    }

    createCompareSelectionWithText1Command() {
        return this.wrapCommand(new CompareSelectionWithText1Command(
            this.getDiffPresenter(),
            this.getSelectionInfoBuilder(),
            this.selectionInfoRegistry,
            this.logger
        ));
    }

    createCompareSelectionWithClipboardCommand() {
        return this.wrapCommand(new CompareSelectionWithClipboardCommand(
            this.getDiffPresenter(),
            this.getSelectionInfoBuilder(),
            this.selectionInfoRegistry,
            this.getClipboard()!,
            this.logger
        ));
    }

    createCompareVisibleEditorsCommand() {
        return this.wrapCommand(new CompareVisibleEditorsCommand(
            this.getDiffPresenter(),
            this.getSelectionInfoBuilder(),
            this.selectionInfoRegistry,
            this.getMessageBar(),
            this.vscode.window,
            this.logger
        ));
    }

    createToggleNormalisationRulesCommand() {
        return this.wrapCommand(new ToggleNormalisationRulesCommand(
            this.normalisationRuleStore,
            new NormalisationRulePicker(this.vscode.window),
            this.getMessageBar(),
            this.logger
        ));
    }

    private wrapCommand(command: Command): CommandWrapper {
        return new CommandWrapper(command, this.logger);
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

    private getSelectionInfoBuilder() {
        this.selectionInfoBuilder =
            this.selectionInfoBuilder || new SelectionInfoBuilder();
        return this.selectionInfoBuilder;
    }

    private createClipboard() {
        return new Clipboard(clipboardy, process.platform);
    }

    private createDiffPresenter() {
        return new DiffPresenter(
            this.vscode.commands,
            this.selectionInfoRegistry,
            this.normalisationRuleStore,
            new TextTitleBuilder(),
            this.textResourceUtil
        );
    }

    private createMessageBar() {
        return new MessageBar(this.vscode.window);
    }
}
