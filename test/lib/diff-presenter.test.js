const { mockObject, verify, when, any } = require('../helpers')

const DiffPresenter = require('../../lib/diff-presenter')

suite('DiffPresenter', () => {
  test('it passes URI of 2 texts to compare', async () => {
    const commands = fakeCommands()

    const textResourceUtil = mockObject('getUri')
    when(textResourceUtil.getUri('TEXT1')).thenReturn('URI_INSTANCE_1')
    when(textResourceUtil.getUri('TEXT2')).thenReturn('URI_INSTANCE_2')

    const diffPresenter = new DiffPresenter({
      commands,
      normalisationRuleStore: {},
      textTitleBuilder: { build: () => {} },
      selectionInfoRegistry: { get: () => {} },
      textResourceUtil
    })

    await diffPresenter.takeDiff('TEXT1', 'TEXT2')

    verify(commands.executeCommand(
      'vscode.diff',
      'URI_INSTANCE_1',
      'URI_INSTANCE_2',
      'undefined \u2194 undefined'
    ))
  })

  test('it builds up diff view title by using TextTitleBuilder', async () => {
    const commands = fakeCommands()

    const selectionInfoRegistry = mockObject('get')
    when(selectionInfoRegistry.get('TEXT1')).thenReturn('TEXT_INFO_1')
    when(selectionInfoRegistry.get('TEXT2')).thenReturn('TEXT_INFO_2')

    const diffPresenter = new DiffPresenter({
      commands,
      normalisationRuleStore: {},
      textTitleBuilder: { build: textKey => `TITLE_${textKey}` },
      selectionInfoRegistry,
      textResourceUtil: { getUri: () => {} }
    })

    await diffPresenter.takeDiff('TEXT1', 'TEXT2')

    verify(commands.executeCommand(any(), any(), any(), 'TITLE_TEXT_INFO_1 \u2194 TITLE_TEXT_INFO_2'))
  })

  test('it uses \u007E if the comparison was done with text normalisation', async () => {
    const commands = fakeCommands()
    const selectionInfoRegistry = mockObject('get')
    when(selectionInfoRegistry.get('TEXT1')).thenReturn('TEXT_INFO_1')
    when(selectionInfoRegistry.get('TEXT2')).thenReturn('TEXT_INFO_2')

    const diffPresenter = new DiffPresenter({
      commands,
      normalisationRuleStore: { hasActiveRules: true },
      textTitleBuilder: { build: textKey => `TITLE_${textKey}` },
      selectionInfoRegistry,
      textResourceUtil: { getUri: () => {} }
    })

    await diffPresenter.takeDiff('TEXT1', 'TEXT2')

    verify(commands.executeCommand(any(), any(), any(), 'TITLE_TEXT_INFO_1 \u007e TITLE_TEXT_INFO_2'))
  })

  function fakeCommands () {
    return mockObject('executeCommand')
  }
})
