
'use strict';

const PREFIX = 'partialDiff-';

class TempFileWriter {

    constructor(params) {
        this._temp = params.temp;
        this._fs = params.fs;
    }

    write(text) {
        return this._openTempFile().then(info => {
            return new Promise((resolve, reject) => {
                this._fs.write(info.fd, text, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            }).then(() => info.path);
        });
    }

    _openTempFile() {
        return new Promise((resolve, reject) => {
            this._temp.open(PREFIX, (err, info) => {
                if (err) return reject(err);
                else resolve(info);
            });
        });
    }
}

module.exports = TempFileWriter;
