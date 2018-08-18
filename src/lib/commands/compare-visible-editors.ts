import DiffPresenter from '../diff-presenter';
import MessageBar from '../message-bar';
import SelectionInfoRegistry from '../selection-info-registry';
import {TextKey} from '../const';
import {SelectionInfo} from '../entities/selection-info';
import {Command} from './command';
import WindowComponent from '../adaptors/window';

export default class CompareVisibleEditorsCommand implements Command {
    private readonly windowComponent: WindowComponent;
    private readonly diffPresenter: DiffPresenter;
    private readonly messageBar: MessageBar;
    private readonly selectionInfoRegistry: SelectionInfoRegistry;

    constructor(diffPresenter: DiffPresenter,
                selectionInfoRegistry: SelectionInfoRegistry,
                messageBar: MessageBar,
                windowComponent: WindowComponent) {
        this.windowComponent = windowComponent;
        this.diffPresenter = diffPresenter;
        this.messageBar = messageBar;
        this.selectionInfoRegistry = selectionInfoRegistry;
    }

    async execute() {
        const editors = this.windowComponent.visibleTextEditors;
        if (editors.length !== 2) {
            this.messageBar.showInfo('Please first open 2 documents to compare.');
            return;
        }

        const textInfos = editors.map(editor => ({
            text: editor.selectedText,
            fileName: editor.fileName,
            lineRanges: editor.selectedLineRanges
        }));
        this.registerTextInfo(
            textInfos,
            editors[0].viewColumn > editors[1].viewColumn
        );

        await 'HACK'; // HACK: Avoid "TextEditor has been disposed" error
        await this.diffPresenter.takeDiff(TextKey.VISIBLE_EDITOR1, TextKey.VISIBLE_EDITOR2);
    }

    private registerTextInfo(textInfos: SelectionInfo[], isReverseOrder: boolean) {
        const textInfo1 = textInfos[isReverseOrder ? 1 : 0];
        const textInfo2 = textInfos[isReverseOrder ? 0 : 1];
        this.selectionInfoRegistry.set(TextKey.VISIBLE_EDITOR1, textInfo1);
        this.selectionInfoRegistry.set(TextKey.VISIBLE_EDITOR2, textInfo2);
    }

}
