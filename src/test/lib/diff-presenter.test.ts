import DiffPresenter from '../../lib/diff-presenter';
import {any, mock, mockType, verify} from '../helpers';
import SelectionInfoRegistry from '../../lib/selection-info-registry';
import NormalisationRuleStore from '../../lib/normalisation-rule-store';
import CommandAdaptor from '../../lib/adaptors/command';

suite('DiffPresenter', () => {

    const selectionInfoRegistry = new SelectionInfoRegistry();
    selectionInfoRegistry.set('TEXT1', {text: 'SELECTED_TEXT1', fileName: 'FILE1', lineRanges: []});
    selectionInfoRegistry.set('TEXT2', {text: 'SELECTED_TEXT2', fileName: 'FILE2', lineRanges: []});

    test('it passes URI of 2 texts to compare', async () => {
        const commandAdaptor = mock(CommandAdaptor);

        const diffPresenter = new DiffPresenter(
            selectionInfoRegistry,
            mock(NormalisationRuleStore),
            commandAdaptor,
            () => new Date('2016-06-15T11:43:00Z')
        );

        await diffPresenter.takeDiff('TEXT1', 'TEXT2');

        verify(commandAdaptor.executeCommand(
            'vscode.diff',
            'partialdiff:text/TEXT1?_ts=1465990980000',
            'partialdiff:text/TEXT2?_ts=1465990980000',
            'FILE1 \u2194 FILE2'
        ));
    });

    test('it builds up diff view title by using TextTitleBuilder', async () => {
        const commandAdaptor = mock(CommandAdaptor);

        const diffPresenter = new DiffPresenter(
            selectionInfoRegistry,
            mock(NormalisationRuleStore),
            commandAdaptor,
            () => new Date()
        );

        await diffPresenter.takeDiff('TEXT1', 'TEXT2');

        verify(commandAdaptor.executeCommand(any(), any(), any(), 'FILE1 \u2194 FILE2'));
    });

    test('it uses \u007E if the comparison was done with text normalisation', async () => {
        const commandAdaptor = mock(CommandAdaptor);

        const diffPresenter = new DiffPresenter(
            selectionInfoRegistry,
            mockType<NormalisationRuleStore>({hasActiveRules: true}),
            commandAdaptor,
            () => new Date()
        );

        await diffPresenter.takeDiff('TEXT1', 'TEXT2');

        verify(commandAdaptor.executeCommand(any(), any(), any(), 'FILE1 \u007e FILE2'));
    });
});
