import MessageBar from '../../lib/message-bar';
import {mockObject, verify} from '../helpers';

suite('MessageBar', () => {
  const vscWindow = mockObject(['showInformationMessage']);
  const messageBar = new MessageBar({ vscWindow });

  test('it shows information message', async () => {
    await messageBar.showInfo('MESSAGE');

    verify(vscWindow.showInformationMessage('MESSAGE'));
  });
});
