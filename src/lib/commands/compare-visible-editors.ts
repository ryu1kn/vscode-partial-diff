import DiffPresenter from '../diff-presenter';
import MessageBar from '../message-bar';
import SelectionInfoBuilder from '../selection-info-builder';
import SelectionInfoRegistry from '../selection-info-registry';
import {TextKey} from '../const';
import {Logger} from '../logger';
import * as vscode from 'vscode';
import {SelectionInfo} from '../entities/selection-info';

export default class CompareVisibleEditorsCommand {
    private readonly logger: Logger;
    private readonly editorWindow: typeof vscode.window;
    private readonly diffPresenter: DiffPresenter;
    private readonly messageBar: MessageBar;
    private readonly selectionInfoBuilder: SelectionInfoBuilder;
    private readonly selectionInfoRegistry: SelectionInfoRegistry;

    constructor(diffPresenter: DiffPresenter,
                selectionInfoBuilder: SelectionInfoBuilder,
                selectionInfoRegistry: SelectionInfoRegistry,
                messageBar: MessageBar,
                editorWindow: typeof vscode.window,
                logger: Logger) {
        this.logger = logger;
        this.editorWindow = editorWindow;
        this.diffPresenter = diffPresenter;
        this.messageBar = messageBar;
        this.selectionInfoBuilder = selectionInfoBuilder;
        this.selectionInfoRegistry = selectionInfoRegistry;
    }

    async execute() {
        try {
            const editors = this.editorWindow.visibleTextEditors;
            if (editors.length !== 2) {
                this.messageBar.showInfo('Please first open 2 documents to compare.');
                return;
            }

            const textInfos = editors.map(editor =>
                this.selectionInfoBuilder.extract(editor)
            );
            this.registerTextInfo(
                textInfos,
                editors[0].viewColumn > editors[1].viewColumn
            );

            await 'HACK'; // HACK: Avoid "TextEditor has been disposed" error
            await this.diffPresenter.takeDiff(
                TextKey.VISIBLE_EDITOR1,
                TextKey.VISIBLE_EDITOR2
            );
        } catch (e) {
            this.handleError(e);
        }
    }

    private registerTextInfo(textInfos: SelectionInfo[], isReverseOrder: boolean) {
        const textInfo1 = textInfos[isReverseOrder ? 1 : 0];
        const textInfo2 = textInfos[isReverseOrder ? 0 : 1];
        this.selectionInfoRegistry.set(TextKey.VISIBLE_EDITOR1, textInfo1);
        this.selectionInfoRegistry.set(TextKey.VISIBLE_EDITOR2, textInfo2);
    }

    private handleError(e: Error) {
        this.logger.error(e.stack);
    }
}
