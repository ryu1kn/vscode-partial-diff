export default class MessageBar {
    private vscWindow: any;

    constructor(vscWindow: any) {
        this.vscWindow = vscWindow;
    }

    async showInfo(message) {
        await this.vscWindow.showInformationMessage(message);
    }
}
