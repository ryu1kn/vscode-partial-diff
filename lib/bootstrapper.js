
const EXTENSION_NAMESPACE = 'extension.partialDiff';

class Bootstrapper {

    constructor(params) {
        this._app = params.app;
        this._extensionScheme = params.extensionScheme;
        this._contentProvider = params.contentProvider;
        this._vscode = params.vscode;
    }

    initiate(context) {
        this._registerProviders(context);
        this._registerCommands(context);
    }

    _registerProviders(context) {
        const disposable = this._vscode.workspace.registerTextDocumentContentProvider(
                this._extensionScheme, this._contentProvider);
        context.subscriptions.push(disposable);
    }

    _registerCommands(context) {
        const app = this._app;
        const commandMap = new Map([
            [`${EXTENSION_NAMESPACE}.markSection1`, app.saveSelectionAsText1.bind(app)],
            [`${EXTENSION_NAMESPACE}.markSection2AndTakeDiff`, app.saveSelectionAsText2AndTakeDiff.bind(app)]
        ]);
        commandMap.forEach((command, commandName) => {
            const disposable = this._vscode.commands.registerTextEditorCommand(commandName, command);
            context.subscriptions.push(disposable);
        });
    }

}

module.exports = Bootstrapper;
