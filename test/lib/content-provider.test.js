const ContentProvider = require('../../lib/content-provider')

suite('ContentProvider', () => {
  test('it extracts text key from the given uri and uses it to retrieve text', () => {
    const content = retrieveEditorContent({})
    expect(content).to.eql('TEXT_1')
  })

  test('it returns an empty string if a text is not yet selected', () => {
    const selectionInfoRegistry = { get: () => {} }
    const content = retrieveEditorContent({ selectionInfoRegistry })
    expect(content).to.eql('')
  })

  test('it uses a user defined rule to preprocess text to compare', () => {
    const activeRules = [{ match: '_', replaceWith: ':' }]
    const content = retrieveEditorContent({ activeRules })
    expect(content).to.eql('TEXT:1')
  })

  test('it replaces all occurence of specified pattern', () => {
    const activeRules = [{ match: 'T', replaceWith: 't' }]
    const content = retrieveEditorContent({ activeRules })
    expect(content).to.eql('tEXt_1')
  })

  test('it can use part of matched text as replace text', () => {
    const activeRules = [{ match: '(TE)(XT)', replaceWith: '$2$1' }]
    const content = retrieveEditorContent({ activeRules })
    expect(content).to.eql('XTTE_1')
  })

  test('it can change matched text to lower case', () => {
    const activeRules = [
      {
        match: 'TE',
        replaceWith: { letterCase: 'lower' }
      }
    ]
    const content = retrieveEditorContent({ activeRules })
    expect(content).to.eql('teXT_1')
  })

  test('it can change all characters to upper case', () => {
    const activeRules = [
      {
        match: 'Register',
        replaceWith: { letterCase: 'upper' }
      }
    ]
    const content = retrieveEditorContent({
      activeRules,
      registeredText: 'Registered Text'
    })
    expect(content).to.eql('REGISTERed Text')
  })

  test('it applies all given rules to preprocess text', () => {
    const activeRules = [
      { match: '_', replaceWith: ':' },
      { match: 'T', replaceWith: 't' }
    ]
    const content = retrieveEditorContent({ activeRules })
    expect(content).to.eql('tEXt:1')
  })

  function retrieveEditorContent ({
    selectionInfoRegistry,
    activeRules,
    registeredText
  }) {
    const defaultSelectionInfoRegistry = {
      get: key => ({ text: registeredText || `TEXT_${key}` })
    }
    const textResourceUtil = { getTextKey: uri => uri.replace('URI_', '') }
    const normalisationRuleStore = { activeRules: activeRules || [] }
    const contentProvider = new ContentProvider({
      selectionInfoRegistry:
        selectionInfoRegistry || defaultSelectionInfoRegistry,
      textResourceUtil,
      normalisationRuleStore
    })
    return contentProvider.provideTextDocumentContent('URI_1')
  }
})
