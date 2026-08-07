const Module = require('module');
const path = require('path');

const mockPath = path.join(__dirname, 'vscode-mock.js');
const origResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
    if (request === 'vscode') {
        return mockPath;
    }
    return origResolveFilename.call(this, request, parent, isMain, options);
};
