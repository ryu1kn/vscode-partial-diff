import * as vscode from 'vscode';

interface FileEntry {
    content: Uint8Array;
    mtime: number;
    ctime: number;
    readOnly: boolean;
}

/**
 * Writable in-memory filesystem for editable diff sessions.
 * Both diff sides are backed by writable resources so that the diff
 * editor allows in-place edits, which are then applied back to the
 * source documents by ApplyBackService.
 */
export default class EditableDiffFileSystemProvider implements vscode.FileSystemProvider {
    private readonly files = new Map<string, FileEntry>();
    private readonly directories = new Set<string>(['/']);
    private readonly changeEmitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
    readonly onDidChangeFile = this.changeEmitter.event;

    stat(uri: vscode.Uri): vscode.FileStat {
        const path = this.normalisePath(uri);
        const file = this.files.get(path);
        if (file) {
            return {
                type: vscode.FileType.File,
                ctime: file.ctime,
                mtime: file.mtime,
                size: file.content.byteLength
            };
        }
        if (this.directories.has(path)) {
            return {
                type: vscode.FileType.Directory,
                ctime: 0,
                mtime: 0,
                size: 0
            };
        }
        throw vscode.FileSystemError.FileNotFound(uri);
    }

    readDirectory(uri: vscode.Uri): [string, vscode.FileType][] {
        const dirPath = this.normalisePath(uri);
        if (!this.directories.has(dirPath)) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }
        const childEntries = new Map<string, vscode.FileType>();
        const dirPrefix = dirPath === '/' ? '/' : `${dirPath}/`;

        this.directories.forEach(path => {
            if (path === dirPath || !path.startsWith(dirPrefix)) {
                return;
            }
            const rest = path.slice(dirPrefix.length);
            if (rest.length === 0 || rest.includes('/')) {
                return;
            }
            childEntries.set(rest, vscode.FileType.Directory);
        });

        this.files.forEach((_file, path) => {
            if (!path.startsWith(dirPrefix)) {
                return;
            }
            const rest = path.slice(dirPrefix.length);
            if (rest.length === 0 || rest.includes('/')) {
                return;
            }
            childEntries.set(rest, vscode.FileType.File);
        });

        return [...childEntries.entries()];
    }

    createDirectory(uri: vscode.Uri): void {
        const path = this.normalisePath(uri);
        const segments = path.split('/').filter(segment => segment.length > 0);
        let current = '';
        this.directories.add('/');
        segments.forEach(segment => {
            current = `${current}/${segment}`;
            this.directories.add(current);
        });
    }

    readFile(uri: vscode.Uri): Uint8Array {
        const path = this.normalisePath(uri);
        const file = this.files.get(path);
        if (!file) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }
        return file.content;
    }

    writeFile(uri: vscode.Uri, content: Uint8Array, options: {create: boolean; overwrite: boolean}): void {
        const path = this.normalisePath(uri);
        const existing = this.files.get(path);
        if (existing && !options.overwrite) {
            throw vscode.FileSystemError.FileExists(uri);
        }
        if (!existing && !options.create) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }
        if (existing && existing.readOnly) {
            throw vscode.FileSystemError.NoPermissions(uri);
        }

        this.ensureParentDirectoryExists(path, uri);
        const now = Date.now();
        this.files.set(path, {
            content,
            ctime: existing ? existing.ctime : now,
            mtime: now,
            readOnly: existing ? existing.readOnly : this.isReadOnlyPath(path)
        });
        this.changeEmitter.fire([{
            type: existing ? vscode.FileChangeType.Changed : vscode.FileChangeType.Created,
            uri
        }]);
    }

    delete(uri: vscode.Uri, options: {recursive: boolean}): void {
        const path = this.normalisePath(uri);
        if (this.files.has(path)) {
            this.files.delete(path);
            this.changeEmitter.fire([{type: vscode.FileChangeType.Deleted, uri}]);
            return;
        }
        if (this.directories.has(path)) {
            const hasChildren = this.hasDirectoryChildren(path);
            if (hasChildren && !options.recursive) {
                throw vscode.FileSystemError.NoPermissions(`Directory is not empty: ${uri.toString()}`);
            }
            this.deleteDirectoryTree(path);
            this.changeEmitter.fire([{type: vscode.FileChangeType.Deleted, uri}]);
            return;
        }
        throw vscode.FileSystemError.FileNotFound(uri);
    }

    rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: {overwrite: boolean}): void {
        const oldPath = this.normalisePath(oldUri);
        const newPath = this.normalisePath(newUri);
        const existing = this.files.get(oldPath);
        if (!existing) {
            throw vscode.FileSystemError.FileNotFound(oldUri);
        }
        if (this.files.has(newPath) && !options.overwrite) {
            throw vscode.FileSystemError.FileExists(newUri);
        }
        this.ensureParentDirectoryExists(newPath, newUri);
        this.files.set(newPath, {...existing, mtime: Date.now()});
        this.files.delete(oldPath);
        this.changeEmitter.fire([
            {type: vscode.FileChangeType.Deleted, uri: oldUri},
            {type: vscode.FileChangeType.Created, uri: newUri}
        ]);
    }

    watch(_uri: vscode.Uri, _options: {recursive: boolean; excludes: string[]}): vscode.Disposable {
        return {dispose() {}};
    }

    private normalisePath(uri: vscode.Uri): string {
        const path = uri.path;
        if (!path || path === '/') {
            return '/';
        }
        if (path.endsWith('/')) {
            return path.slice(0, -1);
        }
        return path;
    }

    private isReadOnlyPath(path: string): boolean {
        return path.endsWith('-readonly.txt');
    }

    private ensureParentDirectoryExists(path: string, uri: vscode.Uri): void {
        const parent = this.parentPath(path);
        if (!this.directories.has(parent)) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }
    }

    private parentPath(path: string): string {
        if (path === '/') {
            return '/';
        }
        const idx = path.lastIndexOf('/');
        if (idx <= 0) {
            return '/';
        }
        return path.slice(0, idx);
    }

    private hasDirectoryChildren(path: string): boolean {
        if (path === '/') {
            return this.files.size > 0 || this.directories.size > 1;
        }
        const prefix = `${path}/`;
        for (const filePath of this.files.keys()) {
            if (filePath.startsWith(prefix)) {
                return true;
            }
        }
        for (const dirPath of this.directories.values()) {
            if (dirPath !== path && dirPath.startsWith(prefix)) {
                return true;
            }
        }
        return false;
    }

    private deleteDirectoryTree(path: string): void {
        const prefix = path === '/' ? '/' : `${path}/`;
        if (path !== '/') {
            this.directories.delete(path);
        }
        [...this.files.keys()].forEach(filePath => {
            if (filePath.startsWith(prefix)) {
                this.files.delete(filePath);
            }
        });
        [...this.directories.values()].forEach(dirPath => {
            if (dirPath !== '/' && dirPath.startsWith(prefix)) {
                this.directories.delete(dirPath);
            }
        });
    }
}
