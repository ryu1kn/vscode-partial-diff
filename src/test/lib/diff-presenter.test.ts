import DiffPresenter from '../../lib/diff-presenter';
import {mock, verify, when} from '../helpers';
import SelectionInfoRegistry from '../../lib/selection-info-registry';
import NormalisationRuleStore from '../../lib/normalisation-rule-store';
import CommandAdaptor from '../../lib/adaptors/command';
import WorkspaceAdaptor from '../../lib/adaptors/workspace';
import WindowAdaptor from '../../lib/adaptors/window';
import EditableDiffSessionManager from '../../lib/editable-diff-session-manager';

suite('DiffPresenter', () => {
    const selectionInfoRegistry = new SelectionInfoRegistry();
    selectionInfoRegistry.set('TEXT1', {text: 'SELECTED_TEXT1', fileName: 'FILE1', lineRanges: []});
    selectionInfoRegistry.set('TEXT2', {text: 'SELECTED_TEXT2', fileName: 'FILE2', lineRanges: []});

    test('it passes URI of 2 texts to compare', async () => {
        const commandAdaptor = mock(CommandAdaptor);
        const workspaceAdaptor = mock(WorkspaceAdaptor);
        when(workspaceAdaptor.get('enableEditableDiffs')).thenReturn(false);

        const diffPresenter = new DiffPresenter(
            selectionInfoRegistry,
            mock(NormalisationRuleStore),
            workspaceAdaptor,
            commandAdaptor,
            mock(WindowAdaptor),
            mock(EditableDiffSessionManager),
            () => new Date('2016-06-15T11:43:00Z')
        );

        await diffPresenter.takeDiff('TEXT1', 'TEXT2');

        verify(commandAdaptor.executeCommand(
            'vscode.diff',
            'partialdiff:text/TEXT1?_ts=1465990980000',
            'partialdiff:text/TEXT2?_ts=1465990980000',
            'FILE1 ↔ FILE2'
        ));
    });

    test('it opens an editable diff session when editable diffs are enabled', async () => {
        const commandAdaptor = mock(CommandAdaptor);
        const workspaceAdaptor = mock(WorkspaceAdaptor);
        when(workspaceAdaptor.get('enableEditableDiffs')).thenReturn(true);
        const editableDiffSessionManager = mock(EditableDiffSessionManager);

        const diffPresenter = new DiffPresenter(
            selectionInfoRegistry,
            mock(NormalisationRuleStore),
            workspaceAdaptor,
            commandAdaptor,
            mock(WindowAdaptor),
            editableDiffSessionManager,
            () => new Date('2016-06-15T11:43:00Z')
        );

        await diffPresenter.takeDiff('TEXT1', 'TEXT2');

        verify(editableDiffSessionManager.openDiff('TEXT1', 'TEXT2', 'FILE1 ↔ FILE2'));
    });

    test('it falls back to read-only diff for multi-selection compare', async () => {
        const multiSelectionRegistry = new SelectionInfoRegistry();
        multiSelectionRegistry.set('TEXT1', {
            text: 'SELECTED_TEXT1',
            fileName: 'FILE1',
            lineRanges: [{start: 1, end: 2}, {start: 5, end: 6}]
        });
        multiSelectionRegistry.set('TEXT2', {text: 'SELECTED_TEXT2', fileName: 'FILE2', lineRanges: []});
        const commandAdaptor = mock(CommandAdaptor);
        const workspaceAdaptor = mock(WorkspaceAdaptor);
        when(workspaceAdaptor.get('enableEditableDiffs')).thenReturn(true);
        const windowAdaptor = mock(WindowAdaptor);
        const editableDiffSessionManager = mock(EditableDiffSessionManager);

        const diffPresenter = new DiffPresenter(
            multiSelectionRegistry,
            mock(NormalisationRuleStore),
            workspaceAdaptor,
            commandAdaptor,
            windowAdaptor,
            editableDiffSessionManager,
            () => new Date('2016-06-15T11:43:00Z')
        );

        await diffPresenter.takeDiff('TEXT1', 'TEXT2');

        verify(windowAdaptor.showInformationMessage(
            'Editable mode does not support multi-selection compare. Falling back to read-only diff.'
        ));
        verify(commandAdaptor.executeCommand(
            'vscode.diff',
            'partialdiff:text/TEXT1?_ts=1465990980000',
            'partialdiff:text/TEXT2?_ts=1465990980000',
            'FILE1 (ll.2-3,ll.6-7) ↔ FILE2'
        ));
    });
});
