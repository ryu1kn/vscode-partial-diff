import DiffPresenter from '../diff-presenter';
import SelectionInfoBuilder from '../selection-info-builder';
import SelectionInfoRegistry from '../selection-info-registry';
import Clipboard from '../clipboard';
import {TextKey} from '../const';
import {Logger} from '../logger';

export default class CompareSelectionWithClipboardCommand {
    private readonly diffPresenter: DiffPresenter;
    private readonly selectionInfoBuilder: SelectionInfoBuilder;
    private readonly selectionInfoRegistry: SelectionInfoRegistry;
    private readonly clipboard: Clipboard;
    private readonly logger: Logger;

    constructor(diffPresenter: DiffPresenter,
                selectionInfoBuilder: SelectionInfoBuilder,
                selectionInfoRegistry: SelectionInfoRegistry,
                clipboard: Clipboard,
                logger: Logger) {
        this.diffPresenter = diffPresenter;
        this.selectionInfoBuilder = selectionInfoBuilder;
        this.selectionInfoRegistry = selectionInfoRegistry;
        this.clipboard = clipboard;
        this.logger = logger;
    }

    async execute(editor) {
        try {
            const text = await this.clipboard.read();
            this.selectionInfoRegistry.set(TextKey.CLIPBOARD, {
                text,
                fileName: 'Clipboard'
            });

            const textInfo = this.selectionInfoBuilder.extract(editor);
            this.selectionInfoRegistry.set(TextKey.REGISTER2, textInfo);

            await this.diffPresenter.takeDiff(TextKey.CLIPBOARD, TextKey.REGISTER2);
        } catch (e) {
            this.handleError(e);
        }
    }

    private handleError(e) {
        this.logger.error(e.stack);
    }
}
