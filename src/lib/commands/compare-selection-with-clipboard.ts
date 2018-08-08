import DiffPresenter from '../diff-presenter';
import SelectionInfoBuilder from '../selection-info-builder';
import SelectionInfoRegistry from '../selection-info-registry';
import Clipboard from '../clipboard';
import {TextKey} from '../const';
import * as vscode from 'vscode';
import {Command} from './command';

export default class CompareSelectionWithClipboardCommand implements Command {
    private readonly diffPresenter: DiffPresenter;
    private readonly selectionInfoBuilder: SelectionInfoBuilder;
    private readonly selectionInfoRegistry: SelectionInfoRegistry;
    private readonly clipboard: Clipboard;

    constructor(diffPresenter: DiffPresenter,
                selectionInfoBuilder: SelectionInfoBuilder,
                selectionInfoRegistry: SelectionInfoRegistry,
                clipboard: Clipboard) {
        this.diffPresenter = diffPresenter;
        this.selectionInfoBuilder = selectionInfoBuilder;
        this.selectionInfoRegistry = selectionInfoRegistry;
        this.clipboard = clipboard;
    }

    async execute(editor: vscode.TextEditor) {
        const text = await this.clipboard.read();
        this.selectionInfoRegistry.set(TextKey.CLIPBOARD, {
            text,
            fileName: 'Clipboard',
            lineRanges: []
        });

        const textInfo = this.selectionInfoBuilder.extract(editor);
        this.selectionInfoRegistry.set(TextKey.REGISTER2, textInfo);

        await this.diffPresenter.takeDiff(TextKey.CLIPBOARD, TextKey.REGISTER2);
    }

}
