
const ConfigStore = require('../../lib/config-store');

suite('ConfigStore', () => {

    test('it returns the current config from vscode.workspace', () => {
        const extensionConfig = {get: stubWithArgs(['CONFIG_NAME'], 'CONFIG_VALUE')};
        const workspace = {getConfiguration: stubWithArgs(['partialDiff'], extensionConfig)};
        const configStore = new ConfigStore({workspace});
        expect(configStore.get('CONFIG_NAME')).to.eql('CONFIG_VALUE');
    });
});
