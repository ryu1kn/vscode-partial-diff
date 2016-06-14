
'use strict';

const EXTENSION_NAMESPACE = 'extension.partialDiff';

class Bootstrapper {

    constructor(params) {
        this._appFactory = params.appFactory;
        this._vscCommands = params.vscCommands;
    }

    initiate(context) {
        const app = this._appFactory.create();
        const commandMap = new Map([
            [`${EXTENSION_NAMESPACE}.markSection1`, app.saveSelectionAsText1.bind(app)],
            [`${EXTENSION_NAMESPACE}.markSection2AndTakeDiff`, app.saveSelectionAsText2AndTakeDiff.bind(app)]
        ]);
        this._registerCommands(commandMap, context);
    }

    _registerCommands(commandMap, context) {
        commandMap.forEach((command, commandName) => {
            const disposable = this._vscCommands.registerTextEditorCommand(commandName, command);
            context.subscriptions.push(disposable);
        });
    }
}

module.exports = Bootstrapper;
