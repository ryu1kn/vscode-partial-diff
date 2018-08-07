export default class MessageBar {
    private vscWindow: any;

    constructor({vscWindow}) {
        this.vscWindow = vscWindow;
    }

    async showInfo(message) {
        await this.vscWindow.showInformationMessage(message);
    }
}
