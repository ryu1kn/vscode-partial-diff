import SelectionInfoBuilder from '../selection-info-builder';
import SelectionInfoRegistry from '../selection-info-registry';
import {TextKey} from '../const';
import * as vscode from 'vscode';
import {Command} from './command';

export default class SaveText1Command implements Command {
    private readonly selectionInfoBuilder: SelectionInfoBuilder;
    private readonly selectionInfoRegistry: SelectionInfoRegistry;

    constructor(selectionInfoBuilder: SelectionInfoBuilder,
                selectionInfoRegistry: SelectionInfoRegistry) {
        this.selectionInfoBuilder = selectionInfoBuilder;
        this.selectionInfoRegistry = selectionInfoRegistry;
    }

    execute(editor: vscode.TextEditor) {
        const textInfo = this.selectionInfoBuilder.extract(editor);
        this.selectionInfoRegistry.set(TextKey.REGISTER1, textInfo);
    }

}
