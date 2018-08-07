import TextProcessRuleApplier from './text-process-rule-applier';
import SelectionInfoRegistry from './selection-info-registry';
import TextResourceUtil from './text-resource-util';
import NormalisationRuleStore from './normalisation-rule-store';

export default class ContentProvider {
    private readonly selectionInfoRegistry: SelectionInfoRegistry;
    private readonly textResourceUtil: TextResourceUtil;
    private readonly textProcessRuleApplier: TextProcessRuleApplier;

    constructor(selectionInfoRegistry: SelectionInfoRegistry,
                normalisationRuleStore: NormalisationRuleStore,
                textResourceUtil: TextResourceUtil) {
        this.selectionInfoRegistry = selectionInfoRegistry;
        this.textResourceUtil = textResourceUtil;
        this.textProcessRuleApplier = new TextProcessRuleApplier({normalisationRuleStore});
    }

    provideTextDocumentContent(uri) {
        const textKey = this.textResourceUtil.getTextKey(uri);
        const registeredText = (
            this.selectionInfoRegistry.get(textKey) || {text: ''}
        ).text;
        return this.textProcessRuleApplier.applyTo(registeredText);
    }
}
