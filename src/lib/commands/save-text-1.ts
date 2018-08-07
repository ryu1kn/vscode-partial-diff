import SelectionInfoBuilder from '../selection-info-builder';
import SelectionInfoRegistry from '../selection-info-registry';

const { TextKey } = require('../const');

export default class SaveText1Command {
  private _logger: Console;
  private _selectionInfoBuilder: SelectionInfoBuilder;
  private _selectionInfoRegistry: SelectionInfoRegistry;

  constructor (params) {
    this._logger = params.logger;
    this._selectionInfoBuilder = params.selectionInfoBuilder;
    this._selectionInfoRegistry = params.selectionInfoRegistry;
  }

  execute (editor) {
    try {
      const textInfo = this._selectionInfoBuilder.extract(editor);
      this._selectionInfoRegistry.set(TextKey.REGISTER1, textInfo);
    } catch (e) {
      this._handleError(e);
    }
  }

  _handleError (e) {
    this._logger.error(e.stack);
  }
}
