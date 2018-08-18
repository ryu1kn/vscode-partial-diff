import WindowAdaptor from './adaptors/window';

export default class MessageBar {
    private windowAdaptor: WindowAdaptor;

    constructor(windowAdaptor: WindowAdaptor) {
        this.windowAdaptor = windowAdaptor;
    }

    async showInfo(message: string) {
        await this.windowAdaptor.showInformationMessage(message);
    }
}
