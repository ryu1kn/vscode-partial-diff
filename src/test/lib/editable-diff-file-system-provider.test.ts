import * as assert from 'assert';
import * as vscode from 'vscode';
import EditableDiffFileSystemProvider from '../../lib/editable-diff-file-system-provider';
import {EDITABLE_DIFF_SCHEME} from '../../lib/const';

suite('EditableDiffFileSystemProvider', () => {
    test('it stores and reads writable in-memory files', () => {
        const provider = new EditableDiffFileSystemProvider();
        const uri = vscode.Uri.parse(`${EDITABLE_DIFF_SCHEME}:/session-1-left.txt`);
        const payload = Buffer.from('LEFT', 'utf8');

        provider.writeFile(uri, payload, {create: true, overwrite: true});
        const stat = provider.stat(uri);
        const content = provider.readFile(uri);

        assert.equal(stat.type, vscode.FileType.File);
        assert.equal(Buffer.from(content).toString('utf8'), 'LEFT');
    });

    test('it deletes files created for a session', () => {
        const provider = new EditableDiffFileSystemProvider();
        const uri = vscode.Uri.parse(`${EDITABLE_DIFF_SCHEME}:/session-2-right.txt`);

        provider.writeFile(uri, Buffer.from('RIGHT', 'utf8'), {create: true, overwrite: true});
        provider.delete(uri, {recursive: false});

        assert.throws(() => provider.stat(uri));
    });

    test('it enforces read-only temp files', () => {
        const provider = new EditableDiffFileSystemProvider();
        const uri = vscode.Uri.parse(`${EDITABLE_DIFF_SCHEME}:/session-3-left-readonly.txt`);

        provider.writeFile(uri, Buffer.from('LEFT', 'utf8'), {create: true, overwrite: true});
        const stat = provider.stat(uri);
        assert.equal(stat.type, vscode.FileType.File);
        assert.throws(() =>
            provider.writeFile(uri, Buffer.from('UPDATED', 'utf8'), {create: true, overwrite: true})
        );
        assert.equal(Buffer.from(provider.readFile(uri)).toString('utf8'), 'LEFT');
    });
});
