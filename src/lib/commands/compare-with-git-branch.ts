import DiffPresenter from '../diff-presenter';
import BranchManager from '../branch-manager';
import SelectionInfoRegistry from '../selection-info-registry';
import {TextKey} from '../const';
import {Command} from './command';
import * as path from 'path';
import WindowAdaptor from '../adaptors/window';

interface FileDetails {
    uri: string;
    name: string;
    text: string;
}

export default class CompareWithGitBranchCommand implements Command {
    constructor(private readonly diffPresenter: DiffPresenter,
                private readonly selectionInfoRegistry: SelectionInfoRegistry,
                private readonly branchManager: BranchManager,
                private readonly windowAdaptor: WindowAdaptor) {}

    private getActiveFileDetails(): FileDetails {
        const document = this.windowAdaptor.activeTextEditor.document;
        const uri = document.fileName; 
        const text = document.getText();

        const name = path.parse(uri).base;

        return {
            uri,
            name,
            text
        }
    }

    async execute() {
        const branchNames = await this.branchManager.getLocalBranchNames();
        const branchName = await this.branchManager.selectViaQuickPick(branchNames);
        const activeFile = await this.getActiveFileDetails();

        const branchText = await this.branchManager.getFileContent(branchName, activeFile.uri);

        this.selectionInfoRegistry.set(TextKey.VISIBLE_EDITOR1, {
            text: activeFile.text, 
            fileName: `${activeFile.name} (local)`, 
            lineRanges: []
        });

        this.selectionInfoRegistry.set(TextKey.GIT_BRANCH, {
            text: branchText, 
            fileName: `${activeFile.name} (${branchName})`, 
            lineRanges: []
        });

        await 'HACK'; // HACK: Avoid "TextEditor has been disposed" error
        await this.diffPresenter.takeDiff(TextKey.GIT_BRANCH, TextKey.VISIBLE_EDITOR1);
    }
}