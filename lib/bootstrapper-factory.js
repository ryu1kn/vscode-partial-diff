
const vscode = require('vscode');
const AppFactory = require('./app-factory');
const Bootstrapper = require('./bootstrapper');
const ContentProvider = require('./content-provider');
const TextRegistry = require('./text-registry');
const TextResourceUtil = require('./text-resource-util');

const EXTENSION_SCHEME = 'partialdiff';

class BootstrapperFactory {

    create() {
        const logger = console;
        const textRegistry = new TextRegistry();
        const textResourceUtil = this._createTextResourceUtil();
        const appFactory = new AppFactory({textRegistry, textResourceUtil, vscode, logger});
        const contentProvider = new ContentProvider({textRegistry, textResourceUtil});
        return new Bootstrapper({
            contentProvider,
            vscode,
            app: appFactory.create(),
            extensionScheme: EXTENSION_SCHEME
        });
    }

    _createTextResourceUtil() {
        return new TextResourceUtil({
            Uri: vscode.Uri,
            extensionScheme: EXTENSION_SCHEME,
            getCurrentDateFn: () => new Date()
        });
    }

}

module.exports = BootstrapperFactory;
