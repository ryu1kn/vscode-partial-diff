import SelectionInfoBuilder from '../selection-info-builder';
import SelectionInfoRegistry from '../selection-info-registry';
import { TextKey } from '../const';

export default class SaveText1Command {
  private readonly logger: Console;
  private readonly selectionInfoBuilder: SelectionInfoBuilder;
  private readonly selectionInfoRegistry: SelectionInfoRegistry;

  constructor (params) {
    this.logger = params.logger;
    this.selectionInfoBuilder = params.selectionInfoBuilder;
    this.selectionInfoRegistry = params.selectionInfoRegistry;
  }

  execute (editor) {
    try {
      const textInfo = this.selectionInfoBuilder.extract(editor);
      this.selectionInfoRegistry.set(TextKey.REGISTER1, textInfo);
    } catch (e) {
      this.handleError(e);
    }
  }

  private handleError (e) {
    this.logger.error(e.stack);
  }
}
