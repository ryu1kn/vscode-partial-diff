const {mockObject, verify} = require('../helpers')

const MessageBar = require('../../lib/message-bar')

suite('MessageBar', () => {
  const vscWindow = mockObject(['showInformationMessage'])
  const messageBar = new MessageBar({ vscWindow })

  test('it shows information message', async () => {
    await messageBar.showInfo('MESSAGE')

    verify(vscWindow.showInformationMessage('MESSAGE'))
  })
})
