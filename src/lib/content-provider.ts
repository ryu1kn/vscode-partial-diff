import TextProcessRuleApplier from './text-process-rule-applier';
import SelectionInfoRegistry from './selection-info-registry';
import TextResourceUtil from './text-resource-util';

export default class ContentProvider {
    private readonly selectionInfoRegistry: SelectionInfoRegistry;
    private readonly textResourceUtil: TextResourceUtil;
    private readonly textProcessRuleApplier: TextProcessRuleApplier;

    constructor(params) {
        this.selectionInfoRegistry = params.selectionInfoRegistry;
        this.textResourceUtil = params.textResourceUtil;
        this.textProcessRuleApplier = new TextProcessRuleApplier({
            normalisationRuleStore: params.normalisationRuleStore
        });
    }

    provideTextDocumentContent(uri) {
        const textKey = this.textResourceUtil.getTextKey(uri);
        const registeredText = (
            this.selectionInfoRegistry.get(textKey) || {text: ''}
        ).text;
        return this.textProcessRuleApplier.applyTo(registeredText);
    }
}
