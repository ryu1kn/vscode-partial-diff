
'use strict';

const WINDOWS_PATH_SEPARATOR = '\\';
const NORMAL_PATH_SEPARATOR = '/';

class UriResolver {
    constructor(params) {
        this._pathSeparator = params.pathSeparator;
        this._Uri = params.Uri;
    }

    _normaliseFilePath(filePath) {
        if (this._pathSeparator === WINDOWS_PATH_SEPARATOR) {
            return NORMAL_PATH_SEPARATOR +
                filePath.split(WINDOWS_PATH_SEPARATOR).join(NORMAL_PATH_SEPARATOR);
        }
        return filePath;
    }

    getFileUri(filePath) {
        return this._Uri.parse(`file://${this._normaliseFilePath(filePath)}`);
    }
}

module.exports = UriResolver;
