const td = require('testdouble')

const MessageBar = require('../../lib/message-bar')

suite('MessageBar', () => {
  const vscWindow = td.object(['showInformationMessage'])
  const messageBar = new MessageBar({ vscWindow })

  test('it shows information message', async () => {
    await messageBar.showInfo('MESSAGE')

    td.verify(vscWindow.showInformationMessage('MESSAGE'))
  })
})
