const Bootstrapper = require('../../lib/bootstrapper')

suite('Bootstrapper', () => {
  test('it registers commands', () => {
    const commandFactory = {
      crateSaveText1Command: () => ({
        execute: () => 'saveSelectionAsText1 called'
      }),
      createCompareSelectionWithText1Command: () => ({
        execute: () => 'saveSelectionAsText2AndTakeDiff called'
      }),
      createCompareSelectionWithClipboardCommand: () => ({
        execute: () => 'diffSelectionWithClipboard called'
      }),
      createCompareVisibleEditorsCommand: () => ({
        execute: () => 'diffVisibleEditors called'
      })
    }
    const commands = fakeVSCodeCommands()
    const workspace = fakeVSCodeWorkspace()
    const vscode = { commands, workspace }
    const contentProvider = 'CONTENT_PROVIDER'
    const context = { subscriptions: [] }
    new Bootstrapper({ commandFactory, contentProvider, vscode }).initiate(
      context
    )

    expect(
      commands._invokeCommand('extension.partialDiff.markSection1')
    ).to.eql('saveSelectionAsText1 called')
    expect(
      commands._invokeCommand('extension.partialDiff.markSection2AndTakeDiff')
    ).to.eql('saveSelectionAsText2AndTakeDiff called')
    expect(
      commands._invokeCommand(
        'extension.partialDiff.diffSelectionWithClipboard'
      )
    ).to.eql('diffSelectionWithClipboard called')
    expect(
      commands._invokeCommand(
        'extension.partialDiff.diffVisibleEditors'
      )
    ).to.eql('diffVisibleEditors called')
    expect(
      workspace.registerTextDocumentContentProvider
    ).to.have.been.calledWith('partialdiff', 'CONTENT_PROVIDER')
    expect(context.subscriptions).to.eql([
      'DISPOSABLE_scheme',
      'DISPOSABLE_E_extension.partialDiff.diffVisibleEditors',
      'DISPOSABLE_TE_extension.partialDiff.markSection1',
      'DISPOSABLE_TE_extension.partialDiff.markSection2AndTakeDiff',
      'DISPOSABLE_TE_extension.partialDiff.diffSelectionWithClipboard'
    ])
  })

  function fakeVSCodeCommands () {
    return {
      registerCommand: function (commandId, commandFn) {
        this[commandId] = commandFn
        return `DISPOSABLE_E_${commandId}`
      },
      registerTextEditorCommand: function (commandId, commandFn) {
        this[commandId] = commandFn
        return `DISPOSABLE_TE_${commandId}`
      },
      _invokeCommand: function (commandId) {
        return this[commandId]()
      }
    }
  }

  function fakeVSCodeWorkspace () {
    return {
      registerTextDocumentContentProvider: sinon
        .stub()
        .returns('DISPOSABLE_scheme')
    }
  }
})
