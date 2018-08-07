import SelectionInfoBuilder from '../selection-info-builder';
import SelectionInfoRegistry from '../selection-info-registry';
import {TextKey} from '../const';
import {Logger} from '../logger';

export default class SaveText1Command {
    private readonly logger: Logger;
    private readonly selectionInfoBuilder: SelectionInfoBuilder;
    private readonly selectionInfoRegistry: SelectionInfoRegistry;

    constructor(selectionInfoBuilder: SelectionInfoBuilder,
                selectionInfoRegistry: SelectionInfoRegistry,
                logger: Logger) {
        this.logger = logger;
        this.selectionInfoBuilder = selectionInfoBuilder;
        this.selectionInfoRegistry = selectionInfoRegistry;
    }

    execute(editor) {
        try {
            const textInfo = this.selectionInfoBuilder.extract(editor);
            this.selectionInfoRegistry.set(TextKey.REGISTER1, textInfo);
        } catch (e) {
            this.handleError(e);
        }
    }

    private handleError(e) {
        this.logger.error(e.stack);
    }
}
