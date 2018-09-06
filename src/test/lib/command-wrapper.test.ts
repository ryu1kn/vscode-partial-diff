import {Command} from '../../lib/commands/command';
import {contains, mock, mockMethods, mockType, verify} from '../helpers';
import * as vscode from 'vscode';
import CommandWrapper from '../../lib/command-wrapper';
import {Logger} from '../../lib/types/logger';
import * as assert from 'assert';
import TextEditor from '../../lib/adaptors/text-editor';
import {NullVsTelemetryReporter, TelemetryReporterLocator, VsTelemetryReporterLike} from '../../lib/telemetry-reporter';
import {join} from 'path';

suite('CommandWrapper', () => {

    const packageJsonPath = join(__dirname, '..', '..', '..', 'package.json');

    class MockCommand implements Command {
        async execute(editor: TextEditor) {
            switch (editor.fileName) {
                case 'good': return 'OK';
                case 'bad - sync': throw new Error('Sync ERROR');
                case 'bad - async': return Promise.reject(new Error('Async ERROR'));
                default: return '';
            }
        }
    }

    const goodEditor = mockType<vscode.TextEditor>({document: {fileName: 'good'}});
    const badSyncEditor = mockType<vscode.TextEditor>({document: {fileName: 'bad - sync'}});
    const badAsyncEditor = mockType<vscode.TextEditor>({document: {fileName: 'bad - async'}});

    const command = new MockCommand();

    let logger: Logger;
    let commandWrapper: CommandWrapper;
    let telemetryReporter: VsTelemetryReporterLike;

    setup(() => {
        logger = mockMethods<Logger>(['error']);
        telemetryReporter = mock(NullVsTelemetryReporter);
        TelemetryReporterLocator.load(packageJsonPath, () => telemetryReporter);
        commandWrapper = new CommandWrapper('COMMAND_NAME', command, logger);
    });

    test('it executes a command with the same editor it received', async () => {
        assert.equal(await commandWrapper.execute(goodEditor), 'OK');
    });

    test('it logs a synchronously thrown error', async () => {
        await commandWrapper.execute(badSyncEditor);
        verify(logger.error(contains('Sync ERROR')));
        verify(telemetryReporter.sendTelemetryEvent('commandErrored', {commandName: 'COMMAND_NAME'}));
    });

    test('it logs an asynchronously thrown error', async () => {
        await commandWrapper.execute(badAsyncEditor);
        verify(logger.error(contains('Async ERROR')));
        verify(telemetryReporter.sendTelemetryEvent('commandErrored', {commandName: 'COMMAND_NAME'}));
    });

    test('it reports command invocation', async () => {
        await commandWrapper.execute(goodEditor);

        verify(telemetryReporter.sendTelemetryEvent('commandTriggered', {commandName: 'COMMAND_NAME'}));
    });
});
