import WindowAdaptor from './adaptors/window';
import { Ref } from './types/git.d'
import GitAdaptor from './adaptors/git';
import { QuickPickItem } from 'vscode';

export default class BranchManager {
    constructor(private readonly gitAdaptor: GitAdaptor,
                private readonly windowAdaptor: WindowAdaptor) {}

    private toQuickPickItems(list: string[]): QuickPickItem[] {
        return list.map((name, i)=> ({
            label: name,
            picked: false,
            ruleIndex: i,
            description: ''  
        }));
    }

    async getFileContent(branchName: string, fileUri: string): Promise<string> {
        try {
            return await this.gitAdaptor.show(branchName, fileUri);
        } catch(e) {
            this.windowAdaptor.showInformationMessage(`file does not exist on ${branchName} branch`);
            return '';
        }
    }

    async selectViaQuickPick(branchNames: string[]): Promise<string> {
        const branch: QuickPickItem = await <any>this.windowAdaptor.showQuickPick(this.toQuickPickItems(branchNames), false);
        return branch.label;
    }

    async getLocalBranchNames(): Promise<string[]> {
        if (!this.gitAdaptor.isGitRepo()) {
            this.windowAdaptor.showInformationMessage("Git repo not found!");
        }
        const branches: Ref[] = await this.gitAdaptor.allBranches();
        return branches.map((i:Ref) => i.name || '');
    }
}