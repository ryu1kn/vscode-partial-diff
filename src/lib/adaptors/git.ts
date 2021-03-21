import * as vscode from 'vscode';
import { Repository, Ref, Branch } from '../types/git.d';

export default class GitAdapter {
    repo: Repository;
    constructor(private readonly extensions: typeof vscode.extensions) {
        const ext = this.extensions.getExtension('vscode.git')?.exports;
        const api = ext.getAPI(1);
        this.repo = api.repositories[0];
    }

    isGitRepo(): boolean {
        return !!this.repo;
    }

    async show(branchName: string, fileDir: string): Promise<string> {
        return this.repo.show(branchName, fileDir);
    }

    async allBranches(): Promise<Ref[]> {
        return await this.repo.getBranches({
            pattern: ''
        });
    }

    async getBranch(name: string): Promise<Branch> {
        return await this.repo.getBranch(name);
    }
}