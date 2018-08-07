import DiffPresenter from '../diff-presenter';
import SelectionInfoBuilder from '../selection-info-builder';
import SelectionInfoRegistry from '../selection-info-registry';
import Clipboard from '../clipboard';
import { TextKey } from '../const';

export default class CompareSelectionWithClipboardCommand {
  private _diffPresenter: DiffPresenter;
  private _selectionInfoBuilder: SelectionInfoBuilder;
  private _selectionInfoRegistry: SelectionInfoRegistry;
  private _clipboard: Clipboard;
  private _logger: Console;

  constructor (params) {
    this._diffPresenter = params.diffPresenter;
    this._selectionInfoBuilder = params.selectionInfoBuilder;
    this._selectionInfoRegistry = params.selectionInfoRegistry;
    this._clipboard = params.clipboard;
    this._logger = params.logger;
  }

  async execute (editor) {
    try {
      const text = await this._clipboard.read();
      this._selectionInfoRegistry.set(TextKey.CLIPBOARD, {
        text,
        fileName: 'Clipboard'
      });

      const textInfo = this._selectionInfoBuilder.extract(editor);
      this._selectionInfoRegistry.set(TextKey.REGISTER2, textInfo);

      await this._diffPresenter.takeDiff(TextKey.CLIPBOARD, TextKey.REGISTER2);
    } catch (e) {
      this._handleError(e);
    }
  }

  _handleError (e) {
    this._logger.error(e.stack);
  }
}
