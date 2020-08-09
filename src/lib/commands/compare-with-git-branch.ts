import DiffPresenter from '../diff-presenter';
import BranchManager from '../branch-manager';
import SelectionInfoRegistry from '../selection-info-registry';
import {TextKey} from '../const';
import {Command} from './command';
import TextEditor from '../adaptors/text-editor';

export default class CompareWithGitBranchCommand implements Command {
    constructor(private readonly diffPresenter: DiffPresenter,
                private readonly selectionInfoRegistry: SelectionInfoRegistry,
                private readonly branchManager: BranchManager) {}

    async execute(editor: TextEditor) {
        const branchNames = await this.branchManager.getLocalBranchNames();
        const branchName = await this.branchManager.selectViaQuickPick(branchNames);
        const branchText = await this.branchManager.getFileContent(branchName, editor.fileUri);

        this.selectionInfoRegistry.set(TextKey.VISIBLE_EDITOR1, {
            text: editor.getText, 
            fileName: `${editor.fileName} (local)`, 
            lineRanges: []
        });

        this.selectionInfoRegistry.set(TextKey.GIT_BRANCH, {
            text: branchText, 
            fileName: `${editor.fileName} (${branchName})`, 
            lineRanges: []
        });

        await 'HACK'; // HACK: Avoid "TextEditor has been disposed" error
        await this.diffPresenter.takeDiff(TextKey.GIT_BRANCH, TextKey.VISIBLE_EDITOR1);
    }
}