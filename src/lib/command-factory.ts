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

export default class CommandFactory {
  private readonly _normalisationRuleStore: NormalisationRuleStore;
  private readonly _selectionInfoRegistry: SelectionInfoRegistry;
  private readonly _textResourceUtil: TextResourceUtil;
  private readonly _vscode: any;
  private readonly _logger: Console;
  private _clipboard: Clipboard;
  private _diffPresenter: DiffPresenter;
  private _messageBar: MessageBar;
  private _selectionInfoBuilder: SelectionInfoBuilder;

  constructor (params) {
    this._normalisationRuleStore = params.normalisationRuleStore;
    this._selectionInfoRegistry = params.selectionInfoRegistry;
    this._textResourceUtil = params.textResourceUtil;
    this._vscode = params.vscode;
    this._logger = params.logger;
  }

  crateSaveText1Command () {
    return new SaveText1Command({
      selectionInfoRegistry: this._selectionInfoRegistry,
      selectionInfoBuilder: this._getSelectionInfoBuilder(),
      logger: this._logger
    });
  }

  createCompareSelectionWithText1Command () {
    return new CompareSelectionWithText1Command({
      selectionInfoRegistry: this._selectionInfoRegistry,
      diffPresenter: this._getDiffPresenter(),
      selectionInfoBuilder: this._getSelectionInfoBuilder(),
      logger: this._logger
    });
  }

  createCompareSelectionWithClipboardCommand () {
    return new CompareSelectionWithClipboardCommand({
      selectionInfoRegistry: this._selectionInfoRegistry,
      diffPresenter: this._getDiffPresenter(),
      selectionInfoBuilder: this._getSelectionInfoBuilder(),
      logger: this._logger,
      clipboard: this._getClipboard()
    });
  }

  createCompareVisibleEditorsCommand () {
    return new CompareVisibleEditorsCommand({
      diffPresenter: this._getDiffPresenter(),
      editorWindow: this._vscode.window,
      logger: this._logger,
      messageBar: this._getMessageBar(),
      selectionInfoRegistry: this._selectionInfoRegistry,
      selectionInfoBuilder: this._getSelectionInfoBuilder()
    });
  }

  createToggleNormalisationRulesCommand () {
    return new ToggleNormalisationRulesCommand({
      logger: this._logger,
      messageBar: this._getMessageBar(),
      normalisationRulePicker: new NormalisationRulePicker({
        vscWindow: this._vscode.window
      }),
      normalisationRuleStore: this._normalisationRuleStore
    });
  }

  private _getClipboard () {
    this._clipboard = this._clipboard || this._createClipboard();
    return this._clipboard;
  }

  private _getDiffPresenter () {
    this._diffPresenter = this._diffPresenter || this._createDiffPresenter();
    return this._diffPresenter;
  }

  private _getMessageBar () {
    this._messageBar = this._messageBar || this._createMessageBar();
    return this._messageBar;
  }

  private _getSelectionInfoBuilder () {
    this._selectionInfoBuilder =
      this._selectionInfoBuilder || new SelectionInfoBuilder();
    return this._selectionInfoBuilder;
  }

  private _createClipboard () {
    return new Clipboard({
      clipboardy,
      platform: process.platform
    });
  }

  private _createDiffPresenter () {
    return new DiffPresenter({
      commands: this._vscode.commands,
      normalisationRuleStore: this._normalisationRuleStore,
      selectionInfoRegistry: this._selectionInfoRegistry,
      textResourceUtil: this._textResourceUtil,
      textTitleBuilder: new TextTitleBuilder()
    });
  }

  private _createMessageBar () {
    return new MessageBar({
      vscWindow: this._vscode.window
    });
  }
}
