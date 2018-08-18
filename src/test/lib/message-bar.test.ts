import MessageBar from '../../lib/message-bar';
import {mock, verify} from '../helpers';
import WindowAdaptor from '../../lib/adaptors/window';

suite('MessageBar', () => {
    const vscWindow = mock(WindowAdaptor);
    const messageBar = new MessageBar(vscWindow);

    test('it shows information message', async () => {
        await messageBar.showInfo('MESSAGE');

        verify(vscWindow.showInformationMessage('MESSAGE'));
    });
});
