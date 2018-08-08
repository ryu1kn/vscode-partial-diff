import MessageBar from '../../lib/message-bar';
import {mockMethods, verify} from '../helpers';
import * as vscode from 'vscode';

suite('MessageBar', () => {
    const vscWindow = mockMethods<typeof vscode.window>(['showInformationMessage']);
    const messageBar = new MessageBar(vscWindow);

    test('it shows information message', async () => {
        await messageBar.showInfo('MESSAGE');

        verify(vscWindow.showInformationMessage('MESSAGE'));
    });
});
