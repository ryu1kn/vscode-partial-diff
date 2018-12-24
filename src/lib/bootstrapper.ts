import CommandFactory from './command-factory';
import {EXTENSION_NAMESPACE} from './const';
import {ExecutionContextLike} from './types/vscode';
import WorkspaceAdaptor from './adaptors/workspace';
import CommandAdaptor, {CommandItem} from './adaptors/command';
import {PartialDiffFileSystem} from './file-system-provider';

export default class Bootstrapper {
    private readonly commandFactory: CommandFactory;
    private readonly fileSystem: PartialDiffFileSystem;
    private readonly workspaceAdaptor: WorkspaceAdaptor;
    private readonly commandAdaptor: CommandAdaptor;

    constructor(commandFactory: CommandFactory,
                contentProvider: PartialDiffFileSystem,
                workspaceAdaptor: WorkspaceAdaptor,
                commandAdaptor: CommandAdaptor) {
        this.commandFactory = commandFactory;
        this.fileSystem = contentProvider;
        this.workspaceAdaptor = workspaceAdaptor;
        this.commandAdaptor = commandAdaptor;
    }

    initiate(context: ExecutionContextLike) {
        this.registerProviders(context);
        this.registerCommands(context);
    }

    private registerProviders(context: ExecutionContextLike) {
        const disposable = this.workspaceAdaptor.registerFileSystemProvider(this.fileSystem);
        context.subscriptions.push(disposable);
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
