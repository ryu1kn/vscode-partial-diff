import DiffPresenter from '../diff-presenter';
import SelectionInfoRegistry from '../selection-info-registry';
import {TextKey} from '../const';
import {Command} from './command';
import WindowAdaptor from '../adaptors/window';
import GitAdaptor from '../adaptors/git';

export default class CompareWithGitBranchCommand implements Command {
    constructor(private readonly diffPresenter: DiffPresenter,
                private readonly selectionInfoRegistry: SelectionInfoRegistry,
                private readonly gitAdaptor: GitAdaptor,
                private readonly windowAdaptor: WindowAdaptor) {}

    async execute() {
        const branches: [] = await this.gitAdaptor.allBranches();
        const branchNames = branches.map((i:any) => i.name);

        const branch = await this.windowAdaptor.showQuickPick(branchNames, false);
        const document = this.windowAdaptor.activeTextEditor.document;
        const localFileUri = document.fileName; 
        const localText = document.getText();

        const branchName = typeof branch === 'string' ? branch : '';
        const branchText = await this.gitAdaptor.show(branchName, localFileUri);

        this.selectionInfoRegistry.set(TextKey.VISIBLE_EDITOR1, {
            text: localText, 
            fileName: localFileUri, 
            lineRanges: []
        });

        this.selectionInfoRegistry.set(TextKey.GIT_BRANCH, {
            text: branchText, 
            fileName: localFileUri,
            lineRanges: []
        });

        await 'HACK'; // HACK: Avoid "TextEditor has been disposed" error
        await this.diffPresenter.takeDiff(TextKey.VISIBLE_EDITOR1, TextKey.GIT_BRANCH);
    }
}