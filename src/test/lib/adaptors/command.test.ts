import * as assert from 'assert';
import * as vscode from 'vscode';
import CommandAdaptor from '../../../lib/adaptors/command';

suite('CommandAdaptor', () => {
    test('it opens editable diff above with editable-original options', async () => {
        let capturedArgs: unknown[] | undefined;
        const commands = {
            executeCommand: async (...args: unknown[]) => {
                capturedArgs = args;
                return undefined;
            }
        };
        const commandAdaptor = new CommandAdaptor(commands as any, vscode.Uri.parse, console);

        await commandAdaptor.executeDiffUris(
            vscode.Uri.parse('file:///left.txt'),
            vscode.Uri.parse('file:///right.txt'),
            'TITLE'
        );

        assert.ok(capturedArgs);
        assert.equal(capturedArgs![0], '_workbench.diff');
        assert.equal((capturedArgs![1] as vscode.Uri).toString(), 'file:///left.txt');
        assert.equal((capturedArgs![2] as vscode.Uri).toString(), 'file:///right.txt');
        assert.equal(capturedArgs![3], 'TITLE');
        assert.deepEqual(capturedArgs![4], [
            'up',
            {
                originalEditable: true,
                renderSideBySide: true,
                useInlineViewWhenSpaceIsLimited: false
            }
        ]);
    });

    test('it can disable editing on original side for editable diff', async () => {
        let capturedArgs: unknown[] | undefined;
        const commands = {
            executeCommand: async (...args: unknown[]) => {
                capturedArgs = args;
                return undefined;
            }
        };
        const commandAdaptor = new CommandAdaptor(commands as any, vscode.Uri.parse, console);

        await commandAdaptor.executeDiffUris(
            vscode.Uri.parse('file:///left.txt'),
            vscode.Uri.parse('file:///right.txt'),
            'TITLE',
            {originalEditable: false}
        );

        assert.ok(capturedArgs);
        assert.equal(capturedArgs![0], '_workbench.diff');
        assert.deepEqual(capturedArgs![4], [
            'up',
            {
                originalEditable: false,
                renderSideBySide: true,
                useInlineViewWhenSpaceIsLimited: false
            }
        ]);
    });

    test('it falls back to default group when directional placement is not accepted', async () => {
        const capturedCalls: unknown[][] = [];
        const commands = {
            executeCommand: async (...args: unknown[]) => {
                capturedCalls.push(args);
                if (capturedCalls.length === 1) {
                    throw new Error('unsupported preferred group');
                }
                return undefined;
            }
        };
        const commandAdaptor = new CommandAdaptor(commands as any, vscode.Uri.parse, console);

        await commandAdaptor.executeDiffUris(
            vscode.Uri.parse('file:///left.txt'),
            vscode.Uri.parse('file:///right.txt'),
            'TITLE'
        );

        assert.equal(capturedCalls.length, 2);
        assert.deepEqual(capturedCalls[0][4], [
            'up',
            {
                originalEditable: true,
                renderSideBySide: true,
                useInlineViewWhenSpaceIsLimited: false
            }
        ]);
        assert.deepEqual(capturedCalls[1][4], [
            undefined,
            {
                originalEditable: true,
                renderSideBySide: true,
                useInlineViewWhenSpaceIsLimited: false
            }
        ]);
    });
});
