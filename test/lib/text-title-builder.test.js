const { expect } = require('../helpers')

const TextTitleBuilder = require('../../lib/text-title-builder')

suite('TextTitleBuilder', () => {
  test('it uses both file name and line numbers', () => {
    const textInfo = {
      fileName: 'FILE_NAME',
      lineRanges: [{ start: 0, end: 1 }]
    }
    const textTitleBuilder = new TextTitleBuilder()
    expect(textTitleBuilder.build(textInfo)).to.eql('FILE_NAME (ll.1-2)')
  })

  test('it shows only one line number', () => {
    const textInfo = {
      fileName: 'FILE_NAME',
      lineRanges: [{ start: 10, end: 10 }]
    }
    const textTitleBuilder = new TextTitleBuilder()
    expect(textTitleBuilder.build(textInfo)).to.eql('FILE_NAME (l.11)')
  })

  test('it uses all line ranges to build title', () => {
    const textInfo = {
      fileName: 'FILE_NAME',
      lineRanges: [{ start: 0, end: 1 }, { start: 5, end: 7 }]
    }
    const textTitleBuilder = new TextTitleBuilder()
    expect(textTitleBuilder.build(textInfo)).to.eql('FILE_NAME (ll.1-2,ll.6-8)')
  })

  test('it uses only file name if line numbers are not available', () => {
    const textInfo = {
      fileName: 'FILE_NAME',
      lineRanges: []
    }
    const textTitleBuilder = new TextTitleBuilder()
    expect(textTitleBuilder.build(textInfo)).to.eql('FILE_NAME')
  })

  test('it uses "N/A" as text tile if text is not yet registered', () => {
    const textInfo = null
    const textTitleBuilder = new TextTitleBuilder()
    expect(textTitleBuilder.build(textInfo)).to.eql('N/A')
  })
})
