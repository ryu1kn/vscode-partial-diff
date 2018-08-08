import Bootstrapper from '../../lib/bootstrapper';
import {mock, mockMethods, when} from '../helpers';
import * as assert from 'assert';
import CommandFactory from '../../lib/command-factory';
import ContentProvider from '../../lib/content-provider';
import * as vscode from 'vscode';

suite('Bootstrapper', () => {
    const commandMap = {
        saveText1Command: fakeExtensionCommand(),
        compareSelectionWithText1Command: fakeExtensionCommand(),
        compareSelectionWithClipboardCommand: fakeExtensionCommand(),
        compareVisibleEditorsCommand: fakeExtensionCommand(),
        toggleNormalisationRulesCommand: fakeExtensionCommand()
    };
    const contentProvider = mock(ContentProvider);

    const bootstrapper = new Bootstrapper(
        fakeCommandFactory(),
        contentProvider,
        {
            commands: fakeVSCodeCommands(),
            workspace: fakeVSCodeWorkspace()
        }
    );

    test('it registers commands', () => {
        const context = {subscriptions: []};
        bootstrapper.initiate(context);

        assert.deepEqual(context.subscriptions, [
            'DISPOSABLE_scheme',
            'DISPOSABLE_diffVisibleEditors',
            'DISPOSABLE_markSection1',
            'DISPOSABLE_markSection2AndTakeDiff',
            'DISPOSABLE_diffSelectionWithClipboard',
            'DISPOSABLE_togglePreComparisonTextNormalizationRules'
        ]);
    });

    function fakeVSCodeCommands() {
        const commands = mockMethods<typeof vscode.commands>([
            'registerCommand',
            'registerTextEditorCommand'
        ]);
        when(
            commands.registerCommand(
                'extension.partialDiff.diffVisibleEditors',
                commandMap.compareVisibleEditorsCommand.execute,
                commandMap.compareVisibleEditorsCommand
            )
        ).thenReturn('DISPOSABLE_diffVisibleEditors');
        when(
            commands.registerTextEditorCommand(
                'extension.partialDiff.markSection1',
                commandMap.saveText1Command.execute,
                commandMap.saveText1Command
            )
        ).thenReturn('DISPOSABLE_markSection1');
        when(
            commands.registerTextEditorCommand(
                'extension.partialDiff.markSection2AndTakeDiff',
                commandMap.compareSelectionWithText1Command.execute,
                commandMap.compareSelectionWithText1Command
            )
        ).thenReturn('DISPOSABLE_markSection2AndTakeDiff');
        when(
            commands.registerTextEditorCommand(
                'extension.partialDiff.diffSelectionWithClipboard',
                commandMap.compareSelectionWithClipboardCommand.execute,
                commandMap.compareSelectionWithClipboardCommand
            )
        ).thenReturn('DISPOSABLE_diffSelectionWithClipboard');
        when(
            commands.registerCommand(
                'extension.partialDiff.togglePreComparisonTextNormalizationRules',
                commandMap.toggleNormalisationRulesCommand.execute,
                commandMap.toggleNormalisationRulesCommand
            )
        ).thenReturn('DISPOSABLE_togglePreComparisonTextNormalizationRules');
        return commands;
    }

    function fakeCommandFactory() {
        const commandFactory = mock(CommandFactory);
        when(commandFactory.crateSaveText1Command()).thenReturn(commandMap.saveText1Command);
        when(commandFactory.createCompareSelectionWithText1Command()).thenReturn(commandMap.compareSelectionWithText1Command);
        when(commandFactory.createCompareSelectionWithClipboardCommand()).thenReturn(commandMap.compareSelectionWithClipboardCommand);
        when(commandFactory.createCompareVisibleEditorsCommand()).thenReturn(commandMap.compareVisibleEditorsCommand);
        when(commandFactory.createToggleNormalisationRulesCommand()).thenReturn(commandMap.toggleNormalisationRulesCommand);
        return commandFactory;
    }

    function fakeVSCodeWorkspace() {
        const vsWorkspace = mockMethods<typeof vscode.workspace>(['registerTextDocumentContentProvider']);
        when(
            vsWorkspace.registerTextDocumentContentProvider(
                'partialdiff',
                contentProvider
            )
        ).thenReturn('DISPOSABLE_scheme');
        return vsWorkspace;
    }

    function fakeExtensionCommand() {
        return {execute: () => {}};
    }
});
