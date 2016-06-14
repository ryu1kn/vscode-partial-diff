
const TempFileWriter = require('../../lib/temp-file-writer');

suite('TempFileWriter', () => {

    test('it saves a given text to a temporary file and return the file path', () => {
        const tempFileInfo = {path: 'FILE_PATH', fd: 'FILE_DESCRIPTOR'};
        const temp = {open: sinon.stub().callsArgWith(1, null, tempFileInfo)};
        const fs = {write: sinon.stub().callsArgWith(2, null)};
        const tempFileWriter = new TempFileWriter({fs, temp});
        return tempFileWriter.write('TEXT').then(filePath => {
            expect(filePath).to.eql('FILE_PATH');
            expect(temp.open).to.have.been.calledWith('partialDiff-');
            expect(fs.write).to.have.been.calledWith('FILE_DESCRIPTOR', 'TEXT');
        });
    });

    test('it rejects if it failed to prepare a temporary file', () => {
        const openError = new Error('TEMP_OPEN_ERROR');
        const temp = {open: sinon.stub().callsArgWith(1, openError, null)};
        const fs = {write: sinon.stub().callsArgWith(2, null)};
        const tempFileWriter = new TempFileWriter({fs, temp});
        return tempFileWriter.write('TEXT').then(
            throwErrorIfCalled,
            e => {
                expect(e.message).to.eql('TEMP_OPEN_ERROR');
            }
        );
    });

    test('it rejects if it failed to write to a temporary file', () => {
        const tempFileInfo = {path: 'FILE_PATH', fd: 'FILE_DESCRIPTOR'};
        const temp = {open: sinon.stub().callsArgWith(1, null, tempFileInfo)};
        const fs = {write: sinon.stub().callsArgWith(2, new Error('FS_WRITE_ERROR'))};
        const tempFileWriter = new TempFileWriter({fs, temp});
        return tempFileWriter.write('TEXT').then(
            throwErrorIfCalled,
            e => {
                expect(e.message).to.eql('FS_WRITE_ERROR');
            }
        );
    });
});
