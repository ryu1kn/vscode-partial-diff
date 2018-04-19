const DiffPresenter = require('../../lib/diff-presenter')

suite('DiffPresenter', () => {
  test('it passes URI of 2 texts to compare', async () => {
    const commands = fakeCommands()
    const textResourceUtil = {
      getUri: stubWithArgs(
        ['TEXT1'],
        'URI_INSTANCE_1',
        ['TEXT2'],
        'URI_INSTANCE_2'
      )
    }
    const diffPresenter = new DiffPresenter({
      commands,
      normalisationRuleStore: {},
      textTitleBuilder: { build: () => {} },
      selectionInfoRegistry: { get: () => {} },
      textResourceUtil
    })

    await diffPresenter.takeDiff('TEXT1', 'TEXT2')

    expect(commands.executeCommand).to.have.been.calledWith(
      'vscode.diff',
      'URI_INSTANCE_1',
      'URI_INSTANCE_2'
    )
  })

  test('it builds up diff view title by using TextTitleBuilder', async () => {
    const commands = fakeCommands()
    const selectionInfoRegistry = {
      get: stubWithArgs(['TEXT1'], 'TEXT_INFO_1', ['TEXT2'], 'TEXT_INFO_2')
    }
    const diffPresenter = new DiffPresenter({
      commands,
      normalisationRuleStore: {},
      textTitleBuilder: { build: textKey => `TITLE_${textKey}` },
      selectionInfoRegistry,
      textResourceUtil: { getUri: () => {} }
    })

    await diffPresenter.takeDiff('TEXT1', 'TEXT2')

    expect(commands.executeCommand.args[0][3]).to.eql(
      'TITLE_TEXT_INFO_1 \u2194 TITLE_TEXT_INFO_2'
    )
  })

  test('it uses \u007E if the comparison was done with text normalisation', async () => {
    const commands = fakeCommands()
    const selectionInfoRegistry = {
      get: stubWithArgs(['TEXT1'], 'TEXT_INFO_1', ['TEXT2'], 'TEXT_INFO_2')
    }
    const diffPresenter = new DiffPresenter({
      commands,
      normalisationRuleStore: { hasActiveRules: true },
      textTitleBuilder: { build: textKey => `TITLE_${textKey}` },
      selectionInfoRegistry,
      textResourceUtil: { getUri: () => {} }
    })

    await diffPresenter.takeDiff('TEXT1', 'TEXT2')

    expect(commands.executeCommand.args[0][3]).to.eql(
      'TITLE_TEXT_INFO_1 \u007e TITLE_TEXT_INFO_2'
    )
  })

  function fakeCommands () {
    return { executeCommand: sinon.stub().returns(Promise.resolve()) }
  }
})
