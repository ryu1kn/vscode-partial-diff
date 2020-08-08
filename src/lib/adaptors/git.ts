import * as vscode from 'vscode';

export default class GitAdapter {
    repo: any;
    constructor(private readonly extensions: typeof vscode.extensions) {
        const ext = this.extensions.getExtension('vscode.git')?.exports;
        const api = ext.getAPI(1);
		this.repo = api.repositories[0];
    }

    show(branchName: string, fileDir: string): string {
       return this.repo.show(branchName, fileDir);
    }

    async allBranches<T>(): Promise<T> {
        return await this.repo.getBranches('');
    }

    async getBranch<T>(name: String): Promise<T> {
        return await this.repo.getBranch(name);
    }
}