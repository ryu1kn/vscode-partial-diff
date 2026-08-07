import CommandFactory from './command-factory';
import ContentProvider from './content-provider';
import {EDITABLE_DIFF_SCHEME, EXTENSION_NAMESPACE, EXTENSION_SCHEME} from './const';
import {ExecutionContextLike} from './types/vscode';
import WorkspaceAdaptor from './adaptors/workspace';
import CommandAdaptor, {CommandItem} from './adaptors/command';
import EditableDiffSessionManager from './editable-diff-session-manager';
import EditableDiffFileSystemProvider from './editable-diff-file-system-provider';

export default class Bootstrapper {
    constructor(private readonly commandFactory: CommandFactory,
                private readonly contentProvider: ContentProvider,
                private readonly editableDiffFileSystemProvider: EditableDiffFileSystemProvider,
                private readonly workspaceAdaptor: WorkspaceAdaptor,
                private readonly commandAdaptor: CommandAdaptor,
                private readonly editableDiffSessionManager: EditableDiffSessionManager) {}

    initiate(context: ExecutionContextLike) {
        this.registerProviders(context);
        this.registerCommands(context);
        context.subscriptions.push({dispose: () => this.editableDiffSessionManager.dispose()});
    }

    private registerProviders(context: ExecutionContextLike) {
        const textProviderDisposable = this.workspaceAdaptor.registerTextDocumentContentProvider(
            EXTENSION_SCHEME,
            this.contentProvider
        );
        const editableFsDisposable = this.workspaceAdaptor.registerFileSystemProvider(
            EDITABLE_DIFF_SCHEME,
            this.editableDiffFileSystemProvider,
            {isCaseSensitive: true}
        );
        context.subscriptions.push(textProviderDisposable, editableFsDisposable);
    }

    private registerCommands(context: ExecutionContextLike) {
        this.commandList.forEach(cmd => {
            const disposable = this.commandAdaptor.registerCommand(cmd);
            context.subscriptions.push(disposable);
        });
    }

    private get commandList(): CommandItem[] {
        return [
            {
                name: `${EXTENSION_NAMESPACE}.diffVisibleEditors`,
                type: 'GENERAL',
                command: this.commandFactory.createCompareVisibleEditorsCommand()
            },
            {
                name: `${EXTENSION_NAMESPACE}.markSection1`,
                type: 'TEXT_EDITOR',
                command: this.commandFactory.crateSaveText1Command()
            },
            {
                name: `${EXTENSION_NAMESPACE}.markSection2AndTakeDiff`,
                type: 'TEXT_EDITOR',
                command: this.commandFactory.createCompareSelectionWithText1Command()
            },
            {
                name: `${EXTENSION_NAMESPACE}.diffSelectionWithClipboard`,
                type: 'TEXT_EDITOR',
                command: this.commandFactory.createCompareSelectionWithClipboardCommand()
            },
            {
                name: `${EXTENSION_NAMESPACE}.togglePreComparisonTextNormalizationRules`,
                type: 'GENERAL',
                command: this.commandFactory.createToggleNormalisationRulesCommand()
            }
        ];
    }
}
