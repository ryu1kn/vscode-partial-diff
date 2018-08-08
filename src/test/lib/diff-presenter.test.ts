import DiffPresenter from '../../lib/diff-presenter';
import {any, mock, mockObject, mockType, verify, when} from '../helpers';
import SelectionInfoRegistry from '../../lib/selection-info-registry';
import NormalisationRuleStore from '../../lib/normalisation-rule-store';
import TextTitleBuilder from '../../lib/text-title-builder';
import TextResourceUtil from '../../lib/text-resource-util';

suite('DiffPresenter', () => {
    test('it passes URI of 2 texts to compare', async () => {
        const commands = fakeCommands() as any;

        const textResourceUtil = mockObject('getUri') as any;
        when(textResourceUtil.getUri('TEXT1')).thenReturn('URI_INSTANCE_1');
        when(textResourceUtil.getUri('TEXT2')).thenReturn('URI_INSTANCE_2');

        const diffPresenter = new DiffPresenter(
            commands,
            mockType<SelectionInfoRegistry>({get: () => {}}),
            mock(NormalisationRuleStore),
            mockType<TextTitleBuilder>({build: () => {}}),
            textResourceUtil
        );

        await diffPresenter.takeDiff('TEXT1', 'TEXT2');

        verify(commands.executeCommand(
            'vscode.diff',
            'URI_INSTANCE_1',
            'URI_INSTANCE_2',
            'undefined \u2194 undefined'
        ));
    });

    test('it builds up diff view title by using TextTitleBuilder', async () => {
        const commands = fakeCommands() as any;

        const selectionInfoRegistry = mockObject('get') as any;
        when(selectionInfoRegistry.get('TEXT1')).thenReturn('TEXT_INFO_1');
        when(selectionInfoRegistry.get('TEXT2')).thenReturn('TEXT_INFO_2');

        const diffPresenter = new DiffPresenter(
            commands,
            selectionInfoRegistry,
            mock(NormalisationRuleStore),
            mockType<TextTitleBuilder>({build: (textKey: string) => `TITLE_${textKey}`}),
            mockType<TextResourceUtil>({getUri: () => {}})
        );

        await diffPresenter.takeDiff('TEXT1', 'TEXT2');

        verify(commands.executeCommand(any(), any(), any(), 'TITLE_TEXT_INFO_1 \u2194 TITLE_TEXT_INFO_2'));
    });

    test('it uses \u007E if the comparison was done with text normalisation', async () => {
        const commands = fakeCommands() as any;
        const selectionInfoRegistry = mockObject('get') as any;
        when(selectionInfoRegistry.get('TEXT1')).thenReturn('TEXT_INFO_1');
        when(selectionInfoRegistry.get('TEXT2')).thenReturn('TEXT_INFO_2');

        const diffPresenter = new DiffPresenter(
            commands,
            selectionInfoRegistry,
            mockType<NormalisationRuleStore>({hasActiveRules: true}),
            mockType<TextTitleBuilder>({build: (textKey: string) => `TITLE_${textKey}`}),
            mockType<TextResourceUtil>({getUri: () => {}})
        );

        await diffPresenter.takeDiff('TEXT1', 'TEXT2');

        verify(commands.executeCommand(any(), any(), any(), 'TITLE_TEXT_INFO_1 \u007e TITLE_TEXT_INFO_2'));
    });

    function fakeCommands() {
        return mockObject('executeCommand');
    }
});
