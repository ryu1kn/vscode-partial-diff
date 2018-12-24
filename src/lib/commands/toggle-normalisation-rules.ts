import NormalisationRulePicker from '../normalisation-rule-picker';
import NormalisationRuleStore from '../normalisation-rule-store';
import {Command} from './command';
import WindowAdaptor from '../adaptors/window';
import {makeUri} from '../utils/text-resource';
import SelectionInfoRegistry from '../selection-info-registry';
import {PartialDiffFileSystem} from '../file-system-provider';
import TextProcessRuleApplier from '../text-process-rule-applier';

export default class ToggleNormalisationRulesCommand implements Command {
    private readonly windowAdaptor: WindowAdaptor;
    private readonly normalisationRulePicker: NormalisationRulePicker;
    private readonly normalisationRuleStore: NormalisationRuleStore;
    private readonly selectionInfoRegistry: SelectionInfoRegistry;
    private readonly partialDiffFileSystem: PartialDiffFileSystem;
    private readonly textProcessRuleApplier: TextProcessRuleApplier;

    constructor(normalisationRuleStore: NormalisationRuleStore,
                windowAdaptor: WindowAdaptor,
                selectionInfoRegistry: SelectionInfoRegistry,
                partialDiffFileSystem: PartialDiffFileSystem) {
        this.windowAdaptor = windowAdaptor;
        this.normalisationRulePicker = new NormalisationRulePicker(windowAdaptor);
        this.normalisationRuleStore = normalisationRuleStore;
        this.selectionInfoRegistry = selectionInfoRegistry;
        this.partialDiffFileSystem = partialDiffFileSystem;
        this.textProcessRuleApplier = new TextProcessRuleApplier(normalisationRuleStore);
    }

    async execute() {
        const rules = this.normalisationRuleStore.getAllRules();
        if (rules.length > 0) {
            const newRules = await this.normalisationRulePicker.show(rules);
            this.normalisationRuleStore.specifyActiveRules(newRules);
            this.updateAllBuffers();
        } else {
            await this.windowAdaptor.showInformationMessage(
                'Please set `partialDiff.preComparisonTextNormalizationRules` first'
            );
        }
    }

    private updateAllBuffers(): void {
        const getUri = (textKey: string) => makeUri(textKey);
        this.selectionInfoRegistry.keys.map(key => {
            this.partialDiffFileSystem.writeFile(getUri(key),
                Buffer.from(this.textProcessRuleApplier.applyTo(this.selectionInfoRegistry.get(key).text)), {create: true, overwrite: true});
        });
    }
}
