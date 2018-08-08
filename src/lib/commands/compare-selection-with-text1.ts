import DiffPresenter from '../diff-presenter';
import SelectionInfoBuilder from '../selection-info-builder';
import SelectionInfoRegistry from '../selection-info-registry';
import {TextKey} from '../const';
import {Logger} from '../logger';
import * as vscode from 'vscode';

export default class CompareSelectionWithText1Command {
    private readonly logger: Logger;
    private readonly diffPresenter: DiffPresenter;
    private readonly selectionInfoBuilder: SelectionInfoBuilder;
    private readonly selectionInfoRegistry: SelectionInfoRegistry;

    constructor(diffPresenter: DiffPresenter,
                selectionInfoBuilder: SelectionInfoBuilder,
                selectionInfoRegistry: SelectionInfoRegistry,
                logger: Logger) {
        this.logger = logger;
        this.diffPresenter = diffPresenter;
        this.selectionInfoBuilder = selectionInfoBuilder;
        this.selectionInfoRegistry = selectionInfoRegistry;
    }

    async execute(editor: vscode.TextEditor) {
        try {
            const textInfo = this.selectionInfoBuilder.extract(editor);
            this.selectionInfoRegistry.set(TextKey.REGISTER2, textInfo);

            await 'HACK'; // HACK: To avoid TextEditor has been disposed error
            await this.diffPresenter.takeDiff(TextKey.REGISTER1, TextKey.REGISTER2);
        } catch (e) {
            this.handleError(e);
        }
    }

    private handleError(e: Error) {
        this.logger.error(e.stack);
    }
}
