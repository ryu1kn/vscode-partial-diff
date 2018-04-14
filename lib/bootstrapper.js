const { EXTENSION_SCHEME, EXTENSION_NAMESPACE } = require('./const')

class Bootstrapper {
  constructor (params) {
    this._commandFactory = params.commandFactory
    this._contentProvider = params.contentProvider
    this._vscode = params.vscode
  }

  initiate (context) {
    this._registerProviders(context)
    this._registerCommands(context)
    this._registerEditorCommands(context)
  }

  _registerProviders (context) {
    const disposable = this._vscode.workspace.registerTextDocumentContentProvider(
      EXTENSION_SCHEME,
      this._contentProvider
    )
    context.subscriptions.push(disposable)
  }

  _registerCommands (context) {
    const command = this._commandFactory.createCompareVisibleEditorsCommand()
    const disposable = this._vscode.commands.registerCommand(
      `${EXTENSION_NAMESPACE}.diffVisibleEditors`,
      command.execute,
      command
    )
    context.subscriptions.push(disposable)
  }

  _registerEditorCommands (context) {
    const factory = this._commandFactory
    const commandMap = new Map([
      [`${EXTENSION_NAMESPACE}.markSection1`, factory.crateSaveText1Command()],
      [
        `${EXTENSION_NAMESPACE}.markSection2AndTakeDiff`,
        factory.createCompareSelectionWithText1Command()
      ],
      [
        `${EXTENSION_NAMESPACE}.diffSelectionWithClipboard`,
        factory.createCompareSelectionWithClipboardCommand()
      ]
    ])
    commandMap.forEach((command, commandName) => {
      const handler = command.execute.bind(command)
      const disposable = this._vscode.commands.registerTextEditorCommand(
        commandName,
        handler
      )
      context.subscriptions.push(disposable)
    })
  }
}

module.exports = Bootstrapper
