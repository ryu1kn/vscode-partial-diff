import DiffPresenter from '../diff-presenter';
import MessageBar from '../message-bar';
import SelectionInfoBuilder from '../selection-info-builder';
import SelectionInfoRegistry from '../selection-info-registry';
import {TextKey} from '../const';

export default class CompareVisibleEditorsCommand {
  private readonly logger: Console;
  private readonly editorWindow: any;
  private readonly diffPresenter: DiffPresenter;
  private readonly messageBar: MessageBar;
  private readonly selectionInfoBuilder: SelectionInfoBuilder;
  private readonly selectionInfoRegistry: SelectionInfoRegistry;

  constructor(params) {
    this.logger = params.logger;
    this.editorWindow = params.editorWindow;
    this.diffPresenter = params.diffPresenter;
    this.messageBar = params.messageBar;
    this.selectionInfoBuilder = params.selectionInfoBuilder;
    this.selectionInfoRegistry = params.selectionInfoRegistry;
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

  private registerTextInfo(textInfos, isReverseOrder) {
    const textInfo1 = textInfos[isReverseOrder ? 1 : 0];
    const textInfo2 = textInfos[isReverseOrder ? 0 : 1];
    this.selectionInfoRegistry.set(TextKey.VISIBLE_EDITOR1, textInfo1);
    this.selectionInfoRegistry.set(TextKey.VISIBLE_EDITOR2, textInfo2);
  }

  private handleError(e) {
    this.logger.error(e.stack);
  }
}
