
const UriResolver = require('../../lib/uri-resolver');

suite('UriResolver', () => {

    test('it returns a uri object of a specified file', () => {
        const Uri = {parse: sinon.stub().returns('URI_OBJECT')};
        const pathSeparator = '/';
        const uriResolver = new UriResolver({Uri, pathSeparator});

        expect(uriResolver.getFileUri('/PATH/TO/FILE')).to.eql('URI_OBJECT');
        expect(Uri.parse).to.have.been.calledWith('file:///PATH/TO/FILE');
    });

    test('it converts Windows file path to normal form before converts it into uri object', () => {
        const Uri = {parse: sinon.stub().returns('URI_OBJECT')};
        const pathSeparator = '\\';
        const uriResolver = new UriResolver({Uri, pathSeparator});

        expect(uriResolver.getFileUri('C:\\PATH\\TO\\FILE')).to.eql('URI_OBJECT');
        expect(Uri.parse).to.have.been.calledWith('file:///C:/PATH/TO/FILE');
    });
});
