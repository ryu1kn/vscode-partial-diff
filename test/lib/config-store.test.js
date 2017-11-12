
const ConfigStore = require('../../lib/config-store');

suite('ConfigStore', () => {

    test('it reads text normalisation rules from vscode.workspace', () => {
        const extensionConfig = {get: stubWithArgs(['preComparisonTextNormalizationRules'], 'RULES')};
        const workspace = {getConfiguration: stubWithArgs(['partialDiff'], extensionConfig)};
        const configStore = new ConfigStore({workspace});
        expect(configStore.preComparisonTextNormalizationRules).to.eql('RULES');
    });

    test('it tells if text normalisation rules are specified', () => {
        const extensionConfig = {get: stubWithArgs(['preComparisonTextNormalizationRules'], ['RULE1'])};
        const workspace = {getConfiguration: stubWithArgs(['partialDiff'], extensionConfig)};
        const configStore = new ConfigStore({workspace});
        expect(configStore.hasPreComparisonTextNormalizationRules).to.be.true;
    });

    test('it tells if text normalisation rules are not specified', () => {
        const extensionConfig = {get: stubWithArgs(['preComparisonTextNormalizationRules'], [])};
        const workspace = {getConfiguration: stubWithArgs(['partialDiff'], extensionConfig)};
        const configStore = new ConfigStore({workspace});
        expect(configStore.hasPreComparisonTextNormalizationRules).to.be.false;
    });
});
