
const Const = require('./const');

class ConfigStore {

    constructor(params) {
        this._workspace = params.workspace;
    }

    get(configName) {
        const extensionConfig = this._workspace.getConfiguration(Const.EXTENSION_ID);
        return extensionConfig.get(configName);
    }

}

module.exports = ConfigStore;
