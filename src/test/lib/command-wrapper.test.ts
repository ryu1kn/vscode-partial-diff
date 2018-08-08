import {Command} from '../../lib/commands/command';
import {contains, mockMethods, mockType, verify, when} from '../helpers';
import * as vscode from 'vscode';
import CommandWrapper from '../../lib/command-wrapper';
import {Logger} from '../../lib/logger';
import * as assert from 'assert';

suite('CommandWrapper', () => {

    const goodEditor = mockType<vscode.TextEditor>({name: 'good'});
    const badSyncEditor = mockType<vscode.TextEditor>({name: 'bad - sync'});
    const badAsyncEditor = mockType<vscode.TextEditor>({name: 'bad - async'});

    const command = mockMethods<Command>(['execute']);
    when(command.execute(goodEditor)).thenResolve('OK');
    when(command.execute(badSyncEditor)).thenThrow(new Error('Sync ERROR'));
    when(command.execute(badAsyncEditor)).thenReject(new Error('Async ERROR'));

    let logger: Logger;
    let commandWrapper: CommandWrapper;

    setup(() => {
        logger = mockMethods<Logger>(['error']);
        commandWrapper = new CommandWrapper(command, logger);
    });

    test('it executes a command with the same editor it received', async () => {
        assert.equal(await commandWrapper.execute(goodEditor), 'OK');
    });

    test('it logs a synchronously thrown error', async () => {
        await commandWrapper.execute(badSyncEditor);
        verify(logger.error(contains('Sync ERROR')));
    });

    test('it logs an asynchronously thrown error', async () => {
        await commandWrapper.execute(badAsyncEditor);
        verify(logger.error(contains('Async ERROR')));
    });

});
