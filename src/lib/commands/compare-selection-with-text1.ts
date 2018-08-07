import DiffPresenter from '../diff-presenter';
import SelectionInfoBuilder from '../selection-info-builder';
import SelectionInfoRegistry from '../selection-info-registry';
import {TextKey} from '../const';

export default class CompareSelectionWithText1Command {
    private readonly logger: Console;
    private readonly diffPresenter: DiffPresenter;
    private readonly selectionInfoBuilder: SelectionInfoBuilder;
    private readonly selectionInfoRegistry: SelectionInfoRegistry;

    constructor(params) {
        this.logger = params.logger;
        this.diffPresenter = params.diffPresenter;
        this.selectionInfoBuilder = params.selectionInfoBuilder;
        this.selectionInfoRegistry = params.selectionInfoRegistry;
    }

    async execute(editor) {
        try {
            const textInfo = this.selectionInfoBuilder.extract(editor);
            this.selectionInfoRegistry.set(TextKey.REGISTER2, textInfo);

            await 'HACK'; // HACK: To avoid TextEditor has been disposed error
            await this.diffPresenter.takeDiff(TextKey.REGISTER1, TextKey.REGISTER2);
        } catch (e) {
            this.handleError(e);
        }
    }

    private handleError(e) {
        this.logger.error(e.stack);
    }
}
