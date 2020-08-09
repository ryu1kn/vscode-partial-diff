import DiffPresenter from '../diff-presenter';
import SelectionInfoRegistry from '../selection-info-registry';
import {TextKey} from '../const';
import {Command} from './command';
import * as path from 'path';
import WindowAdaptor from '../adaptors/window';
import { Ref } from '../types/git.d'
import GitAdaptor from '../adaptors/git';
import { QuickPickItem } from 'vscode';

interface FileDetails {
    uri: string;
    name: string;
    text: string,
}

export default class CompareWithGitBranchCommand implements Command {
    constructor(private readonly diffPresenter: DiffPresenter,
                private readonly selectionInfoRegistry: SelectionInfoRegistry,
                private readonly gitAdaptor: GitAdaptor,
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

    private toQuickPickItems(list: string[]): QuickPickItem[] {
        return list.map((name, i)=> ({
            label: name,
            picked: false,
            ruleIndex: i,
            description: ''  
        }));
    }

    private async getSelectedBranchName(branchNames: string[]): Promise<string> {
        const branch: QuickPickItem = await <any>this.windowAdaptor.showQuickPick(this.toQuickPickItems(branchNames), false);
        return branch.label;
    }

    private async getLocalBranchNames(): Promise<string[]> {
        if (!this.gitAdaptor.isGitRepo()) {
            this.windowAdaptor.showInformationMessage("Git repo not found!");
        }
        const branches: Ref[] = await this.gitAdaptor.allBranches();
        return branches.map((i:Ref) => i.name || '');
    }

    async execute() {
        const branchNames = await this.getLocalBranchNames();
        const branchName = await this.getSelectedBranchName(branchNames);
        const activeFile = await this.getActiveFileDetails();
        const branchText = await this.gitAdaptor.show(branchName, activeFile.uri);

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