import CommandFactory from './command-factory';
import ContentProvider from './content-provider';
import { EXTENSION_NAMESPACE, EXTENSION_SCHEME } from './const';

export default class Bootstrapper {
  private readonly _commandFactory: CommandFactory;
  private readonly _contentProvider: ContentProvider;
  private readonly _vscode: any;

  constructor (params) {
    this._commandFactory = params.commandFactory;
    this._contentProvider = params.contentProvider;
    this._vscode = params.vscode;
  }

  initiate (context) {
    this._registerProviders(context);
    this._registerCommands(context);
  }

  private _registerProviders (context) {
    const disposable = this._vscode.workspace.registerTextDocumentContentProvider(
      EXTENSION_SCHEME,
      this._contentProvider
    );
    context.subscriptions.push(disposable);
  }

  private _registerCommands (context) {
    this._commandList.forEach(cmd => {
      const registerer = this._getCommandRegisterer(cmd.type);
      const disposable = registerer(cmd.name, cmd.command.execute, cmd.command);
      context.subscriptions.push(disposable);
    });
  }

  private _getCommandRegisterer (commandType) {
    return commandType === 'TEXT_EDITOR'
      ? this._vscode.commands.registerTextEditorCommand
      : this._vscode.commands.registerCommand;
  }

  private get _commandList () {
    return [
      {
        name: `${EXTENSION_NAMESPACE}.diffVisibleEditors`,
        type: 'GENERAL',
        command: this._commandFactory.createCompareVisibleEditorsCommand()
      },
      {
        name: `${EXTENSION_NAMESPACE}.markSection1`,
        type: 'TEXT_EDITOR',
        command: this._commandFactory.crateSaveText1Command()
      },
      {
        name: `${EXTENSION_NAMESPACE}.markSection2AndTakeDiff`,
        type: 'TEXT_EDITOR',
        command: this._commandFactory.createCompareSelectionWithText1Command()
      },
      {
        name: `${EXTENSION_NAMESPACE}.diffSelectionWithClipboard`,
        type: 'TEXT_EDITOR',
        command: this._commandFactory.createCompareSelectionWithClipboardCommand()
      },
      {
        name: `${EXTENSION_NAMESPACE}.togglePreComparisonTextNormalizationRules`,
        type: 'GENERAL',
        command: this._commandFactory.createToggleNormalisationRulesCommand()
      }
    ];
  }
}
