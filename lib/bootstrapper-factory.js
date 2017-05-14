
const vscode = require('vscode');
const Bootstrapper = require('./bootstrapper');
const CommandFactory = require('./command-factory');
const ContentProvider = require('./content-provider');
const SelectionInfoRegistry = require('./selection-info-registry');
const TextResourceUtil = require('./text-resource-util');

const EXTENSION_SCHEME = 'partialdiff';

class BootstrapperFactory {

    create() {
        const logger = console;
        const selectionInfoRegistry = new SelectionInfoRegistry();
        const textResourceUtil = this._createTextResourceUtil();
        const commandFactory = new CommandFactory({selectionInfoRegistry, textResourceUtil, vscode, logger});
        const contentProvider = new ContentProvider({selectionInfoRegistry, textResourceUtil});
        return new Bootstrapper({
            contentProvider,
            vscode,
            commandFactory,
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
