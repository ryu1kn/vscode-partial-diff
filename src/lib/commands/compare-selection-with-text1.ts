import DiffPresenter from '../diff-presenter';
import SelectionInfoBuilder from '../selection-info-builder';
import SelectionInfoRegistry from '../selection-info-registry';
import {TextKey} from '../const';
import * as vscode from 'vscode';
import {Command} from './command';

export default class CompareSelectionWithText1Command implements Command {
    private readonly diffPresenter: DiffPresenter;
    private readonly selectionInfoBuilder: SelectionInfoBuilder;
    private readonly selectionInfoRegistry: SelectionInfoRegistry;

    constructor(diffPresenter: DiffPresenter,
                selectionInfoBuilder: SelectionInfoBuilder,
                selectionInfoRegistry: SelectionInfoRegistry) {
        this.diffPresenter = diffPresenter;
        this.selectionInfoBuilder = selectionInfoBuilder;
        this.selectionInfoRegistry = selectionInfoRegistry;
    }

    async execute(editor: vscode.TextEditor) {
        const textInfo = this.selectionInfoBuilder.extract(editor);
        this.selectionInfoRegistry.set(TextKey.REGISTER2, textInfo);

        await 'HACK'; // HACK: To avoid TextEditor has been disposed error
        await this.diffPresenter.takeDiff(TextKey.REGISTER1, TextKey.REGISTER2);
    }

}
