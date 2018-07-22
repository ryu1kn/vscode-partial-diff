const { expect, when, mockObject } = require('../helpers')

const Bootstrapper = require('../../lib/bootstrapper')

suite('Bootstrapper', () => {
  const commandMap = {
    saveText1Command: fakeExtensionCommand(),
    compareSelectionWithText1Command: fakeExtensionCommand(),
    compareSelectionWithClipboardCommand: fakeExtensionCommand(),
    compareVisibleEditorsCommand: fakeExtensionCommand(),
    toggleNormalisationRulesCommand: fakeExtensionCommand()
  }
  const bootstrapper = new Bootstrapper({
    commandFactory: fakeCommandFactory(),
    contentProvider: 'CONTENT_PROVIDER',
    vscode: {
      commands: fakeVSCodeCommands(),
      workspace: fakeVSCodeWorkspace()
    }
  })

  test('it registers commands', () => {
    const context = { subscriptions: [] }
    bootstrapper.initiate(context)

    expect(context.subscriptions).to.eql([
      'DISPOSABLE_scheme',
      'DISPOSABLE_diffVisibleEditors',
      'DISPOSABLE_markSection1',
      'DISPOSABLE_markSection2AndTakeDiff',
      'DISPOSABLE_diffSelectionWithClipboard',
      'DISPOSABLE_togglePreComparisonTextNormalizationRules'
    ])
  })

  function fakeVSCodeCommands () {
    const commands = mockObject([
      'registerCommand',
      'registerTextEditorCommand'
    ])
    when(
      commands.registerCommand(
        'extension.partialDiff.diffVisibleEditors',
        commandMap.compareVisibleEditorsCommand.execute,
        commandMap.compareVisibleEditorsCommand
      )
    ).thenReturn('DISPOSABLE_diffVisibleEditors')
    when(
      commands.registerTextEditorCommand(
        'extension.partialDiff.markSection1',
        commandMap.saveText1Command.execute,
        commandMap.saveText1Command
      )
    ).thenReturn('DISPOSABLE_markSection1')
    when(
      commands.registerTextEditorCommand(
        'extension.partialDiff.markSection2AndTakeDiff',
        commandMap.compareSelectionWithText1Command.execute,
        commandMap.compareSelectionWithText1Command
      )
    ).thenReturn('DISPOSABLE_markSection2AndTakeDiff')
    when(
      commands.registerTextEditorCommand(
        'extension.partialDiff.diffSelectionWithClipboard',
        commandMap.compareSelectionWithClipboardCommand.execute,
        commandMap.compareSelectionWithClipboardCommand
      )
    ).thenReturn('DISPOSABLE_diffSelectionWithClipboard')
    when(
      commands.registerCommand(
        'extension.partialDiff.togglePreComparisonTextNormalizationRules',
        commandMap.toggleNormalisationRulesCommand.execute,
        commandMap.toggleNormalisationRulesCommand
      )
    ).thenReturn('DISPOSABLE_togglePreComparisonTextNormalizationRules')
    return commands
  }

  function fakeCommandFactory () {
    return {
      crateSaveText1Command: () => commandMap.saveText1Command,
      createCompareSelectionWithText1Command: () =>
        commandMap.compareSelectionWithText1Command,
      createCompareSelectionWithClipboardCommand: () =>
        commandMap.compareSelectionWithClipboardCommand,
      createCompareVisibleEditorsCommand: () =>
        commandMap.compareVisibleEditorsCommand,
      createToggleNormalisationRulesCommand: () =>
        commandMap.toggleNormalisationRulesCommand
    }
  }

  function fakeVSCodeWorkspace () {
    const vsWorkspace = mockObject('registerTextDocumentContentProvider')
    when(
      vsWorkspace.registerTextDocumentContentProvider(
        'partialdiff',
        'CONTENT_PROVIDER'
      )
    ).thenReturn('DISPOSABLE_scheme')
    return vsWorkspace
  }

  function fakeExtensionCommand () {
    return { execute: () => {} }
  }
})
