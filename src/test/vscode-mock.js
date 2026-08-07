class Position {
    constructor(line, character) {
        this.line = line;
        this.character = character;
    }
}

class Range {
    constructor(startLineOrStart, startCharOrEnd, endLine, endChar) {
        if (typeof startLineOrStart === 'object') {
            this.start = startLineOrStart;
            this.end = startCharOrEnd;
        } else {
            this.start = new Position(startLineOrStart, startCharOrEnd);
            this.end = new Position(endLine, endChar);
        }
    }
}

class Selection {
    constructor(anchorLineOrAnchor, anchorCharOrActive, activeLine, activeChar) {
        if (typeof anchorLineOrAnchor === 'object') {
            this.anchor = anchorLineOrAnchor;
            this.active = anchorCharOrActive;
        } else {
            this.anchor = new Position(anchorLineOrAnchor, anchorCharOrActive);
            this.active = new Position(activeLine, activeChar);
        }
        this.start = this.anchor;
        this.end = this.active;
    }
}

class Uri {
    constructor(str) {
        this._str = str;
        const schemeMatch = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(str);
        this.scheme = schemeMatch ? schemeMatch[1] : '';
        if (this.scheme.length > 0) {
            const afterScheme = str.slice(this.scheme.length + 1);
            const noQuery = afterScheme.split('?')[0];
            if (noQuery.startsWith('//')) {
                const withoutAuthorityPrefix = noQuery.slice(2);
                const slashIndex = withoutAuthorityPrefix.indexOf('/');
                if (slashIndex >= 0) {
                    this.authority = withoutAuthorityPrefix.slice(0, slashIndex);
                    this.path = withoutAuthorityPrefix.slice(slashIndex);
                } else {
                    this.authority = withoutAuthorityPrefix;
                    this.path = '/';
                }
            } else {
                this.authority = '';
                this.path = noQuery.startsWith('/') ? noQuery : '/' + noQuery;
            }
        } else {
            this.authority = '';
            this.path = '';
        }
    }
    static parse(str) {
        return new Uri(str);
    }
    static from(components) {
        const authority = components.authority || '';
        const path = components.path || '';
        const query = components.query ? '?' + components.query : '';
        const fragment = components.fragment ? '#' + components.fragment : '';
        if (authority.length > 0) {
            return new Uri(`${components.scheme}://${authority}${path}${query}${fragment}`);
        }
        return new Uri(`${components.scheme}:${path}${query}${fragment}`);
    }
    static file(p) {
        return new Uri('file://' + p);
    }
    toString() {
        return this._str;
    }
}

class EventEmitter {
    constructor() {
        this._listeners = [];
        this.event = listener => {
            this._listeners.push(listener);
            return {
                dispose: () => {
                    this._listeners = this._listeners.filter(l => l !== listener);
                }
            };
        };
    }
    fire(value) {
        this._listeners.slice().forEach(listener => listener(value));
    }
    dispose() {
        this._listeners = [];
    }
}

class FileSystemError extends Error {
    static FileNotFound(resource) {
        return new FileSystemError(`File not found: ${resource && resource.toString ? resource.toString() : String(resource)}`);
    }
    static FileExists(resource) {
        return new FileSystemError(`File exists: ${resource && resource.toString ? resource.toString() : String(resource)}`);
    }
    static NoPermissions(messageOrResource) {
        return new FileSystemError(
            typeof messageOrResource === 'string'
                ? messageOrResource
                : `No permissions: ${messageOrResource && messageOrResource.toString ? messageOrResource.toString() : String(messageOrResource)}`
        );
    }
}

const FileType = {
    Unknown: 0,
    File: 1,
    Directory: 2,
    SymbolicLink: 64
};

const FileChangeType = {
    Changed: 0,
    Created: 1,
    Deleted: 2
};

const FilePermission = {
    Readonly: 1,
    Locked: 2
};

class WorkspaceEdit {
    constructor() {
        this._edits = [];
    }
    replace(uri, range, newText) {
        this._edits.push({uri, range, newText});
    }
}

const ViewColumn = {
    One: 1,
    Two: 2,
    Three: 3
};

const ConfigurationTarget = {
    Global: 1,
    Workspace: 2,
    WorkspaceFolder: 3
};

module.exports = {
    Position,
    Range,
    Selection,
    Uri,
    EventEmitter,
    WorkspaceEdit,
    ViewColumn,
    ConfigurationTarget,
    FileSystemError,
    FileType,
    FileChangeType,
    FilePermission
};
