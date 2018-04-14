class MessageBar {
  constructor ({ vscWindow }) {
    this.vscWindow = vscWindow
  }

  async showInfo (message) {
    await this.vscWindow.showInformationMessage(message)
  }
}

module.exports = MessageBar
